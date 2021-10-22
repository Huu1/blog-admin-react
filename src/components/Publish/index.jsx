import React, { useState } from "react";
import "./index.less";
import { Upload, message, Button, Icon, Modal, Select, Input } from 'antd';
import { useSelector } from "react-redux";
import Axios from "axios";
const { Option } = Select;
const { TextArea } = Input;

const Publish = (props) => {
  const { visible, onClose = () => { }, data } = props;
  const [article] = useState({
    tid: "",

  })

  const [fileList, setFileList] = useState([]);

  const { appData: { tagList = [] } } = useSelector(state => state.app);
  const user = useSelector(state => state.user);

  const handleOk = () => {
    // 发布
    console.log(article);
    handleUpload();
  }

  const handleCancel = () => {
    onClose()
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
    });
    // this.setState({
    //   uploading: true,
    // });
    // You can use any AJAX library you like
    const url = 'http://localhost:3000/user/avatar';
    let config = {
      headers: {
        'Content-Type': "application/x-www-form-urlencoded",
        token: user.token
      },
    }
    Axios.post(url,formData,config).then(res=>{
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
        <Select defaultValue={tagList && tagList[0] && tagList[0].tagId} style={{ width: 120 }} onChange={handleChange}>
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
        <TextArea allowClear rows={3} />
      </div>

    </Modal>

  );
};

export default Publish;
