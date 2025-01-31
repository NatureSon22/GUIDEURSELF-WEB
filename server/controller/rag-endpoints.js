import { config } from "dotenv";

config();

const CODY_URLS = {
  CREATE_FOLDER: () => "https://getcody.ai/api/v1/folders",
  UPDATE_FOLDER: (id) => `https://getcody.ai/api/v1/folders/${id}`,
  CREATE_DOCUMENT: () => "https://getcody.ai/api/v1/documents",
  CREATE_CONVERSATION: () => "https://getcody.ai/api/v1/conversations",
  GET_MESSAGE: () => `https://getcody.ai/api/v1/messages`,
  CREATE_MESSAGE: () => "https://getcody.ai/api/v1/messages",
  UPLOAD_DOCUMENT: () => "https://getcody.ai/api/v1/uploads/signed-url",
  CREATE_UPLOAD: () => "https://getcody.ai/api/v1/documents/file",
  GET_DOCUMENT: (id) => `https://getcody.ai/api/v1/documents?folder_id=${id}`,
  UPLOAD_WEBPAGE: () => "https://getcody.ai/api/v1/documents/webpage",
  LIST_DOCUMENT: () => "https://getcody.ai/api/v1/documents",
};

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.CODY_API_KEY}`,
};

export { CODY_URLS, HEADERS };
