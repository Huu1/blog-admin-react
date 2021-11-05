import React, { useCallback, useEffect, useState, useRef, useReducer } from "react";
import Markdown from "@/components/Markdown";
import { Card, Input, message, Button } from "antd";
import { withRouter } from "react-router-dom";
import request from '@/utils/request'

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'changeTitle':
      return { ...state, title: payload };
    case 'changeContent':
      return { ...state, content: payload };
    case 'changeArticle':
      return { ...state, ...payload };
    default:
      throw new Error('类型不匹配');
  }
}

const initArticle = {
  title: '',
  content: "",
  initContent:'',
  articleId: ""
}

const Edit = (props) => {
  const { history, match: { params: { id } } } = props;

  const didMountRef = useRef(false);

  const [info, setInfo] = useState('文章将自动保存到草稿箱');

  const [article, dispatch] = useReducer(reducer, initArticle)

  useEffect(() => {
    let timer;
    request.get(`article/${id}`).then(res => {
      const { code, data, msg } = res;
      if (code === 0) {
        dispatch({
          type: "changeArticle",
          payload: {
            title: data.title,
            initContent:data.content.content,
            articleId: data.articleId,
          }
        })
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

  const save = useCallback(() => {
    const fn = () => {
      setInfo('保存中...');
      const { title, content, articleId } = article
      request.post(`article/edit`, {
        title,
        content,
        articleId
      }).then(res => {
        const { code } = res;
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
  }, [setInfo, article])

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      if (didMountRef.current) {
        save();
      } else {
        didMountRef.current = true;
      }
    }, 1000);
    return () => {
      clearTimeout(timer)
    }
  }, [article, save])

  const valueChange = useCallback((value) => {
    const fn = () => {
      dispatch({
        type: "changeContent",
        payload: value
      })
    }
    fn()
  }, [])

  const titleChange = (e) => {
    dispatch({
      type: "changeTitle",
      payload: e.target.value
    })
  }


  return (
    <div className="app-container">
      <Card title="新建文章"  >
        <div className='flex column-center between'>
          <div>标题：</div>  <Input value={article.title} onChange={titleChange} style={{ width: "30vw" }} />
          <div style={{ marginLeft: 'auto' }}>{info}</div>
          {/* <Button type="primary" style={{ marginLeft: "30px" }}>发布</Button> */}
        </div>
      </Card>
      <br />
      <Markdown initValue={article.initContent} valueChange={valueChange} />
    </div>
  );
};

export default withRouter(Edit);
