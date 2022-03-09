const router = require('express').Router();
const controller = require('../controllers/JarController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.find);

module.exports = router;