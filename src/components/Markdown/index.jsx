import React, { useCallback, useEffect, useRef, useState } from "react";
// import "codemirror/lib/codemirror.css";
// import "@toast-ui/editor/dist/toastui-editor.css";
import Vditor from 'vditor';

import 'vditor/dist/index.css';

const Markdown = (props) => {
  const { initValue, valueChange = () => { } ,editLoad=()=>{}} = props
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) {
      ref.current = new Vditor(document.getElementById('id'), {
        value: initValue,
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
        input() {
          valueChange(ref.current.getValue());
        }
      })
      editLoad(ref.current)
    }
  }, [editLoad, initValue, valueChange])


  return (
    <div id='id'></div>
  );
};

export default React.memo(Markdown);
