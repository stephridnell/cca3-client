<template>
  <div class="login">
    <div class="container p-30">
      <div class="card mw-480">
        <div class="card-body p-12">
          <div class="card-header">
            Login
          </div>
          <form class="w-100" @submit="login">
            <div class="p-12">
              <input type="text" v-model="email" placeholder="email" />
            </div>
            <div class="p-12">
              <input type="password" v-model="password" placeholder="password" />
            </div>
            <div class="d-flex ai-center jc-sb p-16">
              <button class="button text-bold" type="submit">
                Login
              </button>
              <router-link class="button ghost" to="/register">
                Register
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/http'

export default {
  name: 'LoginView',
  mounted () {
    this.$store.commit('logout')
  },
  data: () => {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login (e) {
      e.preventDefault()
      try {
        const data = await http.post('/auth/login', { email: this.email, password: this.password })
        this.$store.commit('setCurrentUser', data.user)
        this.$router.push('/')
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}
</script>
