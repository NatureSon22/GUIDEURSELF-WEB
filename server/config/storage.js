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
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileExtension = file.originalname.split(".").pop();
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
    },
  });
};

export default storage;
