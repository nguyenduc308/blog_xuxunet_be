const router = require('express').Router();
const controller = require('../controllers/CommentController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate,  controller.create);

module.exports = router;
