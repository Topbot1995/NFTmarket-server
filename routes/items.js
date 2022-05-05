const express = require('express');
const {getItem, getUserItem, createItem, updateItem, deleteItem, getAllItem } = require('../controller/item');
const router = express.Router();

/* GET home page. */
router.get('/create', createItem);
router.get('/update/:id', updateItem);
router.get('/delete/:id', deleteItem);
router.get('/all', getAllItem);
router.get('/user/:id', getUserItem);
router.get('/:id', getItem);

module.exports = router;
