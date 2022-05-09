const { Request } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require("../database/config");
const User = require("../entities/User");
const { RES_SUCCESS_CODE, RES_ERROR_REGISTER, RES_WRONG_PASSWORD, RES_ERROR_LOGIN, RES_ERROR_LOGOUT, RES_ERROR_DATABASE } = require('../constants');
const { now } = require('lodash');
const moment = require('moment');
require('dotenv').config();

const register = async (req, res, next) => {

  const { fileName, email, password, fullname, nickname } = req.body;

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadFile = req.files.file;

  const result = await uploadFile.mv(`./public/images/${fileName}`, function (err) {
    if (err) {
      console.log(err)
      return false;
    }
    return true;
  })

  const users = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("users")
    .where("users.email = :email", { email: email })
    .getOneOrFail()
    .then(async (item) => {
      return item;
    })
    .catch((error) => {
      return false;
    });

  if (users) {
    return res.status(400).json({ code: RES_ERROR_REGISTER, error: "The user email is already existing!" })
  }

  const formatDateTime = (date, format = 'YYYY-MM-DD hh:mm:ss') =>
    date ? moment(date).format(format) : date;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const user = {
    email: email,
    fullname,
    nickname,
    password: hashPassword,
    img_url: `/images/${fileName}`,
    wallet_addr: "0x000000000000000000",
    updated_at: formatDateTime(new Date()),
    created_at: formatDateTime(new Date()),
    status: 1
  }

  await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      user
    ])
    .execute()
    .then(response => {
      res.json({ code: RES_SUCCESS_CODE, ...user });
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ code: RES_ERROR_REGISTER, error })
    })

}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("users")
    .where("users.email = :email", { email: email })
    .getOne()
    .then(async (user) => {
      console.log(user.password);
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ code: RES_WRONG_PASSWORD, msg: "Wrong Password" });
      const userId = user.id;
      const fullname = user.fullname;
      const nickname = user.nickname;      
      const accessToken = jwt.sign({ userId, email, fullname, nickname }, process.env.JWT_SECRET, {
        expiresIn: '15s'
      });
      const refreshToken = jwt.sign({ userId, email }, process.env.JWT_REFRESH, {
        expiresIn: '1d'
      });            
      await AppDataSource
        .createQueryBuilder()
        .update(User)
        .set({ refresh_token: refreshToken })
        .where("id = :id", { id: userId })
        .execute()       

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });
      return res.json({ code: RES_SUCCESS_CODE, accessToken, refreshToken });
    })
    .catch((error) => {
      return res.status(404).json({ code: RES_ERROR_LOGIN, msg: "User Cannot be Found!" });
    });

}

const getUser = async (req, res, next) => {
  //faker
  const { id } = req.params;

  const users = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("users")
    .leftJoinAndSelect("users.items", "item")
    .leftJoinAndSelect("item.currency", "currency")
    .where("users.id = :id", { id: id })
    .getOne()
    .then(async (item) => {
      res.json(item);
      return false;
    })
    .catch((error) => {
      return res.status(404).json({ code: RES_ERROR_DATABASE, msg: "User Cannot be Found!" });
    });

}

const getTopUser = async (req, res, next) => {
  const users = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("users")
    .leftJoin("users.transactions", "seller")
    .leftJoin("seller.currency", "currency")
    .addSelect("SUM(seller.sold_price * currency.swapRate)", "totalSale")
    .groupBy('users.id')
    .orderBy("totalSale", "DESC")
    .take(10)
    .getRawMany()
    .then(async (users) => {
      res.json(users);
      return false;
    })
    .catch((error) => {
      return res.status(404).json({ code: RES_ERROR_DATABASE, msg: error });
    });;
  console.log(users);
}

const logout = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("users")
    .where("users.refresh_token = :refresh_token", { refresh_token: refreshToken })
    .getOne()
    .then(async (user) => {
      if (!user) return res.sendStatus(204);
      const userId = user.id;
      await AppDataSource
        .createQueryBuilder()
        .update(User)
        .set({ refresh_token: null })
        .where("id = :id", { id: userId })
        .execute()
      res.clearCookie('refreshToken');
      return res.sendStatus(200);
    })
    .catch(error => {
      return res.status(404).json({ code: RES_ERROR_LOGOUT, msg: "No Refresh Token Found!" });
    })

}

const refreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if(refreshToken == null) return res.sendStatus(401);
    const user = await AppDataSource
      .getRepository(User)
      .createQueryBuilder("users")
      .where("users.refresh_token = :refresh_token", { refresh_token: refreshToken })
      .getOne()
      .then(async (user) => {
        if (!user) return res.sendStatus(204);
        return res.json({ code: RES_SUCCESS_CODE, msg: "refreshToken Updated" });
      })
      .catch(error => {
        return res.sendStatus(404);
      })

  } catch (error) {
    console.log(error);
  }
}

module.exports = { register, login, getUser, logout, refreshToken, getTopUser };