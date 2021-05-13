import request from '@/utils/request'

// 图片分组列表
export function getImgGroupList(data) {
  return request({
    url: '/main/upload_group/list',
    method: 'get',
    params: data
  })
}
// 图片列表
export function getImgList(data) {
  return request({
    url: '/main/upload_group/getImage',
    method: 'get',
    params: data
  })
}
// 新增分组
export function addImgGroupList(data) {
  return request({
    url: '/main/upload_group/add',
    method: 'post',
    data
  })
}
// 删除图片
export function delImg(data) {
  return request({
    url: '/main/deleteImage',
    method: 'post',
    data
  })
}
// 移动分组
export function moveGroup(data) {
  return request({
    url: '/main/upload_group/editImage',
    method: 'post',
    data
  })
}
// 编辑分组名称
export function editGroupName(data) {
  return request({
    url: '/main/upload_group/update',
    method: 'post',
    data
  })
}
