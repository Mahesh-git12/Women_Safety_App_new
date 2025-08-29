  const multer = require('multer');
  const path = require('path');

  // Set storage engine
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/avatars');  // ensure this folder exists
    },
    filename: function(req, file, cb) {
      cb(null, req.user.userId + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  // File filter for valid image types
  function fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
  , // 1MB max
    fileFilter
  });

  module.exports = upload;
