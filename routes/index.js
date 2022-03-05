const express = require('express');
const router = express.Router();

router.use('/rates', require('./rates'));
router.use('/blogs', require('./blogs'));
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));


module.exports = router;