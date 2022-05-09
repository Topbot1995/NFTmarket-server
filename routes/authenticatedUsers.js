const express = require('express');
const router = express.Router();
const User = require('../controller/user');
const authenticateUser = require('../middleware/authenticate');

router.get('/update/:id', User.getUser);
router.get('/delete/:id', User.getUser);
router.get('/:id', User.getUser);

module.exports = router;
