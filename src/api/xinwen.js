import request from '@/utils/request'

export function getList(list_rows, list, title, time, classify, status) {
  return request({
    url: '/adminNews/getNewsData',
    method: 'post',
    data: {
      list_rows: list_rows,
      list: list,
      title: title,
      time: time,
      classify: classify,
      status: status
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

export function audit(id) {
  return request({
    url: '/adminNews/audit',
    method: 'post',
    data: {
      nid: id
    }
  })
}

export function draftNews(id) {
  return request({
    url: '/adminNews/draftNews',
    method: 'post',
    data: {
      nid: id
    }
  })
}

export function delNews(id) {
  return request({
    url: '/adminNews/delNews',
    method: 'post',
    data: {
      nid: id
    }
  })
}

export function exportExcel() {
  return request({
    url: '/adminNews/exportNews',
    method: 'post',
    responseType: 'blob'
  })
}
