import { CODY_URLS, HEADERS } from "./rag-endpoints";
import axios from "axios";
import path from "path";
import fs from "fs";

const downloadFile = async (document_url) => {
  try {
    const response = await axios({
      url: document_url,
      method: "GET",
      responseType: "arraybuffer",
    });

    const filename = path.basename(document_url);
    const filePath = path.join(__dirname, "uploads", "document", filename);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, response.data);
    return filePath;
  } catch (error) {
    throw new Error("Failed to download the file");
  }
};

const saveDocumentURL = async (req, res) => {
  try {
    const { document_url, visibility } = req.body;
    const userId = req.user.userId;

    const { filename, fileData } = await downloadFile(document_url);

    const { key, url } = await getSignedUploadURL(file);
    await uploadFileToS3(url, file);

    // Create document
    const document = await createCodyDocument(folder_id, key);
  } catch (error) {
    res.status(500).json({
      message: "Server error occurred during upload process.",
      error: error.message,
    });
  }
};
