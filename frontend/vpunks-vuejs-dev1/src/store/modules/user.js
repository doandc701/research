import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { appNameSpace } from '@/settings'
import DB from '@/database'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  wallets: [],
  selectedAccount: null,
  isApprovedForAll: undefined
}

const guestToken = 'guest-token'

// localStorage
let userInfo = { version: 1, selectedAccount: null }
const initUserInfo = function() {
  const _userInfo = window.localStorage.getItem(`${appNameSpace}/userInfo`)
  if (_userInfo == null) {
    updateUserInfo()
  } else {
    userInfo = JSON.parse(_userInfo)
  }
}
const updateUserInfo = function() {
  window.localStorage.setItem(`${appNameSpace}/userInfo`, JSON.stringify(userInfo))
}

const mutations = {
  SET_TOKEN: (state, token) => {
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
  SET_SELECTED_ACCOUNT: (state, account) => {
    state.selectedAccount = account
  },
  SET_WALLRTS(state, wallets) {
    state.wallets = wallets
  },
  ADD_WALLRT(state, wallet) {
    state.wallets.push(wallet)
  }
}

const setInfo = (commit, data) => {
  commit('SET_ROLES', data.roles)
  commit('SET_NAME', data.name)
  commit('SET_AVATAR', data.avatar)
  commit('SET_INTRODUCTION', data.introduction)
}

const actions = {
  //
  async initWallets({ commit }) {
    initUserInfo()
    // await DB.delete()
    const wallets = await DB.wallets.reverse().toArray().catch(() => {})
    if (typeof wallets === 'object') {
      commit('SET_WALLRTS', wallets)
      if (wallets.length > 0) {
        if (userInfo.selectedAccount === null || !wallets.some(obj => obj.address === userInfo.selectedAccount)) {
          userInfo.selectedAccount = wallets[0].address
          updateUserInfo()
        }
        window.selectedAccount = userInfo.selectedAccount
        // window.selectedAccount = '0x0854abd19a87e8f62e6aa1463e0120c1f862639a' // test
        commit('SET_SELECTED_ACCOUNT', userInfo.selectedAccount)
      }
    }
    // console.log('wallets', wallets)
  },
  //
  async addWallet({ commit, state }, addr) {
    const _addr = addr.toLowerCase()
    userInfo.selectedAccount = _addr
    updateUserInfo()
    window.selectedAccount = _addr
    commit('SET_SELECTED_ACCOUNT', _addr)
    //
    if (!state.wallets.some(obj => obj.address === _addr)) {
      const temp = {
        name: `wallet`,
        address: _addr
      }
      const id = await DB.wallets.add(temp).catch(() => {})
      if (!id) return
      await DB.wallets.where('address').equalsIgnoreCase(_addr).modify({ name: `wallet${id}` })
      temp.name = `wallet${id}`
      commit('ADD_WALLRT', temp)
    }
  },

  //
  setSelectedAccount({ commit }, account) {
    commit('SET_SELECTED_ACCOUNT', account)
  },

  // guest login
  guestLogin({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', guestToken)
      setToken(guestToken)
      resolve()
    })
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.token === guestToken) {
        const data = { name: 'guest', roles: ['admin'], avatar: 'img/avatar/rockstar-rabbit.gif', introduction: '' }
        setInfo(commit, data)
        resolve(data)
      } else {
        getInfo(state.token).then(response => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { roles } = data
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          setInfo(commit, data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
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
  async changeRoles({ commit, dispatch }, role) {
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
