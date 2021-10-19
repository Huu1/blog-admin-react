import React, { useEffect, useRef, useState } from "react";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
const Markdown = (props) => {
  const { value, valueChange = () => { } } = props

  const ref = useRef(null);
  useEffect(() => {
    ref.current.getInstance().setHtml(value)
  }, [value])

  const onChange = () => {
    const value = ref.current.getInstance().getHtml();
    if (value) {
      valueChange(value);
    }
  }

  return (
    <Editor
      placeholder="每一个不曾起舞的日子，都是对生命的辜负。 ——尼采"
      previewStyle="vertical"
      height="700px"
      initialEditType="markdown"
      useCommandShortcut={true}
      initialValue={value}
      ref={ref}
      onChange={onChange}
    />
  );
};

export default Markdown;
