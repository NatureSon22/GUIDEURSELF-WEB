import multer from "multer";
import fs from "fs";

const storage = (folder) => {
  const storagePath = `./uploads/${folder}`;
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storagePath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); 
    },
  });
};

export default storage;
