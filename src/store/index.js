import Vue from 'vue'
import Vuex from 'vuex'
import pokemon from '@/assets/pokemon'

Vue.use(Vuex)

const PLAYER_NAME_KEY = 'playerName'

export default new Vuex.Store({
  state: {
    pokemon,
    playerName: window.localStorage.getItem(PLAYER_NAME_KEY) || ''
  },
  getters: {
    getPokemon (state) {
      return state.pokemon
    },
    playerName (state) {
      return state.playerName
    }
  },
  mutations: {
    setPlayerName (state, name) {
      const trimmed = (name || '').trim()
      window.localStorage.setItem(PLAYER_NAME_KEY, trimmed)
      state.playerName = trimmed
    }
  }
})
