const router = require('express').Router();
const controller = require('../controllers/JarController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.find);
router.delete('/:id', authenticate, controller.destroy);
router.put('/:id', authenticate, controller.update);

module.exports = router;