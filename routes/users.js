const express = require('express');
const router = express.Router();
const User = require('../controller/user');
const authenticateUser = require('../middleware/authenticate');
const upload = require('../utils/upload');

router.post('/login', User.login);
router.post('/refresh-token', User.refreshToken);
router.post('/register',  User.register);
router.get('/getTop', User.getTopUser);
router.get('/logout', User.logout);
router.post('/:id', User.getUser);

module.exports = router;
