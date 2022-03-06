import request from '@/utils/request'
import { message } from 'antd';


export function newAricle(data) {
  return request({
    url: 'article/new',
    method: 'post',
    data
  })
}

export const delConfirm = async (articleId, cb = () => { }) => {
  const { code, msg } = await request.post('article/del', { articleId });
  if (code === 0) {
    message.success(msg);
    cb();
  } else {
    message.info(msg);
  }
}
export const delPublishConfirm = async (articleId, cb = () => { }) => {
  const { code, msg } = await request.post('article/delPublish', { articleId });
  if (code === 0) {
    message.success(msg);
    cb();
  } else {
    message.info(msg);
  }
}