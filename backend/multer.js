const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Go up one folder (..), then into uploads
    const uploadPath = path.join(__dirname, "..", "uploads");

    // Ensure folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = file.originalname.replace(ext, "").replace(/\s+/g, "_");
    cb(null, `${filename}_${uniqueSuffix}${ext}`);
  },
});

exports.upload = multer({ storage });
