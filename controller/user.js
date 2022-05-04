const { Request } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require("../database/config");
const User = require("../entities/User");
const { RES_SUCCESS_CODE, RES_ERROR_REGISTER, RES_WRONG_PASSWORD, RES_ERROR_LOGIN, RES_ERROR_LOGOUT } = require('../constants');
const { now } = require('lodash');
const moment = require('moment');
require('dotenv').config();

const register = async (req, res, next) => {

  console.log(req.body);

  const { email, password, fullname, nickname } = req.body;
  //2022-05-11 17:39:38
  const formatDateTime = (date, format = 'YYYY-MM-DD h:mm:ss') =>
    date ? moment(date).format(format) : date;  
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const user = {
    email: email,
    fullname,
    nickname,
    password: hashPassword,
    wallet_addr: "topbot1995",
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
      const email = user.email;
      const accessToken = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
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
      res.json({ code: RES_SUCCESS_CODE, accessToken, refreshToken });
    })
    .catch((error) => {
      return res.status(404).json({ code: RES_ERROR_LOGIN, msg: "User Cannot be Found!" });
    });

}

const getUser = (req, res, next) => {
  res.send("getUser");
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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
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

module.exports = { register, login, getUser, logout, refreshToken };