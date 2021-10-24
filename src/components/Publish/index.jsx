import React, { useCallback, useState } from "react";
import "./index.less";
import { Upload, message, Button, Icon, Modal, Select, Input } from 'antd';
import { useSelector } from "react-redux";
import Axios from "axios";
import ImgLoad from "../ImgeUpload";
const { Option } = Select;
const { TextArea } = Input;

const Publish = (props) => {
  const { visible, onClose = () => { }, data, successHandle = () => { } } = props;


  const [fileList, setFileList] = useState([]);

  const { appData: { tagList = [] } } = useSelector(state => state.app);

  const getInitInfo = useCallback(() => {
    return {
      tid: tagList.length && tagList[0].tagId,
      brief: "",
    }
  }, [tagList])

  const [article, setArticle] = useState(getInitInfo())

  const user = useSelector(state => state.user);

  const handleOk = () => {
    // 发布
    const { tid, brief } = article;
    if (!tid || !brief || !fileList.length) {
      message.info('请输入完整的发布信息');
      return;
    }
    // console.log(article,fileList);
    handleUpload()
  }

  const handleCancel = () => {
    onClose()
  }

  const tagChange = (value) => {
    setArticle((article) => {
      return { ...article, tid: value }
    })
  }
  const briefChange = (e) => {
    const brief = e.target.value
    setArticle((article) => {
      return { ...article, brief }
    })
  }

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file.originFileObj);
    });
    formData.append('tid', article.tid);
    formData.append('brief', article.brief);
    formData.append('articleId', data.articleId);

    let config = {
      headers: {
        'Content-Type': "application/x-www-form-urlencoded",
        token: user.token
      },
    }
    Axios.post('/article/pushlish', formData, config).then(res => {
      if (res.status === 201) {
        const { code, msg } = res.data;
        if (code === 0) {
          successHandle();
          setArticle(getInitInfo())

          message.success(msg)
        } else {
          message.error(msg)
        }
      }
    })
  };

  const onImgChange = (fileList) => {
    setFileList(fileList)
  }

  return (
    <Modal
      title="发布文章"
      visible={visible}
      onOk={handleOk}

      onCancel={handleCancel}
    >
      <div className='flex column-center  w-100' >
        <span>分类：</span>
        <Select value={article.tid} style={{ width: 120 }} onChange={tagChange}>
          {
            tagList.map(tag => {
              return <Option key={tag.tagId} value={tag.tagId}>{tag.title}</Option>
            })
          }
        </Select>
      </div>
      <div className='flex column-center  mr-top-em  w-100' >
        <span>主图：</span>
        <ImgLoad onImgChange={onImgChange} />
      </div>
      <div className='flex column-center  mr-top-em  w-100' >
        <span style={{
          width: '50px',
          display: 'inline-block'
        }}>描述：</span>
        <TextArea value={article.brief} placeholder='博客展示文章列表时的简短描述' onChange={briefChange} allowClear rows={3} />
      </div>

    </Modal>

  );
};

export default Publish;
