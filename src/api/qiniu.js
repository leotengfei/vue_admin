import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/adminNews/fileToken',
    method: 'get'
  })
}
export function delFile(file) {
  return request({
    url: '/adminNews/delFile',
    method: 'post',
    data: {
      file
    }
  })
}
