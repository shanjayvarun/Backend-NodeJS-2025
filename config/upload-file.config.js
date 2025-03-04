const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3, ALLOWEDTYPES, s3params } = require("../folders/utility/enum");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: s3params.Bucket,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const SUBFOLDER = req.query.folder; const FILETYPE = file.mimetype.split('/').pop(); const DATA = req.query.id
      if (!SUBFOLDER || !DATA) {
        return cb(new Error('Validation error: ' + (!req.query.folder ? 'Missing folder parameter' : 'Missing id parameter')));
      }
      const FOLDER = { pdf: 'FILES', xls: 'FILES', xlsx: 'FILES', png: 'IMAGES', svg: 'IMAGES', jpg: 'IMAGES', jpeg: 'IMAGES', mp4: 'VIDEOS', mov: 'VIDEOS', mkv: 'VIDEOS', flv: 'VIDEOS' }[FILETYPE] || 'OTHERS';
      cb(null, `${FOLDER}/${SUBFOLDER}/${DATA + '.' + FILETYPE}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const FILETYPE = file.mimetype.split('/').pop();
    if (!ALLOWEDTYPES.includes(FILETYPE)) {
      return cb(new Error(`Unsupported file type: ${FILETYPE}. Only (${ALLOWEDTYPES}) are allowed.`));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
