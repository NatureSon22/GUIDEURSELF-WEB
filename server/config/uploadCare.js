import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { uploadFile } from "@uploadcare/upload-client";
import mime from "mime";

config();

const handleUploadFile = async (filePath) => {
  try {
    const resolvedPath = path.resolve(filePath);

    if (
      !fs.existsSync(resolvedPath) ||
      fs.lstatSync(resolvedPath).isDirectory()
    ) {
      throw new Error(`Invalid file path: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(resolvedPath);

    const contentType =
      mime.getType(resolvedPath) || "application/octet-stream";

    const response = await uploadFile(fileBuffer, {
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
      store: "auto",
      contentType,
      metadata: {
        subsystem: "js-client",
        description: "File uploaded via Uploadcare client",
      },
    });

    console.log("Upload successful:", response);
    return response;
  } catch (error) {
    console.error("Upload failed:", error.message || error);
    throw error;
  }
};

export default handleUploadFile;
