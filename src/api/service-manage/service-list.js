import request from '@/utils/request'

// 列表
export function getServiceList(data) {
  return request({
    url: '/service/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getServiceAdd(data) {
  return request({
    url: '/service/add',
    method: 'post',
    data
  })
}
// 编辑
export function getServiceEdit(data) {
  return request({
    url: '/service/update',
    method: 'post',
    data
  })
}
// 删除
export function getServiceDel(data) {
  return request({
    url: '/service/delete',
    method: 'get',
    params: data
  })
}

//获取会员列表
export function getMemberList(data) {
  return request({
    url: '/member/list',
    method: 'get',
    params: data
  })
}
//获取酒店列表
export function getHotelList(data) {
  return request({
    url: '/hotel/list',
    method: 'get',
    params: data
  })
}
//获取酒店类型
export function getHotelCate(data) {
  return request({
    url: '/hotel/getHotelCate',
    method: 'get',
    params: data
  })
}
//提交关联酒店
export function getRelatedHotelList(data) {
  return request({
    url: '/service/setHotel',
    method: 'post',
    data
  })
}
// 删除关联酒店
export function delRelatedHotel(data) {
  return request({
    url: '/service/unsetHotel',
    method: 'post',
    data
  })
}
//获取佣金列表
export function getCommissionList(data) {
  return request({
    url: '/commissions_log/list',
    method: 'get',
    params: data
  })
}
//会员列表
export function getAllMemberList(data) {
  return request({
    url: '/member/getByNickName',
    method: 'get',
    params: data
  })
}