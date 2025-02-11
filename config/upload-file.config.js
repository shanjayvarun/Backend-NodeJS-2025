const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3, s3Bucket } = require("../folders/utility/enum");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: s3Bucket,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      if (!req.query.folder || !req.query.id) {
        return cb(new Error(!req.query.folder ? 'Missing folder parameter' : 'Missing id parameter'));
      }
      const uniqueFileName = `${req.query.folder}/${req.query.id + '.' + file.mimetype.split('/').pop()}`;
      cb(null, uniqueFileName);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPG, PNG, and JPEG are allowed.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
