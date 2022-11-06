<template>
  <div class="game">
    <div class="container p-8">
      <div class="card mw-480">
        <div class="card-body plr-32 ptb-12">
          <template v-if="!countdownStarted">
            <div class="card-header pb-12">
              New game
            </div>
            <div class="info-card">
              <div class="p-8">Identify as many pokemon silhouttes as you can in <strong>60 seconds</strong></div>
              <div class="p-8">Get <strong>+2 seconds</strong> for each correct answer</div>
              <div class="p-8">Click <strong>pass</strong> if you don't know the answer</div>
            </div>
            <div class="p-12 text-20">
              Ready?
            </div>
            <div class="p-12">
              <button :disabled="pokemon.length === 0" class="button text-20 text-bold" @click="start">
                Start
              </button>
            </div>
          </template>
          <template v-else>
            <div class="text-48">
              {{ timeLeft }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameView',
  data: () => {
    return {
      timeLeft: 3,
      countdownStarted: false,
      countdownTimer: null
    }
  },
  beforeDestroy () {
    clearInterval(this.countdownTimer)
  },
  computed: {
    pokemon () {
      return this.$store.getters.getPokemon
    }
  },
  methods: {
    start () {
      this.countdownStarted = true
      this.countdownTimer = setInterval(() => {
        if (this.timeLeft <= 1) {
          this.$router.push('/play')
          clearInterval(this.countdownTimer)
        }
        this.timeLeft -= 1
      }, 1000)
    }
  }
}
</script>
