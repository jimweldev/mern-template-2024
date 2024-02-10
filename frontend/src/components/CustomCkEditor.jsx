import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CustomCkEditor = ({ onChange }) => {
  const editorConfiguration = {
    toolbar: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      // "fontsize",
      // "fontColor",
      // "fontBackgroundColor",
      "|",
      "bold",
      "italic",
      // "strikethrough",
      // "subscript",
      // "superscript",
      // "code",
      "|",
      "link",
      // "uploadImage",
      "blockQuote",
      // "codeBlock",
      "|",
      // "alignment",
      "|",
      "bulletedList",
      "numberedList",
      // "todoList",
      "outdent",
      "indent",
    ],
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfiguration}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default CustomCkEditor;
