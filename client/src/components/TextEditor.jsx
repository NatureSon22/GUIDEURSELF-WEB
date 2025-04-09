import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/quillConfig.js";
import "@/quillCustom.css";
import PropTypes from "prop-types";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }], // Headers
    ["bold", "italic", "underline", "strike"], // Text styling
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    [{ indent: "-1" }, { indent: "+1" }], // Indentation
    [{ align: [] }], // Text alignment
    ["link", "image"], // Link and image
    ["clean"], // Clear formatting
    [{ size: ["small", "normal", "large", "huge"] }],
  ],
};

const TextEditor = ({ content, setContent }) => {
  return (
    <div className="flex h-[400px] flex-col gap-3 rounded-md border border-secondary-100-75/20 bg-white shadow-sm">
      <ReactQuill
        value={content}
        onChange={setContent}
        className="font h-[85%] text-lg"
        modules={modules}
        style={{
          borderRadius: "8px",
          // Editor container border radius
        }}
        placeholder="Write something..."
      />
    </div>
  );
};

TextEditor.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func,
};

export default TextEditor;
