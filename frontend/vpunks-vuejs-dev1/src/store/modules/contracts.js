const state = {
  instances: {}
}

const mutations = {
  SET_INSTANCE: (state, { key, value }) => {
    state.instances[key] = value
  }
}

const actions = {
  setInstance({ commit }, data) {
    commit('SET_INSTANCE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

