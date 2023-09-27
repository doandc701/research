const state = {
  createAuctions: [],
  cancelAuctions: [],
  bidAuctions: [],
  createAucMax: 10, // recommended: 10 (test 4)
  cancelAucMax: 20, // recommended: 20 (test 4)
  bidAucMax: 10, // recommended: 10 (test 4)
  // Bid/Offer
  createBidOffers: [],
  cancelBidOffers: [],
  acceptBidOffers: [],
  createBidMax: 10, // recommended: 10 (test 4)
  cancelBidMax: 20, // recommended: 20 (test 4)
  acceptBidMax: 10 // recommended: 10 (test 4)
}

const mutations = {
  // Create Auction
  ADD_CREATE_ITEM: (state, auction) => {
    const index = state.createAuctions.findIndex(obj => { return obj.tokenId === auction.tokenId })
    if (index >= 0) {
      state.createAuctions[index] = auction
    } else {
      state.createAuctions.push(auction)
      if (state.createAuctions.length > state.createAucMax) {
        state.createAuctions.splice(0, state.createAuctions.length - state.createAucMax)
      }
    }
  },
  REMOVE_CREATE_ITEM: (state, tokenId) => {
    state.createAuctions = state.createAuctions.filter(obj => {
      return obj.tokenId !== tokenId
    })
  },
  CLEAR_CREATE_ITEM: (state) => {
    state.createAuctions.splice(0)
  },
  // Cancel Auction
  ADD_CANCEL_ITEM: (state, auction) => {
    if (state.cancelAuctions.some(obj => obj.tokenId === auction.tokenId) === false) {
      state.cancelAuctions.push(auction)
    }
    if (state.cancelAuctions.length > state.cancelAucMax) {
      state.cancelAuctions.splice(0, state.cancelAuctions.length - state.cancelAucMax)
    }
  },
  REMOVE_CANCEL_ITEM: (state, tokenId) => {
    state.cancelAuctions = state.cancelAuctions.filter(obj => {
      return obj.tokenId !== tokenId
    })
  },
  CLEAR_CANCEL_ITEM: (state) => {
    state.cancelAuctions.splice(0)
  },
  // Bid Auction
  ADD_BID_ITEM: (state, auction) => {
    if (state.bidAuctions.some(obj => obj.tokenId === auction.tokenId) === false) {
      state.bidAuctions.push(auction)
    }
    if (state.bidAuctions.length > state.bidAucMax) {
      state.bidAuctions.splice(0, state.bidAuctions.length - state.bidAucMax)
    }
  },
  REMOVE_BID_ITEM: (state, tokenId) => {
    state.bidAuctions = state.bidAuctions.filter(obj => {
      return obj.tokenId !== tokenId
    })
  },
  CLEAR_BID_ITEM: (state) => {
    state.bidAuctions.splice(0)
  },
  // Bid/Offer -------------------------------------------
  // Create Bid/Offer
  ADD_CREATE_BIDOF: (state, newData) => {
    const index = state.createBidOffers.findIndex(obj => { return obj.tokenId === newData.tokenId })
    if (index >= 0) {
      state.createBidOffers[index] = newData
    } else {
      state.createBidOffers.push(newData)
      if (state.createBidOffers.length > state.createBidMax) {
        state.createBidOffers.splice(0, state.createBidOffers.length - state.createBidMax)
      }
    }
  },
  REMOVE_CREATE_BIDOF: (state, tokenId) => {
    state.createBidOffers = state.createBidOffers.filter(obj => {
      return obj.tokenId !== tokenId
    })
  },
  CLEAR_CREATE_BIDOF: (state) => {
    state.createBidOffers.splice(0)
  }
}

const actions = {
  // Create Auction
  addCreateItem({ commit }, log) {
    commit('ADD_CREATE_ITEM', log)
  },
  removeCreateItem({ commit }, tokenId) {
    commit('REMOVE_CREATE_ITEM', tokenId)
  },
  clearCreateItem({ commit }) {
    commit('CLEAR_CREATE_ITEM')
  },
  // Cancel Auction
  addCancelItem({ commit }, log) {
    commit('ADD_CANCEL_ITEM', log)
  },
  removeCancelItem({ commit }, tokenId) {
    commit('REMOVE_CANCEL_ITEM', tokenId)
  },
  clearCancelItem({ commit }) {
    commit('CLEAR_CANCEL_ITEM')
  },
  // Bid Auction
  addBidItem({ commit }, log) {
    commit('ADD_BID_ITEM', log)
  },
  removeBidItem({ commit }, tokenId) {
    commit('REMOVE_BID_ITEM', tokenId)
  },
  clearBidItem({ commit }) {
    commit('CLEAR_BID_ITEM')
  },

  // Bid/Offer -------------------------------------------
  // Create Bid/Offer
  addCreateBidOf({ commit }, log) {
    commit('ADD_CREATE_BIDOF', log)
  },
  removeCreateBidOf({ commit }, tokenId) {
    commit('REMOVE_CREATE_BIDOF', tokenId)
  },
  clearCreateBidOf({ commit }) {
    commit('CLEAR_CREATE_BIDOF')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
