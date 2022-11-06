<template>
  <div id="app">
    <div style="align-items: center; justify-content: center; width: 100%; display: flex;" class="p-24">
      <img class="logo" alt="title-image" src="./assets/Whos-that-pokemon.png">
    </div>
    <nav class="text-center" v-if="!['/login', '/register'].includes($route.path)">
      <router-link class="button nav-button text-18 m-12" :class="$route.path === '/' || $route.path === '/play' ? 'active' : ''" to="/">Play</router-link>
      <router-link class="button nav-button text-18 m-12" :class="$route.path === '/pokedex' ? 'active' : ''" to="/pokedex">Pokedex</router-link>
      <router-link class="button nav-button text-18 m-12" :class="$route.path === '/leaderboard' ? 'active' : ''" to="/leaderboard">Leaderboard</router-link>
      <button class="button nav-button text-18 m-12" @click="logout">Logout</button>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import http from '@/http'
export default {
  name: 'AppWrapper',
  async mounted () {
    await this.loadPokemon()
  },
  methods: {
    async loadPokemon () {
      const data = await http.get('pokemon')
      this.$store.commit('setPokemon', data.pokemon)
    },
    logout () {
      this.$store.commit('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/style.scss';
</style>
