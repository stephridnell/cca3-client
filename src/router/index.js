import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'game',
    component: () => import(/* webpackChunkName: "game" */ '../views/GameView.vue')
  },
  {
    path: '/play',
    name: 'play',
    component: () => import(/* webpackChunkName: "play" */ '../views/PlayView.vue')
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import(/* webpackChunkName: "leaderboard" */ '../views/LeaderboardView.vue')
  },
  {
    path: '/pokedex',
    name: 'pokedex',
    component: () => import(/* webpackChunkName: "pokedex" */ '../views/ProfileView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
