const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3, s3Bucket, ALLOWEDTYPES } = require("../folders/utility/enum");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: s3Bucket,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const FOLDER = ''; const SUBFOLDER = req.query.folder; const FILETYPE = file.mimetype.split('/').pop(); const INPUT = req.query.id
      if (!SUBFOLDER || !DATA) {
        return cb(new Error('Validation error: ' + (!req.query.folder ? 'Missing folder parameter' : 'Missing id parameter')));
      }
      cb(null, `${FOLDER}/${SUBFOLDER}/${DATA + '.' + FILETYPE}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (!ALLOWEDTYPES.includes(FILETYPE)) {
      return cb(new Error(`Unsupported file type: ${FILETYPE}. Only (${ALLOWEDTYPES}) are allowed.`));
    }
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 }
});

module.exports = upload;
