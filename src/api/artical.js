import request from '@/utils/request'

export function addOneNews(status, title, content, image, time, weight, name, source, classify) {
  return request({
    url: '/adminNews/addOneNews',
    method: 'post',
    data: {
      status,
      title,
      content,
      image,
      time,
      weight,
      name,
      source,
      classify
    }
  })
}

export function editNewsData(nid, status, title, content, image, time, weight, name, source, classify) {
  return request({
    url: '/adminNews/editNewsData',
    method: 'post',
    data: {
      nid,
      status,
      title,
      content,
      image,
      time,
      weight,
      name,
      source,
      classify
    }
  })
}
export function draftNews(nid, status, title, content, image, time, weight, name, source, classify) {
  return request({
    url: '/adminNews/draft',
    method: 'post',
    data: {
      nid,
      status,
      title,
      content,
      image,
      time,
      weight,
      name,
      source,
      classify
    }
  })
}

export function editNews(id) {
  return request({
    url: '/adminNews/editNews',
    method: 'post',
    data: {
      nid: id
    }
  })
}

