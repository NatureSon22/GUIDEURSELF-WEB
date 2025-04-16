import { FaPenNib } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";

const DocumentCreateFieldInfo = [
  {
    title: "Write",
    subtitle: "Write or copy paste your document",
    icon: (
      <FaPenNib className="text-4xl transition-all duration-200 group-hover:text-base-200" />
    ),
    path: "/write-document",
    access: "write document",
  },
  {
    title: "Upload",
    subtitle: "Upload PDF, Word, or PowerPoint files",
    icon: (
      <FaUpload className="text-4xl transition-all duration-200 group-hover:text-base-200" />
    ),
    path: "/upload-document",
    access: "upload file",
  },
  {
    title: "Import",
    subtitle: "Import website with text content",
    icon: (
      <FaLink className="text-4xl transition-all duration-200 group-hover:text-base-200" />
    ),
    path: "/import-website",
    access: "import website",
  },
];

export default DocumentCreateFieldInfo;
