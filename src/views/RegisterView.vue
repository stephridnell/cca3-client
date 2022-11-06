<template>
  <div class="register">
    <div class="container p-8">
      <div class="card mw-480">
        <div class="card-body p-12">
          <div class="card-header">
            Create new account
          </div>
          <form class="w-100" @submit="register">
            <div class="p-12">
              <input type="text" v-model="email" placeholder="email" />
              <div class="form-error" v-if="emailError">
                {{ emailError }}
              </div>
            </div>
            <div class="p-12">
              <input type="text" v-model="name" placeholder="name" />
              <div class="form-error" v-if="nameError">
                {{ nameError }}
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
                Register
              </button>
              <router-link class="button ghost" to="/login">
                Login
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
  name: 'RegisterView',
  mounted () {
    this.$store.commit('logout')
  },
  data: () => {
    return {
      email: '',
      name: '',
      password: '',
      emailError: '',
      nameError: '',
      passwordError: '',
      formError: ''
    }
  },
  methods: {
    resetErrors () {
      this.emailError = ''
      this.nameError = ''
      this.passwordError = ''
      this.formError = ''
    },
    async register (e) {
      e.preventDefault()
      this.resetErrors()
      if (!this.email) {
        this.emailError = 'Email is required'
      }
      if (!this.password) {
        this.passwordError = 'Password is required'
      }
      if (!this.name) {
        this.nameError = 'Name is required'
      }
      if (this.passwordError || this.emailError || this.nameError) {
        return
      }
      try {
        await http.post('/auth/register', { email: this.email, password: this.password, name: this.name })
        this.$router.push('/login')
      } catch (e) {
        this.formError = e.msg
      }
    }
  }
}
</script>
