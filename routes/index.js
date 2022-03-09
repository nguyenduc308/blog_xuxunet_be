const express = require('express');
const router = express.Router();

router.use('/rates', require('./rates'));
router.use('/blogs', require('./blogs'));
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/categories', require('./categories'));
router.use('/comments', require('./comments'));
router.use('/tracking', require('./tracking'));
router.use('/jar-sheets', require('./jar-sheets'));

module.exports = router;