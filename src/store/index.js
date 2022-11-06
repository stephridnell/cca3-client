import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const initialUser = {
  id: '',
  name: '',
  email: ''
}

export default new Vuex.Store({
  state: {
    user: initialUser
  },
  getters: {
    currentUser (state) {
      return state.user
    }
  },
  mutations: {
    // setting the whole user in localstorage as a very budget way of persisting login without using jwt
    setCurrentUser (state, user) {
      window.localStorage.setItem('user', JSON.stringify(user))
      state.user = { ...user }
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
