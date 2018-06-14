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
