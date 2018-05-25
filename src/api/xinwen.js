import request from '@/utils/request'

export function getList(list_rows, list) {
  return request({
    url: '/adminNews/getNewsData',
    method: 'post',
    data: {
      list_rows: list_rows,
      list: list
    }
  })
}

export function getNewsContent(nid) {
  return request({
    url: '/adminNews/getNewsContent',
    method: 'post',
    data: {
      nid: nid
    }
  })
}
