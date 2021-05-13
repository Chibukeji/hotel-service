import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

// 获取菜单
export function getMenu(data) {
  return request({
    url: '/menus',
    method: 'get',
    params: data
  })
}
// 获取登录信息
export function getloginInfo(data) {
  return request({
    url: '/admin_info',
    method: 'get',
    params: data
  })
}
