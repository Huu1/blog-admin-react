import React from "react";
import { Upload, Icon, Modal } from 'antd';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class ImgLoad extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(() => {
          return {
            fileList: [],
          };
        });
      },
      beforeUpload: file => {
        this.setState(() => ({
          fileList: [file],
        }));
        return false;
      },
      onChange: (file) => {
        if (file.fileList.length > 1) {
          return;
        }
        this.setState(() => {
          return {
            fileList: file.fileList,
          };
        }, () => {
          this.props.onImgChange(file.fileList)
        });
      },
      fileList,
    };
    return (
      <div className="clearfix" style={{ width: "300px" }}>
        <Upload
          {...props}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
        >
          <div>{fileList.length ? '更换' : '添加'}</div>
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImgLoad;