<template>
  <div class="game">
    <div class="container p-8">
      <div class="card mw-480">
        <div class="card-body plr-32 ptb-12">
          <div class="card-header pb-12">
            Who's that pokemon?
          </div>
          <div class="text-64">{{ timeLeft }}</div>
          <template v-if="!gameComplete">
            <template v-if="currentPokemon">
              <img style="width: 300px; max-width: 100%; filter: brightness(0%); margin-bottom:20px;" :src="currentPokemon.imageUrl">
              <pokemon-input
                :key="currentPokemon.name"
                :length="currentPokemon.name.length"
                :value="fullValue"
                @input="typed"
                inputColor="#31bce6"
              />
            </template>

            {{ fullValue }}

            <div class="p-24 mt-20">
              <button class="button text-20 text-bold" @click="pass">
                Pass
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import http from '@/http'
import PokemonInput from '@/components/PokemonInput.vue'

export default {
  name: 'PlayView',
  data: () => {
    return {
      timeLeft: 60,
      gameTimer: null,
      currentPokemon: null,
      fullValue: '',
      results: [],
      gameComplete: false
    }
  },
  components: {
    PokemonInput
  },
  mounted () {
    if (this.pokemon.length === 0) {
      this.$router.push('/')
    }
    this.currentPokemon = this.getRandomPokemon()
    this.start()
  },
  beforeDestroy () {
    clearInterval(this.gameTimer)
  },
  computed: {
    pokemon () {
      return this.$store.getters.getPokemon
    }
  },
  methods: {
    pass () {
      this.results.push({
        pokemon: `${this.currentPokemon.id}`,
        correct: false
      })
      this.fullValue = ''
      this.currentPokemon = this.getRandomPokemon()
    },
    async typed (e) {
      const lc = e.toLowerCase()
      if (lc === this.currentPokemon.name) {
        this.addTime()
        this.results.push({
          pokemon: `${this.currentPokemon.id}`,
          correct: true
        })
        this.fullValue = ''
        await this.$nextTick()
        this.currentPokemon = this.getRandomPokemon()
      }
    },
    getRandomPokemon () {
      const randomNumber = Math.floor(Math.random() * (251 - 1 + 1) + 1)
      return this.pokemon[randomNumber]
    },
    addTime () {
      this.timeLeft += 2
    },
    start () {
      this.countdownStarted = true
      this.gameTimer = setInterval(() => {
        if (this.timeLeft <= 0) {
          this.gameComplete = true
          clearInterval(this.gameTimer)
        }
        this.timeLeft -= 1
      }, 1000)
    }
  }
}
</script>
