import React, { useCallback, useEffect, useState ,useRef} from "react";
import Markdown from "@/components/Markdown";
import { Card, Input, message, Button } from "antd";
import { withRouter } from "react-router-dom";
import request from '@/utils/request'


const Edit = (props) => {
  const { history, match: { params: { id } } } = props;
  const [initContent, setInitContent] = useState();
  const [content, setContent] = useState();
  const [title, setTitle] = useState();
  const [info, setInfo] = useState('文章将自动保存到草稿箱');

  
  const didMountRef = useRef(false);

  useEffect(() => {
    let timer;
    request.get(`article/${id}`).then(res => {
      const { code, data, msg } = res;
      if (code === 0) {
        setInitContent(data.content);
        setTitle(data.title)
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

  const save = useCallback((title, content) => {
    const fn = () => {
      setInfo('保存中...');
      request.post(`article/edit`, {
        title,
        content,
        articleId:id
      }).then(res => {
        const { code, data, msg } = res;
        if (code === 0) {
          setTimeout(() => {
            setInfo('保存成功！');
          }, 300);
        } else {
          setInfo('保存失败！');
        }
      })
    }
    fn();
  }, [setInfo,id])

  const valueChange = useCallback((value) => {
    const fn = () => {
      setContent(value)
    }
    fn()
  }, [])

  const titleChange = (e) => {
    setTitle(e.target.value)
  }

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      if (didMountRef.current) {
        save(title, content);
      }else {
        didMountRef.current = true;
      }
    }, 1000);
    return () => {
      clearTimeout(timer)
    }
  }, [title, content, save])

  return (
    <div className="app-container">
      <Card title="新建文章"  >
        <div className='flex column-cetner between'>
          <div>标题：</div>  <Input value={title}  onChange={titleChange} style={{ width: "30vw" }} />
          <div style={{ marginLeft: 'auto' }}>{info}</div>
          <Button type="primary" style={{ marginLeft: "30px" }}>发布</Button>
        </div>
      </Card>
      <br />
      <Markdown value={initContent} valueChange={valueChange} />
    </div>
  );
};

export default withRouter(Edit);
