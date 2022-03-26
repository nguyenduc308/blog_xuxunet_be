const router = require('express').Router();
const controller = require('../controllers/CommentController');
const { authenticate, authorization } = require('../middlewares/auth');

router.post('/', authenticate,  controller.create);
router.get('/', authenticate, authorization(['admin', 'mod']),  controller.find);
router.delete('/:id', authenticate, authorization(['admin', 'mod']),  controller.destroy);

module.exports = router;
