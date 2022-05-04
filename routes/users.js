const express = require('express');
const router = express.Router();
const User = require('../controller/user');

router.post('/login', User.login);
router.post('/refresh-token', User.refreshToken);
router.post('/register', User.register);
router.get('/logout', User.logout);
router.get('/:id', User.getUser);

module.exports = router;
