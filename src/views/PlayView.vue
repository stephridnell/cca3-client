<template>
  <div class="game">
    <div class="container p-8">
      <div class="card" style="max-width: 824px">
        <div class="card-body plr-32 ptb-12">
          <div class="card-header pb-12">
            Who's that pokemon?
          </div>
          <template v-if="!gameComplete">
            <div class="text-64" v-if="timeLeft >= 0">
              {{ timeLeft }}
            </div>
            <template v-if="currentPokemon">
              <img style="width: 300px; max-width: 100%; filter: brightness(0%); margin-bottom:20px;" :src="currentPokemon.imageUrl">
              <div class="pokemon-input-container">
                <pokemon-input
                  :key="currentPokemon.name"
                  :length="currentPokemon.name.length"
                  :value="fullValue"
                  @input="typed"
                  inputColor="#31bce6"
                />
              </div>
            </template>

            <div class="text-14 mt-40" style="text-align:center;">
              Hint
              <div style="display:flex;">
                <div style="width: 40px" v-for="(char, i) in revealedLetters" :key="char+i">
                  {{ char }}
                </div>
              </div>
            </div>

            <div class="p-24 mt-20">
              <button class="button text-20 text-bold" @click="pass">
                Pass
              </button>
              <div class="text-14">
                (or press Esc)
              </div>
            </div>
          </template>
          <template v-else>
            <div>{{ completionText }}</div>
            <div>Your score: <strong>{{ score }}</strong></div>
            <div class="encounter-grid">
              <div class="encounter" v-for="(pokemon, index) in results" :key="index">
                <img style="width:140px;max-width:100%;" :src="pokemon.imageUrl">
                <div>
                  <span class="text-bold" style="text-transform: capitalize;">{{ pokemon.name }}</span>
                </div>
                <div v-if="pokemon.correct" class="green text-20">✔</div>
                <div v-else class="red text-20">✗</div>
              </div>
            </div>

            <div class="p-12 text-20">
              Try again?
            </div>
            <div class="p-12">
              <button :disabled="!resultsStored" class="button text-20 text-bold" @click="restart">
                Restart
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/http'
import PokemonInput from '@/components/PokemonInput.vue'

const TIME = 60
const TOTAL_POKEMON = 246

export default {
  name: 'PlayView',
  data: () => {
    return {
      timeLeft: TIME,
      gameTimer: null,
      letterRevealTimer: null,
      currentPokemon: null,
      fullValue: '',
      results: [],
      gameComplete: false,
      completionText: '',
      resultsStored: false,
      revealedLetters: [],
      currentNameLength: 0,
      completionTextOptions: [
        'Nice!',
        'Gotta catch em all!',
        'Professor Oak would be proud',
        'You gave Garry a run for his money',
        'Well done',
        'You did it!'
      ]
    }
  },
  components: {
    PokemonInput
  },
  mounted () {
    if (this.pokemon.length === 0) {
      this.$router.push('/')
    }

    window.addEventListener('keydown', this.escPass)

    this.getRandomPokemon()
    this.start()
  },
  beforeDestroy () {
    clearInterval(this.gameTimer)
    clearInterval(this.letterRevealTimer)
    window.removeEventListener('keydown', this.escPass)
  },
  computed: {
    pokemon () {
      return this.$store.getters.getPokemon
    },
    currentUser () {
      return this.$store.getters.currentUser
    },
    score () {
      return this.results.reduce((prev, curr) => {
        if (curr.correct) prev++
        return prev
      }, 0)
    }
  },
  methods: {
    revealLetter () {
      const hiddenIndeces = []
      this.revealedLetters.forEach((char, i) => {
        if (char === '_') {
          hiddenIndeces.push(i)
        }
      })

      const randomNumber = Math.floor(Math.random() * hiddenIndeces.length)
      const idxToReveal = hiddenIndeces[randomNumber]
      this.revealedLetters[idxToReveal] = this.currentPokemon.name[idxToReveal]
    },
    escPass (event) {
      if (event.key === 'Escape' && !this.gameComplete) {
        this.pass()
      }
    },
    getRandomCompleteText () {
      const randomNumber = Math.floor(Math.random() * (this.completionTextOptions.length + 1))
      this.completionText = this.completionTextOptions[randomNumber]
    },
    restart () {
      this.results = []
      this.fullValue = ''
      this.timeLeft = TIME
      this.getRandomPokemon()
      this.start()
    },
    pass () {
      this.results.push({
        pokemon: `${this.currentPokemon.id}`,
        correct: false,
        imageUrl: this.currentPokemon.imageUrl,
        name: this.currentPokemon.name
      })
      this.fullValue = ''
      this.getRandomPokemon()
    },
    async typed (e) {
      const lc = e.toLowerCase()
      if (lc === this.currentPokemon.name) {
        this.addTime()
        this.results.push({
          pokemon: `${this.currentPokemon.id}`,
          correct: true,
          imageUrl: this.currentPokemon.imageUrl,
          name: this.currentPokemon.name
        })
        this.fullValue = ''
        await this.$nextTick()
        this.getRandomPokemon()
      }
    },
    getRandomPokemon () {
      const randomNumber = Math.floor(Math.random() * (TOTAL_POKEMON - 1 + 1) + 1)
      this.currentPokemon = this.pokemon[randomNumber]
      this.currentNameLength = this.currentPokemon.name.length
      this.revealedLetters = new Array(this.currentNameLength).fill('_')
    },
    addTime () {
      this.timeLeft += 2
    },
    async endGame () {
      await http.post('game/end', {
        userId: this.currentUser.userId,
        results: this.results.map(el => {
          return {
            correct: el.correct,
            pokemon: el.pokemon
          }
        })
      })
      this.resultsStored = true
      this.getRandomCompleteText()
      this.gameComplete = true
      this.results.push({
        pokemon: `${this.currentPokemon.id}`,
        correct: false,
        imageUrl: this.currentPokemon.imageUrl,
        name: this.currentPokemon.name
      })
    },
    start () {
      this.gameComplete = false
      this.resultsStored = false
      this.gameTimer = setInterval(() => {
        if (this.timeLeft <= 0) {
          clearInterval(this.gameTimer)
          this.endGame()
        }
        this.timeLeft -= 1
      }, 1000)

      this.letterRevealTimer = setInterval(() => {
        if (this.timeLeft <= 0) {
          clearInterval(this.letterRevealTimer)
        }
        this.revealLetter()
      }, 1500)
    }
  }
}
</script>
