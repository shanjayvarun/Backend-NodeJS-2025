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
      const uniqueFileName = `${req.query.folder}/${Date.now()}-${file.originalname}`;
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
  limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload;
