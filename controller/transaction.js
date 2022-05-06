const AppDataSource = require("../database/config");
const Transaction = require("../entities/Transaction");
const User = require("../entities/User");
const Item = require("../entities/Item");
const { RES_SUCCESS_CODE, RES_ERROR_DATABASE } = require('../constants');
const moment = require('moment');
require('dotenv').config();

const formatDateTime = (date, format = 'YYYY-MM-DD h:mm:ss') =>
    date ? moment(date).format(format) : date;
const getTranc = async (req, res, next) => {
    const { id } = req.params;
    const transactions = await AppDataSource
        .getRepository(Transaction)
        .createQueryBuilder("transactions")
        .where("transactions.id = :id", { id: id })
        .leftJoinAndSelect("transactions.item", "items.id")
        .leftJoinAndSelect("transactions.seller", "users.id")
        .getOne()
        .then(async (transactions) => {
            res.json(transactions);
            return false;
        })
        .catch((error) => {
            return res.status(404).json({ code: RES_ERROR_DATABASE, msg: "Database request failed!" });
        });;
    console.log(transactions);
}

const getUserTranc = async (req, res, next) => {
    const { id } = req.params;
    const users = await AppDataSource
        .getRepository(Transaction)
        .createQueryBuilder("transactions")
        .where('transactions.seller = :id', { id: id })
        .orWhere('transactions.buyer = :id', { id: id })
        .leftJoinAndSelect("transactions.item", "items.id")        
        .getMany()
        .then(async (item) => {
            res.json(item);
            return false;
        })
        .catch((error) => {
            return res.status(404).json({ code: RES_ERROR_DATABASE, msg: "Database request failed!" });
        });;
    console.log(users);
}

const getItemTranc = async (req, res, next) => {
    const { id } = req.params;
    const users = await AppDataSource
        .getRepository(Transaction)
        .createQueryBuilder("transactions")
        .where('transactions.item = :id', { id: id })        
        .leftJoinAndSelect("transactions.seller", "users.id")
        .getMany()
        .then(async (item) => {
            res.json(item);
            return false;
        })
        .catch((error) => {
            return res.status(404).json({ code: RES_ERROR_DATABASE, msg: "Database request failed!" });
        });;
    console.log(users);
}


const createTranc = async (req, res, next) => {

    // const { collection, nft_id, price, creator, currency, owner } = req.body;
    // //2022-05-11 17:39:38
    // const formatDateTime = (date, format = 'YYYY-MM-DD h:mm:ss') =>
    //   date ? moment(date).format(format) : date;  
    const transaction = {
        item: 6,
        seller: 59,
        buyer: 59,
        sold_price: 1,
        created_at:"2022-05-11 17:39:38"
    }
    await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Transaction)
        .values([
            transaction
        ])
        .execute()
        .then(response => {
            res.json({ code: RES_SUCCESS_CODE, ...transaction });
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({ code: RES_ERROR_DATABASE, error })
        })
    console.log(transaction);

}

const updateTranc = async (req, res, next) => {
    const { id } = req.params;
    await AppDataSource
        .createQueryBuilder()
        .update(Transaction)
        .set({ seller: 66 })
        .where("id = :id", { id: id })
        .execute()
        .then(response => {
            res.json({ code: RES_SUCCESS_CODE, ...response });
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({ code: RES_ERROR_DATABASE, error })
        })
}

const deleteTranc = async (req, res, next) => {
    const { id } = req.params;
    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(Transaction)
        .where("id = :id", { id: id })
        .execute()
        .then(response => {
            res.json({ code: RES_SUCCESS_CODE, ...response });
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({ code: RES_ERROR_DATABASE, error })
        })
}

module.exports = { getTranc, createTranc, updateTranc, deleteTranc, getUserTranc, getItemTranc };
