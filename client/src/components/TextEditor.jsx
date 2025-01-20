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
    [setDocumentContent], // Dependencies
  );

  return (
    <div className="mt-1">
      <RichTextEditor
        output="html"
        className="custom-outline"
        contentClass={"text-md"}
        content={documentContent}
        onChangeContent={onChangeContent}
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

export default TipTapEditor;
