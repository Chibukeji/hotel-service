import request from '@/utils/request'

// 列表
export function getServiceList(data) {
  return request({
    url: '/main/service/list',
    method: 'get',
    params: data
  })
}