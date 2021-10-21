import React, { useState } from "react";
import "./index.less";
import { Upload, message, Button, Icon, Modal, Select, Input } from 'antd';
const { Option } = Select;
const { TextArea } = Input;


const uploadProps = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const Publish = (props) => {
  const { visible, onClose = () => { }, data } = props;
  const [article] = useState({
    tid:"",
    
  })

  const handleOk = () => {
    // 发布
    console.log(article);
  }

  const handleCancel = () => {
    onClose()
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
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
        <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      </div>
      <div className='flex column-center  mr-top-em  w-100' >
        <span>文章主图：</span>
        <Upload {...uploadProps}>
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
