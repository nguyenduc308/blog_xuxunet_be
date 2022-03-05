const router = require('express').Router();
const controller = require('../controllers/BlogController');

router.get('/', controller.find);
router.post('/', controller.create);

module.exports = router;