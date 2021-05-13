import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
import { getMenu } from '@/api/user'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  // console.log(routes)
  data.map(item => {
    asyncRoutes.map(item2 => {
      if (item.id == item2.id) {
        const menu = item2
        let children = []
        let children2 = []
        if (item.children) {
          item.children.map(list => {
            item2.children.map(list2 => {
              if (list.id == list2.id) {
                children.push(list2)
                // if(list.children){
                //   list.children.map(arr=>{
                //     list2.children.map(arr2=>{
                //       if (arr.id == arr2.id){
                //         children2.push(arr2)
                //       }
                //     })
                //   })
                //   menu.children.children = children2
                // }else{
                //   menu.children.children = []
                // }
              }
            })
          })
          menu.children = children
        }else{
          menu.children = []
        }
        routes.push(menu)
      }
    })
  })
  console.log('routes', routes)
  routes.push({ path: '*', redirect: '/404', hidden: true })
}

const actions = {
  generateRoutes({ commit }, roles) {
    // return new Promise(resolve => {
    //   let accessedRoutes
    //   if (roles.includes('admin')) {
    //     accessedRoutes = asyncRoutes || []
    //   } else {
    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   }
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(accessedRoutes)
    // })

    return new Promise(resolve => {
      const loadMenuData = []
      const asyncRoutes22 = []
      getMenu().then(res => {
        let data = res
        if (res.code === 0) {
          data = res.data
          Object.assign(loadMenuData, data)
          generaMenu(asyncRoutes22, loadMenuData)
          let accessedRoutes
          // console.log('asyncRoutes22', asyncRoutes22)
          if (roles.includes('admin')) {
            accessedRoutes = asyncRoutes22 || []
          } else {
            accessedRoutes = filterAsyncRoutes(asyncRoutes22, roles)
          }
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
          // console.log('admin', res)
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
