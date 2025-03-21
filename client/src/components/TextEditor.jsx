import { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import PropTypes from "prop-types";

const TextEditor = ({ content, setContent }) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      minHeight: 400,
      maxHeight: 400,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      link: { processVideoLink: false },
      image: { upload: false },
      toolbarAdaptive: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "|",
        "undo",
        "redo",
      ], // Correct format for Jodit buttons
    }),
    [],
  );

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1}
      onBlur={(newContent) => setContent(newContent)}
    />
  );
};

TextEditor.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default TextEditor;
