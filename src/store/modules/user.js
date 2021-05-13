import { login, logout, getMenu } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  routerMenu: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    console.log('token: ', token)
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU: (state, menu) => {
    state.routerMenu = menu
    console.log('routerMenu', state.routerMenu)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        let loginForm = {
          username: data.username,
          group_name: data.group_name
        }
        loginForm = JSON.stringify(loginForm)
        localStorage.setItem('loginUserName', loginForm)
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      //   getInfo(state.token).then(response => {
      const data = {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }

      if (!data) {
        reject('Verification failed, please Login again.')
      }

      const { roles, name, avatar, introduction } = data

      // roles must be a non-empty array
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }

      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      resolve(data)

      //    }).catch(error => {
      //      reject(error)
      //    })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },
  // 获取动态路由
  getMenu({ commit }) {
    return new Promise((resolve, reject) => {
      getMenu().then(res => {
        if (res.code == 0) {
          const menu = res.data
          commit('SET_MENU', menu)
          resolve(menu)
        }
      })
    }).catch(error => {
      reject(error)
    })
  },
  // 判断按钮显示
  async showBtn({ dispatch }, text) { // flag为参数
    let menu
    if (state.routerMenu == '') {
      menu = await dispatch('getMenu')
    } else {
      menu = state.routerMenu
    }
    // console.log('menu', menu)
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].children) {
        for (let j = 0; j < menu[i].children.length; j++) {
          if (menu[i].children[j].id == text.id) {
            return menu[i].children[j]
          }
        }
      }
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
