const router = require('express').Router();
const controller = require('../controllers/UserController');
const { authenticate } = require('../middlewares/auth');

router.get('/profile', authenticate, controller.getMe);

module.exports = router;