const router = require('express').Router();
const controller = require('../controllers/UserController');
const { authenticate, authorization } = require('../middlewares/auth');

router.get('/profile', authenticate, controller.getMe);
router.put('/update-profile', authenticate, controller.updateProfile);
router.get('/', authenticate, authorization(['admin', 'mod']), controller.find);

module.exports = router;