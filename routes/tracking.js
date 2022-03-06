const router = require('express').Router();
const controller = require('../controllers/TrackingController');
const { authenticate, authorization } = require('../middlewares/auth');

router.post('/', authenticate, authorization(['admin', 'mod']), controller.create);
router.get('/', authenticate, authorization(['admin', 'mod']), controller.find);
router.get('/:code', controller.tracking);

module.exports = router;