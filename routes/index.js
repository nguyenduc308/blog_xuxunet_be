const express = require('express');
const router = express.Router();

router.use('/rates', require('./rates'));
router.use('/blogs', require('./blogs'));

module.exports = router;