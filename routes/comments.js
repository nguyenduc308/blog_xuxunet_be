const router = require('express').Router();
const controller = require('../controllers/CommentController');

router.post('/', controller.create);

module.exports = router;
