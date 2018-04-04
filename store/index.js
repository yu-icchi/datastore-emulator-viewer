'use strict'

export const state = () => ({
  kind: ''
})

export const mutations = {
  SET_KIND: (state, kind) => {
    state.kind = kind
  }
}

export const actions = {
  setKind ({commit}, kind) {
    commit('SET_KIND', kind)
  }
}
