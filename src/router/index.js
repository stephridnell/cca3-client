import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'game',
    component: () => import(/* webpackChunkName: "game" */ '../views/GameView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/RegisterView.vue')
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

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  const lsUser = window.localStorage.getItem('user')

  if (lsUser) {
    const user = JSON.parse(lsUser)
    store.commit('setCurrentUser', user)
  }

  if (authRequired && !store.getters.currentUser?.email) next({ name: 'login' })
  else next()
})

export default router
