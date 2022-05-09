const AppDataSource = require("../database/config");
const User = require("../entities/User");
const Item = require("../entities/Item");
const { RES_SUCCESS_CODE, RES_ERROR_DATABASE } = require('../constants');
const { now } = require('lodash');
const moment = require('moment');
require('dotenv').config();

const formatDateTime = (date, format = 'YYYY-MM-DD h:mm:ss') =>
    date ? moment(date).format(format) : date;

const getItem = async (req, res, next) => {
    const { id } = req.params;
    const users = await AppDataSource
        .getRepository(Item)
        .createQueryBuilder("items")
        .where("items.id = :id", { id: id })
        .leftJoinAndSelect("items.owner", "owner")        
        .leftJoinAndSelect("items.creator", "creator")        
        .leftJoinAndSelect("items.currency", "currencies.id")
        .getOne()
        .then(async (item) => {
            res.json(item);
            return false;
        })
        .catch((error) => {
            return res.status(404).json({ code: RES_ERROR_DATABASE, msg: "User Cannot be Found!" });
        });
    console.log(users);
}

const getAllItem = async (req, res, next) => {
    const users = await AppDataSource
        .getRepository(Item)
        .createQueryBuilder("items")
        .leftJoinAndSelect("items.creator", "users.id")
        .leftJoinAndSelect("items.currency", "currencies.id")
        .orderBy("items.created_at", "DESC")
        .take(20)
        .getMany()
        .then(async (item) => {
            res.json(item);
            return false;
        })
        .catch((error) => {
            return res.status(404).json({ code: RES_ERROR_DATABASE, msg: "User Cannot be Found!" });
        });;
    console.log(users);
}

const getUserItem = async (req, res, next) => {
    const { id } = req.params;
    const { keyword, category } = req.query;
    //console.log(req.query);
    const users = await AppDataSource
        .getRepository(Item)
        .createQueryBuilder("items")
        .leftJoinAndSelect("items.currency", "currencies.id")
        .where("items.creator = :id", { id: id })
        .getMany()
        .then(async (item) => {
            res.json(item);
            return false;
        })
        .catch((error) => {
            return res.status(404).json({ code: RES_ERROR_DATABASE, msg: "User Cannot be Found!" });
        });;
    console.log(users);
}

const createItem = async (req, res, next) => {

    //fake req.param

    const { nft_id, creator, price, collection, currency, owner, name, desc, img_url } = req.body;

    // //2022-05-11 17:39:38
    const formatDateTime = (date, format = 'YYYY-MM-DD hh:mm:ss') =>
        date ? moment(date).format(format) : date;    
    const item = {
        name: name,
        desc: desc,
        collection: collection,
        nft_id: nft_id,
        price: price,
        img_url: img_url,
        creator: creator,   
        currency: currency,
        owner: owner,
        updated_at: formatDateTime(new Date),
        created_at: formatDateTime(new Date),
        status: 0
    }
    await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Item)
        .values([
            item
        ])
        .execute()
        .then(response => {
            res.json({ code: RES_SUCCESS_CODE, ...item });
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({ code: RES_ERROR_DATABASE, error })
        })
    console.log(item);

}

const updateItem = async (req, res, next) => {
    const { id } = req.params;
    await AppDataSource
        .createQueryBuilder()
        .update(Item)
        .set({ nft_id: 100 })
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

const deleteItem = async (req, res, next) => {
    const { id } = req.params;
    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(Item)
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

module.exports = { getItem, createItem, updateItem, deleteItem, getUserItem, getAllItem };
