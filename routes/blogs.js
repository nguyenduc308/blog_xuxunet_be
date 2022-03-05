const router = require('express').Router();
const controller = require('../controllers/BlockController');

router.get('/', controller.find);

module.exports = router;