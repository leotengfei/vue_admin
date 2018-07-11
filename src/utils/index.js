/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function formatHTML(str) {
  let arr = str.split('<body>')
  str = ''
  for (var i = 1; i < arr.length; i++) {
    str += arr[i]
  }
  arr = str.split('</body>')
  str = ''
  for (var j = 0; j < arr.length - 1; j++) {
    str += arr[j]
  }
  return str
}

export function getImgList(str) {
  // 查找富文本编辑器中的图片，并且转换为数组
  const imgReg = /<img.*?(?:>|\/>)/gi
  // 匹配src属性
  const srcReg = /src\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i
  const arr = str.match(imgReg)
  var srcArr = []
  if (arr) {
    // 当内容中有图片时
    for (var i = 0; i < arr.length; i++) {
      srcArr[i] = arr[i].match(srcReg)[1]
    // 获取图片地址
    }
  }
  return srcArr
}

export function diffArr(arr1, arr2) {
  var newArr = []
  var arr3 = []
  if (arr1 === undefined) {
    newArr = arr2
    return newArr
  }
  if (arr2 === undefined) {
    newArr = arr1
    return newArr
  }
  for (var i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) {
      arr3.push(arr1[i])
    }
  }
  var arr4 = []
  for (var j = 0; j < arr2.length; j++) {
    if (arr1.indexOf(arr2[j]) === -1) {
      arr4.push(arr2[j])
    }
  }
  newArr = arr3.concat(arr4)
  return newArr
}
