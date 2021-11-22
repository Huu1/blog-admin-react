import request from '@/utils/request'

export function reqUserInfo(token) {
  return request({
    url: 'auth/refresh',
    method: 'post',
    data: { token }
  })
}

export function getUsers() {
  return request({
    url: '/user/findAll',
    method: 'get'
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}

export function reqValidatUserID(data) {
  return request({
    url: '/user/validatUserID',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function setUserStatus(data) {
  return request({
    url: '/user/status',
    method: 'post',
    data
  })
}