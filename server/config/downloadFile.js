import https from "https";
import fs from "fs";
import path from "path";

const mimeToExtension = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "application/json": ".json",
  "text/plain": ".txt",
  "text/html": ".html",
  "text/css": ".css",
  "application/javascript": ".js",
  "application/xml": ".xml",
  "application/zip": ".zip",
  "application/x-zip-compressed": ".zip",
  "application/x-compressed": ".zip",
  "application/octet-stream": "",
  "video/mp4": ".mp4",
  "audio/mpeg": ".mp3",
  "audio/wav": ".wav",
};

function getFileExtension(contentType, originalUrl) {
  return (
    mimeToExtension[contentType] ||
    path.extname(new URL(originalUrl).pathname) ||
    ""
  );
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateMulterFilename(extension) {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1e9);
  return `document-${timestamp}-${randomNum}${extension}`;
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const originalFilename = path.basename(new URL(url).pathname);
    
    // ✅ Ensure `destination` exactly matches Multer: "./uploads/document"
    const destination = path.normalize("./uploads/document");  
    ensureDirectoryExists(destination);

    https
      .get(url, (res) => {
        if ([301, 302].includes(res.statusCode)) {
          return downloadFile(res.headers.location).then(resolve).catch(reject);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to download: ${res.statusCode}`));
        }

        const contentType = res.headers["content-type"]?.split(";")[0] || "";
        const extension = getFileExtension(contentType, url);
        const filename = generateMulterFilename(extension);
        const filePath = path.join(destination, filename);

        let fileData = [];

        res.on("data", (chunk) => fileData.push(chunk));
        res.on("end", async () => {
          const buffer = Buffer.concat(fileData);
          try {
            await fs.promises.writeFile(filePath, buffer);
            resolve({
              fieldname: "document",
              originalname: originalFilename,
              encoding: "7bit",
              mimetype: contentType,
              destination, // ✅ Now "./uploads/document"
              filename,
              path: path.join("uploads", "document", filename), // ✅ Matches Multer's relative path
              size: buffer.length,
            });
          } catch (err) {
            reject(new Error(`File write error: ${err.message}`));
          }
        });
      })
      .on("error", (err) => reject(new Error(`Request error: ${err.message}`)));
  });
}

export default downloadFile;