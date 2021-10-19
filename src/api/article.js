import request from '@/utils/request'

export function newAricle(data) {
  return request({
    url: 'article/new',
    method: 'post',
    data
  })
}