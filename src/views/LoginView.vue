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
              <div class="form-error" v-if="emailError">
                {{ emailError }}
              </div>
            </div>
            <div class="p-12">
              <input type="password" v-model="password" placeholder="password" />
              <div class="form-error">
                {{ passwordError }}
              </div>
          </div>
            <div class="form-error mt-0" v-if="formError">
              {{ formError }}
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
      password: '',
      emailError: '',
      passwordError: '',
      formError: ''
    }
  },
  methods: {
    resetErrors () {
      this.emailError = ''
      this.passwordError = ''
      this.formError = ''
    },
    async login (e) {
      e.preventDefault()
      this.resetErrors()
      if (!this.email) {
        this.emailError = 'Email is required'
      }
      if (!this.password) {
        this.passwordError = 'Password is required'
      }
      if (this.passwordError || this.emailError) {
        return
      }
      try {
        const data = await http.post('/auth/login', { email: this.email, password: this.password })
        this.$store.commit('setCurrentUser', data.user)
        this.$router.push('/')
      } catch (e) {
        this.formError = e.msg
      }
    }
  }
}
</script>
