const multer = require('multer');
const path = require('path');

class UploadController {
  upload;

  constructor() {
    const storage = multer.diskStorage({
      destination(req, file, callback) {
        callback(null, path.join(__dirname, '../public/uploads/images'));
      },
      filename(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + '__' + file.originalname);
      },
    });

    this.upload = multer({ storage });
  }

  uploadImage(req, res, next) {
    if (req.file) {
      const { mimetype, filename } = req.file;
      return res.status(200).json({
        success: true,
        file: {
          mimetype,
          filename,
          url: '/uploads/images/' + filename,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
      });
    }
  }

}

module.exports = new UploadController();