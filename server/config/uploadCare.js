import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { config } from "dotenv";

config();

const uploadToUploadcare = async (filePaths) => {
  const UPLOADCARE_PUB_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
  const UPLOADCARE_STORE = "auto";
  const url = "https://upload.uploadcare.com/base/";

  if (!UPLOADCARE_PUB_KEY) {
    throw new Error("UPLOADCARE_PUBLIC_KEY is not set in .env file.");
  }

  const uploadFile = async (filePath) => {
    const formData = new FormData();
    formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUB_KEY);
    formData.append("UPLOADCARE_STORE", UPLOADCARE_STORE);
    formData.append("file", fs.createReadStream(filePath));
    formData.append("metadata[subsystem]", "uploader");

    try {
      const response = await axios.post(url, formData, {
        headers: formData.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Upload failed for ${filePath}:`, error.response?.data || error.message);
      throw error;
    }
  };

  const results = [];
  for (const filePath of filePaths) {
    const result = await uploadFile(filePath);
    results.push(result);
  }

  return results;
};

export default uploadToUploadcare;