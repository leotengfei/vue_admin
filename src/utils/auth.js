import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  // console.log(Cookies.get(TokenKey))
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // console.log(Cookies.set(TokenKey, token))
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // console.log(Cookies.remove(TokenKey))
  return Cookies.remove(TokenKey)
}
