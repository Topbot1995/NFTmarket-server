const AppDataSource = require("../database/config");
const Currency = require("../entities/Currency");
const { RES_SUCCESS_CODE, RES_ERROR_DATABASE } = require('../constants');
const { now } = require('lodash');
const moment = require('moment');
require('dotenv').config();

const formatDateTime = (date, format = 'YYYY-MM-DD h:mm:ss') =>
    date ? moment(date).format(format) : date;

const getCurrency = async (req, res, next) => {
    const { id } = req.params;
    const currency = await AppDataSource
        .getRepository(Currency)
        .createQueryBuilder("currencies")
        .where("currencies.id = :id", { id: id })
        .getOne()
        .then(async (currency) => {
            res.json(currency);
            return false;
        })
        .catch((error) => {
            return res.status(404).json({ code: RES_ERROR_DATABASE, msg: "User Cannot be Found!" });
        });;
    console.log(currency);
}

const getAllCurrencies = async (req, res, next) => {
    const currencies = await AppDataSource
        .getRepository(Currency)
        .createQueryBuilder("currencies")
        .getMany()
        .then(async (currencies) => {
            res.json(currencies);
            return false;
        })
        .catch((error) => {
            return res.status(404).json({ code: RES_ERROR_DATABASE, msg: "User Cannot be Found!" });
        });;
    console.log(currencies);
}


const createCurrency = async (req, res, next) => {

    // const { collection, nft_id, price, creator, currency, owner } = req.body;
    // //2022-05-11 17:39:38
    // const formatDateTime = (date, format = 'YYYY-MM-DD h:mm:ss') =>
    //   date ? moment(date).format(format) : date;  
    const currency = {
        address: "0xdfsdlflerferferflerfl",
        symbol: "WETH",
        name: "WETH",
        status: 0
    }
    await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Currency)
        .values([
            currency
        ])
        .execute()
        .then(response => {
            res.json({ code: RES_SUCCESS_CODE, ...currency });
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({ code: RES_ERROR_DATABASE, error })
        })
    console.log(currency);

}

const updateCurrency = async (req, res, next) => {
    const { id } = req.params;
    await AppDataSource
        .createQueryBuilder()
        .update(Currency)
        .set({ name: "ETHddd" })
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

const deleteCurrency = async (req, res, next) => {
    const { id } = req.params;
    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(Currency)
        .where("id = :id", { id: id })
        .execute()
        .then(response => {
            res.json({ code: RES_SUCCESS_CODE, ...response });
        })
        .catch(async error => {
            await AppDataSource
                .createQueryBuilder()
                .update(Currency)
                .set({ status: 1 })
                .where("id = :id", { id: id })
                .execute()
                .then(response => {
                    res.json({ code: RES_SUCCESS_CODE, ...response });
                })
                .catch(error => {
                    console.log(error)
                    res.status(400).json({ code: RES_ERROR_DATABASE, error })
                })
        })
}
module.exports = { getCurrency, getAllCurrencies, createCurrency, updateCurrency, deleteCurrency };
