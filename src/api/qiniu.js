import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/adminNews/fileToken',
    method: 'get'
  })
}
export function upload() {
  return request({
    url: '/adminNews/fileToken',
    method: 'get'
  })
}
