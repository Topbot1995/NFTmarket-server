const express = require('express');
const {getItem, createItem, updateItem, deleteItem } = require('../controller/item');
const router = express.Router();

/* GET home page. */
router.get('/create', createItem);
router.get('/update/:id', updateItem);
router.get('/delete/:id', deleteItem);
router.get('/:id', getItem);

module.exports = router;
