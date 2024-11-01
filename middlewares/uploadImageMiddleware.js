const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const storage = multer.memoryStorage();
  const filter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Image Only", 400), false);
    }
  };
  const upload = multer({ storage: storage, fileFilter: filter });
  return upload;
};

exports.uploadSingleImage = (field) => multerOptions().single(field);
exports.uploadMixImage = (fields) => multerOptions().fields(fields);
