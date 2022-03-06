const router = require('express').Router();
const controller = require('../controllers/BlogController');
const { authenticate, authorization } = require('../middlewares/auth');

router.get('/', controller.find);
router.get('/deleted', authenticate, authorization(['admin', 'mod']), controller.findSoftDeleted);
router.get('/:slug', controller.findBySlug);
router.post('/', authenticate, authorization(['admin', 'mod']), controller.create);
router.delete('/:id', authenticate, authorization(['admin']), controller.destroy);
router.post('/:id/undo-delete', authenticate, authorization(['admin', 'mod']), controller.undoDestroy);
router.delete('/:id/soft-delete', authenticate, authorization(['admin', 'mod']), controller.softDestroy);

module.exports = router;