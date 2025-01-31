import { memo, useCallback, useRef } from "react";
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor";
import "reactjs-tiptap-editor/style.css";
import {
  Bold,
  Italic,
  Heading,
  OrderedList,
  BulletList,
  Link,
  Underline,
} from "reactjs-tiptap-editor";
import PropTypes from "prop-types";
import { useEffect } from "react";

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 750_000,
    },
  }),
  Bold,
  Italic,
  Heading,
  OrderedList,
  BulletList,
  Link,
  Underline,
];

const TipTapEditor = memo(({ documentContent, setDocumentContent }) => {
  // Use useRef to store the debounce timer
  const debounceTimer = useRef(null);

  const handleChangeContent = useCallback(
    (value) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        // Only update if content actually changed
        if (value !== documentContent) {
          setDocumentContent(value);
        }
      }, 300);
    },
    [documentContent, setDocumentContent],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="mt-1">
      <RichTextEditor
        output="html"
        className="custom-outline"
        contentClass="text-md"
        content={documentContent}
        onChangeContent={handleChangeContent}
        extensions={extensions}
        maxHeight={500}
        resetCSS={true}
        bubbleMenu={{
          hidden: true,
        }}
      />
    </div>
  );
});

TipTapEditor.displayName = "TipTapEditor";

TipTapEditor.propTypes = {
  documentContent: PropTypes.string.isRequired,
  setDocumentContent: PropTypes.func.isRequired,
};

export default TipTapEditor;
