const router = require('express').Router();
const controller = require('../controllers/BlogController');
const { authenticate, authorization } = require('../middlewares/auth');

router.get('/', controller.find);
router.post('/', authenticate, authorization(['admin', 'mod']), controller.create);

module.exports = router;