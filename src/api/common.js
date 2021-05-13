import request from '@/utils/request'

// 省市区地址
export function allAddressList(data) {
  return request({
    url: '/main/area/list',
    method: 'get',
    params: data
  })
}
