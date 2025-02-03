import { memo, useCallback, useRef, useMemo, useEffect } from "react";
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

const TipTapEditor = memo(({ documentContent, setDocumentContent }) => {
  console.log(documentContent);
  // Use useRef to store the debounce timer
  const debounceTimer = useRef(null);

  // Memoize extensions to avoid recreating them on every render
  const extensions = useMemo(
    () => [
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
    ],
    [],
  );

  // Debounced content update handler
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
      }, 300); // 300ms debounce delay
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
        key={documentContent} // Reset editor when content changes
        output="html"
        className="custom-outline"
        contentClass="text-md"
        content={documentContent}
        onChangeContent={handleChangeContent}
        extensions={extensions}
        maxHeight={500}
        resetCSS={false} // Disable resetCSS if not needed
        bubbleMenu={{
          hidden: true, // Disable bubble menu if not needed
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
