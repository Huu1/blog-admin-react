import React, { useEffect, useState } from "react";
import Markdown from "@/components/Markdown";
import { Card, Input, message } from "antd";
import { withRouter } from "react-router-dom";
import request from '@/utils/request'

const Edit = (props) => {
  const { history, match: { params: { id } } } = props;
  const [content, setContent] = useState();
  useEffect(() => {
    let timer;
    request.get(`article/${id}`).then(res => {
      const { code, data, msg } = res;
      if (code === 0) {
        setContent(data.content);
      } else {
        message.error(msg);
        timer = setTimeout(() => {
          history.push('/article/write')
        }, 2000)
      }
    })
    return () => {
      clearTimeout(timer);
    }
  }, [history, id])

  const valueChange = (value) => {
    console.log(value);
  }

  return (
    <div className="app-container">
      <Card title="新建文章"  >
        <div className='flex column-cetner'>
          <div>标题：</div>  <Input style={{ width: "300px" }} />
        </div>
      </Card>
      <br />
      <Markdown value={content} valueChange={valueChange} />
    </div>
  );
};

export default withRouter(Edit);
