const router = require('express').Router();
const controller = require('../controllers/RateController');

router.post('/', controller.create);

module.exports = router;