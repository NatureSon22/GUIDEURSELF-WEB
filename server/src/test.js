import { config } from "dotenv";
import { LlamaParseReader } from "llamaindex";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import fetch from "node-fetch";

config();
console.log("start");

const reader = new LlamaParseReader({ resultType: "text" });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.dirname(__dirname);

async function processDocument(documentPath, isUrl = false) {
  try {
    let documentContent;
    
    if (isUrl) {
      // Handle URL case
      const response = await fetch(documentPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const buffer = await response.buffer();
      
      const tempPath = path.join(__dirname, "temp.pdf");
      await fs.writeFile(tempPath, buffer);
      
      documentContent = await reader.loadData(tempPath);
      
      // Clean up temp file
      try {
        await fs.unlink(tempPath);
      } catch (cleanupError) {
        console.warn("Failed to delete temp file:", cleanupError);
      }
    } else {
      // Handle local file path
      try {
        // Check if file exists
        await fs.access(documentPath);
        documentContent = await reader.loadData(documentPath);
      } catch (error) {
        if (error.code === 'ENOENT') {
          throw new Error(`File not found: ${documentPath}`);
        }
        throw error;
      }
    }
    
    return documentContent;
  } catch (error) {
    console.error("Error processing document:", error);
    throw error;
  }
}

async function main() {
  try {
    // Example usage for local file
    const localFilePath = path.join(
      rootDir,
      "uploads",
      "document",
      "document-1737202137202-5038812.pdf"
    );
    
    // Example usage for URL
    const documentUrl = "https://ucarecdn.com/42869cd1-c966-4acf-bf6b-a7f01ea7a85f/";
    
    // Process both types of documents
    let result;
    
    // Try local file first
    try {
      console.log("Attempting to process local file...");
      result = await processDocument(localFilePath, false);
    } catch (localError) {
      console.log("Local file processing failed, trying URL...");
      // If local file fails, try URL
      if (documentUrl) {
        result = await processDocument(documentUrl, true);
      } else {
        throw localError;
      }
    }
    
    console.log("Document content:", result);
    
  } catch (error) {
    console.error("Failed to process document:", error);
  }
}

main().then(() => console.log("end"));