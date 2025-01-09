import React, { useCallback } from "react";
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

// Define extensions outside the component to avoid re-creation
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
  // Import Extensions Here
];

const TipTapEditor = React.memo(({ documentContent, setDocumentContent }) => {
  // Use useCallback to memoize the function reference
  const onChangeContent = useCallback(
    (value) => {
      setDocumentContent(value);
    },
    [setDocumentContent] // Dependencies
  );

  return (
    <RichTextEditor
      output="html"
      className="custom-outline"
      content={documentContent}
      onChangeContent={onChangeContent}
      extensions={extensions}
      maxHeight={500}
      bubbleMenu={{
        hidden: true,
      }}
    />
  );
});

TipTapEditor.displayName = "TipTapEditor";

export default TipTapEditor;
