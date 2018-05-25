import request from '@/utils/request'

export function login(account, password) {
  return request({
    url: '/adminLogin/getToken',
    method: 'post',
    data: {
      account,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/adminUser/getUserInfo',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/adminUser/loginOut',
    method: 'post'
  })
}
