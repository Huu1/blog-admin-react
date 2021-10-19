import React from "react";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
const Markdown = () => {
  return (
    <Editor
      placeholder="每一个不曾起舞的日子，都是对生命的辜负。 ——尼采"
      previewStyle="vertical"
      height="700px"
      initialEditType="markdown"
      useCommandShortcut={true}
    />
  );
};

export default Markdown;
