import { config } from "dotenv";
import { LlamaParseReader } from "llamaindex";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

config();

const reader = new LlamaParseReader({ resultType: "text" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const documentParser = async (documentPath, isURL = false) => {
  try {
    let documentContent;

    if (isURL) {
      const response = await fetch(documentPath);

      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const tempPath = path.join(__dirname, "temp.pdf");

      await fs.writeFile(tempPath, buffer);

      documentContent = await reader.loadData(tempPath);

      try {
        await fs.unlink(tempPath);
      } catch (error) {
        console.warn("Failed to delete temp file:", error);
      }
    } else {
      try {
        documentContent = await reader.loadData(documentPath);
      } catch (error) {
        if (error.code === "ENOENT") {
          throw new Error("File not found");
        }
        throw error;
      }
    }

    console.log("documentContent :" + documentContent);
    return documentContent;
  } catch (error) {
    console.error("Failed to parse document:", error);
    throw error;
  }
};

export default documentParser;
