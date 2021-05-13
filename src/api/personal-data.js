import request from '@/utils/request'
//修改密码
export function changePassword(data) {
    return request({
      url: '/editPassword',
      method: 'post',
      data
    })
}

