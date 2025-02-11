const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3, s3Bucket, ALLOWEDTYPES } = require("../folders/utility/enum");
const { sendError } = require('../folders/utility/responses');

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
    if (!ALLOWEDTYPES.includes(file.mimetype.split('/').pop())) {
      return cb(new Error(`Unsupported file type: ${file.mimetype.split('/').pop()}. Only (${ALLOWEDTYPES}) are allowed.`));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadFile = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return sendError(res, 400, err.message);
    }
    next();
  });
};

module.exports = uploadFile;
