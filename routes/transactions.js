const express = require('express');
const {getTranc, createTranc, updateTranc, deleteTranc, getUserTranc,  getItemTranc} = require('../controller/transaction');
const router = express.Router();

/* GET home page. */
router.get('/create', createTranc);
router.get('/update/:id', updateTranc);
router.get('/delete/:id', deleteTranc);
router.get('/user/:id', getUserTranc);
router.get('/item/:id', getItemTranc);
router.get('/:id', getTranc);

module.exports = router;
