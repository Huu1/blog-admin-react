import React, { useCallback, useEffect, useState, useRef, useReducer } from "react";
import Markdown from "@/components/Markdown";
import { Card, Input, message, Button } from "antd";
import { withRouter } from "react-router-dom";
import request from '@/utils/request'
import Vditor from 'vditor';
import 'vditor/dist/index.css';
const Priview = (props) => {
  const { history, match: { params: { id } } } = props;
  const content = useRef();

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    let timer;
    request.get(`article/${id}`).then(res => {
      const { code, data, msg } = res;
      if (code === 0) {
        Vditor.preview(
          content.current,
          data.content.content,
        );
      } else {
        message.error(msg);
      }
    })
    return () => {
      clearTimeout(timer);
    }
  }, [history, id])

  return (
    <div className="app-container">
      <Card title="文章预览"  >
        <div ref={content}></div>
      </Card>
    </div>
  );
};

export default withRouter(Priview);
