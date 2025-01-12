import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { config } from "dotenv";

config();

const uploadToUploadcare = async (filePaths) => {
  const UPLOADCARE_PUB_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
  const UPLOADCARE_STORE = "auto";
  const url = "https://upload.uploadcare.com/base/";

  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUB_KEY);
  formData.append("UPLOADCARE_STORE", UPLOADCARE_STORE);

  filePaths.forEach((filePath) => {
    formData.append("file", fs.createReadStream(filePath));
  });

  formData.append("metadata[subsystem]", "uploader");

  try {
    const response = await axios.post(url, formData, {
      headers: formData.getHeaders(),
    });

    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
    throw error;
  }
};

export default uploadToUploadcare;
