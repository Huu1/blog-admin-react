import React, { useCallback, useEffect, useRef, useState } from "react";
// import "codemirror/lib/codemirror.css";
// import "@toast-ui/editor/dist/toastui-editor.css";
import Vditor from 'vditor';

import 'vditor/dist/index.css';

const Markdown = (props) => {
  const { value, valueChange = () => { } } = props
  const [vditor, setVditor] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const vditor = new Vditor(document.getElementById('id'), {
      height: 700,
      mode: "sv",
      placeholder: "每一个不曾起舞的日子，都是对生命的辜负。 ——尼采",
      toolbarConfig: {
        pin: true,
      },
      counter: {
        enable: true
      },
      cache: {
        enable: false,
      },
      input(value) {
        valueChange(vditor.getValue());
      }
    })
    setVditor(vditor)
  }, [valueChange])

  useEffect(() => {
    if (vditor && value) {
      setTimeout(() => {
        vditor.setValue(value);
      }, 200);
    }
  }, [value, vditor])
  return (
    <div id='id'></div>
  );
};

export default React.memo(Markdown);
