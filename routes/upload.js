const router = require('express').Router();
const controller = require('../controllers/UploadController');
const { authenticate, authorization } = require('../middlewares/auth');

router.post(
  '/images', 
  authenticate, 
  authorization(['admin', 'mod']), 
  controller.upload.single('file'), 
  controller.uploadImage
);

module.exports = router;
