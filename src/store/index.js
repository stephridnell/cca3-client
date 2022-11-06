import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const initialUser = {
  userId: '',
  name: '',
  email: ''
}

export default new Vuex.Store({
  state: {
    user: initialUser,
    pokemon: []
  },
  getters: {
    currentUser (state) {
      return state.user
    },
    getPokemon (state) {
      return state.pokemon
    }
  },
  mutations: {
    // setting the whole user in localstorage as a very budget way of persisting login without using jwt
    setCurrentUser (state, user) {
      window.localStorage.setItem('user', JSON.stringify(user))
      state.user = { ...user }
    },
    setPokemon (state, pokemon) {
      state.user = [...pokemon]
    },
    logout (state) {
      window.localStorage.removeItem('user')
      state.user = initialUser
    }
  },
  actions: {
  },
  modules: {
  }
})
