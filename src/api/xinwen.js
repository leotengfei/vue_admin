import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/xinwen/list',
    method: 'get',
    params
  })
}
