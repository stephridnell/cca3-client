<template>
  <div class="game">
    <div class="container p-8">
      <div class="card mw-480">
        <div class="card-body plr-32 ptb-12">
          <div class="card-header pb-12">
            Who's that pokemon?
          </div>
          {{ timeLeft }}
          <div class="p-12">
            <button class="button text-20 text-bold" @click="addTime">
              Correct
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import http from '@/http'

export default {
  name: 'PlayView',
  data: () => {
    return {
      timeLeft: 60,
      gameTimer: null
    }
  },
  mounted () {
    this.start()
  },
  beforeDestroy () {
    clearInterval(this.gameTimer)
  },
  methods: {
    addTime () {
      this.timeLeft += 2
    },
    start () {
      this.countdownStarted = true
      this.gameTimer = setInterval(() => {
        if (this.timeLeft <= 0) {
          this.$router.push('/play')
          clearInterval(this.gameTimer)
        }
        this.timeLeft -= 1
      }, 1000)
    }
  }
}
</script>
