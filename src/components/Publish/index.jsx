import React, { useState } from "react";
import "./index.less";
import { Upload, message, Button, Icon, Modal, Select, Input } from 'antd';
import { useSelector } from "react-redux";
import Axios from "axios";
const { Option } = Select;
const { TextArea } = Input;

const Publish = (props) => {
  const { visible, onClose = () => { }, data } = props;
  const [article, setArticle] = useState({
    tid: "",
    brief: "2",
  })

  const [fileList, setFileList] = useState([]);

  const { appData: { tagList = [] } } = useSelector(state => state.app);
  const user = useSelector(state => state.user);

  const handleOk = () => {
    // 发布
    const { tid, brief } = article;
    if (!tid || !brief || !fileList[0]) {
      message.info('请输入完整的发布信息');
      return;
    }
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
    console.log(e.target.value);
    // setArticle((article) => {
    //   return { ...article, brief: e.target.value }
    // })
  }

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
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
      console.log(res);
    })
  };

  const uploadProps = {
    onRemove: file => {
      setFileList([])
    },
    beforeUpload: file => {
      setFileList([file]);
      return false;
    },
    onChange: (file) => {
      if (file.fileList.length >= 1) {
        return;
      }
      setFileList(file.fileList)
    },
    fileList,
  };

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
        <span>文章主图：</span>
        <Upload {...uploadProps} >
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
      </div>
      <div className='flex column-center  mr-top-em  w-100' >
        <span style={{
          width: '50px',
          display: 'inline-block'
        }}>描述：</span>
        <TextArea value={article.brief} onChange={briefChange} allowClear rows={3} />
      </div>

    </Modal>

  );
};

export default Publish;
