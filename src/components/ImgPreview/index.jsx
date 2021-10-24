


import React, { useState } from 'react'
import loadImg from '@/assets/images/404.png';
import errorImg from '@/assets/images/githubCorner.png';
import './index.less';
import { Icon, Modal } from 'antd';

export default function Img(props) {

  const [src, setSrc] = useState(props.loadingImg)

  const [isFlag, setIsFlag] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)

  const handleOnLoad = () => {

    if (isFlag) return;

    const imgDom = new Image();
    imgDom.src = props.src;

    imgDom.onload = function () {
      setIsFlag(true)
      setSrc(props.src)
    }

    imgDom.onerror = function () {
      setIsFlag(true)
      setSrc(props.errorImg)
    }
  }

  const img = () => {
    return <img
      src={src}
      style={{ height: '100%', width: '100%' }}
      onLoad={handleOnLoad}
      alt='图片'
    ></img>
  }

  return (
    <div style={{ ...props.style }} className='img-wrap'>
      {
        img()
      }
      <div className='priview flex row-center column-center' onClick={()=>{setPreviewVisible(true)}}>
        <Icon style={{fontSize:"24px",color:'rgba(255,255,255,.6)'}} type="zoom-in" />
      </div>
      <Modal width={750} visible={previewVisible} footer={null} onCancel={()=>{setPreviewVisible(false)}}>
          {
            img()
          }
        </Modal>
    </div>
  )
}

Img.defaultProps = {
  loadingImg: loadImg,
  errorImg: errorImg
}
