import React, { useCallback, useEffect, useState, useRef, useReducer } from "react";
import Markdown from "@/components/Markdown";
import { Card, Input, message, Button, Upload, Icon } from "antd";
import { withRouter } from "react-router-dom";
import request from '@/utils/request'

function useDebounce(initValue, delay = 300) {
  const [state, setState] = useState(initValue)
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(initValue)
    }, delay);
    return () => {
      timer && clearTimeout(timer)
    }
  }, [delay, initValue])
  return state;
}

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
  title: "",
  content: "",
  articleId: ""
}

const Edit = (props) => {
  const { history, match: { params: { id } } } = props;

  const [info, setInfo] = useState('文章将自动保存到草稿箱');

  const [loading, setLoading] = useState(true);

  const [article, dispatch] = useReducer(reducer, initArticle);
  const [initValue, setInitValue] = useState();

  const titleChangeTimer = useRef();
  const firstRef = useRef();

  const [editor, setEditot] = useState()
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    let timer;
    setLoading(true)
    request.get(`article/${id}`).then(res => {
      const { code, data, msg } = res;
      if (code === 0) {
        dispatch({
          type: "changeArticle",
          payload: {
            title: data.title,
            content: data.content.content,
            articleId: data.articleId,
          }
        })
        firstRef.current = false;
        setInitValue(data.content.content);
      } else {
        message.error(msg);
        timer = setTimeout(() => {
          history.push('/article/write')
        }, 2000)
      }
      setLoading(false)
    })
    return () => {
      clearTimeout(timer);
    }
  }, [history, id])

  const save = useCallback((title, content, articleId) => {
    setInfo('保存中...');
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
  }, [])

  const upLoadprops = {
    name: 'file',
    accept: '.md',
    beforeUpload: function beforeUpload(file) {
      setFileList([file]);
      const fileReader = new FileReader();
      fileReader.readAsText(file)
      fileReader.onload = function () {
        // eslint-disable-next-line no-unused-expressions
        editor?.setValue(fileReader.result);
        valueChange(fileReader.result);
      }
      return false;
    },
    onChange({ fileList }) {
      setFileList([...fileList]);
    },
  };


  const titleChange = (e) => {
    const { target: { value } } = e;
    dispatch({
      type: "changeTitle",
      payload: value
    })

  }

  const valueChange = (value) => {
    dispatch({
      type: "changeContent",
      payload: value
    })
  }

  useEffect(() => {
    if (firstRef.current) {
      titleChangeTimer.current = setTimeout(() => {
        save(article.title, article.content, article.articleId)
      }, 300);
    } else {
      firstRef.current = true;
    }

    return () => {
      titleChangeTimer.current && clearTimeout(titleChangeTimer.current)
    }
  }, [article])

  const editLoad = (editor) => {
    setEditot(editor)
  }

  return (
    <Card className="app-container" loading={loading}>
      <Card title={<>
        <span>标题：</span>  <Input value={article.title} onChange={titleChange} style={{ width: "30vw" }} />
      </>}  >
        <div className='flex column-center between'>
          <Upload {...upLoadprops} fileList={fileList}>
            <Button disabled={fileList.length >= 1}>
              <Icon type="upload" />上传md文件
            </Button>
          </Upload>
          <div style={{ marginLeft: 'auto' }}>{info}</div>
        </div>
      </Card>
      <br />
      <Markdown initValue={initValue} valueChange={valueChange} editLoad={editLoad} />
    </Card>
  );
};

export default withRouter(Edit);
