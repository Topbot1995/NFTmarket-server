const express = require('express');
const {getCurrency, getAllCurrencies, createCurrency, updateCurrency, deleteCurrency} = require('../controller/currency');
const router = express.Router();

/* GET home page. */
router.get('/create', createCurrency);
router.get('/delete/:id', deleteCurrency);
router.get('/update/:id', updateCurrency);
router.get('/all', getAllCurrencies);
router.get('/:id', getCurrency);

module.exports = router;
