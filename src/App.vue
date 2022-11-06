<template>
  <div id="app">
    <div style="align-items: center; justify-content: center; width: 100%; display: flex;" class="p-24">
      <img style="max-width: 480px;" alt="title-image" src="./assets/Whos-that-pokemon.png">
    </div>
    <nav>
      <router-link to="/">New game</router-link> |
      <router-link to="/register">Register</router-link> |
      <router-link to="/profile">Profile</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/leaderboard">Leaderboard</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import '@/assets/style.scss';
</style>
