<template>
  <div v-if="!gameComplete" class="play bg-dots">
    <header class="play-header">
      <app-logo :size="38" />
      <button class="btn btn-ghost btn-sm" @click="quit">✕ Quit</button>
    </header>

    <div class="hud">
      <div class="hud-cell hud-left">
        <div class="hud-tile mint">{{ score }}</div>
        <div>
          <div class="hud-label">Caught</div>
          <div class="hud-value">{{ score }} pokemon</div>
        </div>
      </div>

      <div class="hud-cell hud-center">
        <div class="hud-label">Time left</div>
        <div class="timer">{{ formattedTime }}</div>
        <div class="timer-bar">
          <div class="timer-fill" :style="{ width: timerPct + '%' }" />
        </div>
      </div>

      <div class="hud-cell hud-right">
        <div class="hud-text-right">
          <div class="hud-label">Streak</div>
          <div class="hud-value">
            <template v-if="streak > 0">{{ streak }} in a row 🔥</template>
            <template v-else>–</template>
          </div>
        </div>
        <div v-if="streak > 0" class="hud-tile butter">×{{ streak }}</div>
        <div v-else class="hud-tile butter dim">×0</div>
      </div>
    </div>

    <div class="stage-area">
      <div class="silhouette-stage">
        <img
          v-if="currentPokemon"
          :src="currentPokemon.imageUrl"
          class="silhouette"
          alt=""
        />
        <transition name="pop">
          <div v-if="bonusVisible" class="bonus">+2s</div>
        </transition>
        <transition name="pop">
          <div v-if="missedVisible" class="escaped">It escaped!</div>
        </transition>
      </div>

      <div class="letter-row">
        <div
          v-for="(char, i) in revealedLetters"
          :key="i"
          class="letter"
          :class="char === '_' ? 'blank' : 'revealed'"
        >
          {{ char === "_" ? "" : char }}
        </div>
      </div>

      <form class="guess-row" @submit.prevent>
        <input
          ref="guessInput"
          v-model="guess"
          class="input"
          placeholder="Type your guess…"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @input="onTyped"
        />
        <button type="button" class="btn btn-ghost" @click="pass">
          ↪ Pass
        </button>
      </form>

      <div class="hotkeys">ESC&nbsp;to pass</div>
    </div>
  </div>

  <app-chrome v-else>
    <div class="results">
      <div class="card score-card">
        <div class="eyebrow">Time's up</div>
        <h2 class="display result-title">
          Nice run, {{ playerName || "trainer" }}!
        </h2>
        <p class="result-sub">You caught {{ score }} pokemon in 60 seconds.</p>

        <div class="big-score">
          <div class="eyebrow">Pokemon caught</div>
          <div class="big-number">{{ score }}</div>
        </div>

        <button class="btn btn-coral btn-lg play-again" @click="restart">
          ↻ Play again
        </button>
      </div>

      <div class="card lineup-card">
        <header class="lineup-head">
          <h3 class="display lineup-title">The lineup</h3>
          <div class="lineup-count">{{ results.length }} pokemon this run</div>
        </header>

        <div v-if="caught.length" class="lineup-section-head mint-text">
          <span class="tick mint"><span>✓</span></span>
          CAUGHT&nbsp;<span class="mute">{{ caught.length }}</span>
        </div>
        <div v-if="caught.length" class="lineup-grid">
          <div v-for="(p, i) in caught" :key="'c' + i" class="lineup-cell">
            <div class="cell-image-wrap mint">
              <img :src="p.imageUrl" alt="" />
            </div>
            <div class="cell-name">{{ p.name }}</div>
          </div>
        </div>

        <div v-if="missed.length" class="lineup-section-head coral-text">
          <span class="tick coral"><span>✕</span></span>
          MISSED&nbsp;<span class="mute">{{ missed.length }}</span>
        </div>
        <div v-if="missed.length" class="lineup-grid">
          <div
            v-for="(p, i) in missed"
            :key="'m' + i"
            class="lineup-cell missed"
          >
            <div class="cell-image-wrap coral">
              <img :src="p.imageUrl" class="silhouette" alt="" />
            </div>
            <div class="cell-name">{{ p.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </app-chrome>
</template>

<script>
import AppChrome from '@/components/AppChrome.vue'
import { submitScore } from '@/storage'

const TIME = 60
const HINT_INTERVAL = 2000
const BONUS_DURATION = 700
const MISSED_DURATION = 1000

export default {
  name: 'PlayView',
  components: { AppChrome },
  data () {
    return {
      timeLeft: TIME,
      gameTimer: null,
      hintTimer: null,
      bonusTimeout: null,
      currentPokemon: null,
      guess: '',
      results: [],
      gameComplete: false,
      streak: 0,
      revealedLetters: [],
      bonusVisible: false,
      missedVisible: false
    }
  },
  computed: {
    pokemon () {
      return this.$store.getters.getPokemon
    },
    playerName () {
      return this.$store.getters.playerName
    },
    score () {
      return this.results.filter((r) => r.correct).length
    },
    caught () {
      return this.results.filter((r) => r.correct)
    },
    missed () {
      return this.results.filter((r) => !r.correct)
    },
    formattedTime () {
      const t = Math.max(0, this.timeLeft)
      const m = Math.floor(t / 60)
      const s = t % 60
      return `${m}:${String(s).padStart(2, '0')}`
    },
    timerPct () {
      return Math.max(0, Math.min(100, (this.timeLeft / TIME) * 100))
    }
  },
  mounted () {
    if (this.pokemon.length === 0) {
      this.$router.replace('/')
      return
    }
    window.addEventListener('keydown', this.onKey)
    this.startRun()
  },
  beforeDestroy () {
    this.clearTimers()
    window.removeEventListener('keydown', this.onKey)
  },
  methods: {
    clearTimers () {
      clearInterval(this.gameTimer)
      clearInterval(this.hintTimer)
      clearTimeout(this.bonusTimeout)
    },
    onKey (e) {
      if (this.gameComplete) return
      if (e.key === 'Escape') {
        e.preventDefault()
        this.pass()
      }
    },
    startRun () {
      this.results = []
      this.guess = ''
      this.timeLeft = TIME
      this.streak = 0
      this.gameComplete = false
      this.nextPokemon()
      this.$nextTick(() => this.$refs.guessInput?.focus())

      this.gameTimer = setInterval(() => {
        if (this.timeLeft <= 0) {
          this.clearTimers()
          this.endRun()
          return
        }
        this.timeLeft -= 1
      }, 1000)

      this.hintTimer = setInterval(() => this.revealLetter(), HINT_INTERVAL)
    },
    nextPokemon () {
      const idx = Math.floor(Math.random() * this.pokemon.length)
      this.currentPokemon = this.pokemon[idx]
      this.revealedLetters = new Array(this.currentPokemon.name.length).fill(
        '_'
      )
      this.guess = ''
    },
    revealLetter () {
      if (!this.currentPokemon) return
      const hidden = []
      this.revealedLetters.forEach((c, i) => {
        if (c === '_') hidden.push(i)
      })
      if (!hidden.length) return
      const pick = hidden[Math.floor(Math.random() * hidden.length)]
      this.$set(this.revealedLetters, pick, this.currentPokemon.name[pick])
      if (hidden.length === 1) {
        this.pass()
        this.flashMissed()
      }
    },
    onTyped () {
      if (!this.currentPokemon) return
      if (this.guess.trim().toLowerCase() === this.currentPokemon.name) {
        this.markCorrect()
      }
    },
    markCorrect () {
      this.timeLeft += 2
      this.streak += 1
      this.results.push({
        id: this.currentPokemon.id,
        correct: true,
        imageUrl: this.currentPokemon.imageUrl,
        name: this.currentPokemon.name
      })
      this.flashBonus()
      this.nextPokemon()
    },
    pass () {
      if (!this.currentPokemon) return
      this.streak = 0
      this.results.push({
        id: this.currentPokemon.id,
        correct: false,
        imageUrl: this.currentPokemon.imageUrl,
        name: this.currentPokemon.name
      })
      this.nextPokemon()
    },
    flashBonus () {
      clearTimeout(this.bonusTimeout)
      this.bonusVisible = true
      this.bonusTimeout = setTimeout(() => {
        this.bonusVisible = false
      }, BONUS_DURATION)
    },
    flashMissed () {
      clearTimeout(this.missedTimeout)
      this.missedVisible = true
      this.missedTimeout = setTimeout(() => {
        this.missedVisible = false
      }, MISSED_DURATION)
    },
    async endRun () {
      this.gameComplete = true
      await submitScore({ name: this.playerName || 'anon', score: this.score })
    },
    restart () {
      this.startRun()
    },
    quit () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.play {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.play-header {
  padding: 20px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hud {
  padding: 0 36px 18px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  align-items: center;
}

.hud-cell {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.hud-left {
  justify-content: flex-start;
}
.hud-center {
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.hud-right {
  justify-content: flex-end;
}

.hud-tile {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 24px;
}

.hud-tile.mint {
  background: var(--mint);
  color: #06342b;
  box-shadow: 0 4px 0 0 var(--mint-deep);
}

.hud-tile.butter {
  background: var(--butter);
  color: var(--ink);
  box-shadow: 0 4px 0 0 var(--butter-deep);
}

.hud-tile.dim {
  opacity: 0.5;
}

.hud-label {
  font-family: "Fredoka", sans-serif;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
}

.hud-value {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: var(--ink);
}

.hud-text-right {
  text-align: right;
}

.timer {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 56px;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.timer-bar {
  width: 240px;
  height: 10px;
  border-radius: 999px;
  background: #ffe7d6;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.05);
}

.timer-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--coral), var(--butter));
  border-radius: 999px;
  transition: width 1s linear;
}

.stage-area {
  flex: 1;
  padding: 0 36px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  min-height: 0;
}

.silhouette-stage {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 450px;
  background: radial-gradient(
    circle at 50% 40%,
    #ffffff 0%,
    #fff1da 70%,
    #ffe0bb 100%
  );
  border-radius: 50%;
  box-shadow: 0 12px 0 -2px #f0dcb4, 0 30px 60px -20px rgba(206, 156, 19, 0.4);
  border: 4px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.silhouette {
  filter: brightness(0%);
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.escaped {
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--coral);
  box-shadow: 0 4px 0 0 var(--coral-deep);
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: rgb(52, 6, 6);
  transform: rotate(12deg);
}

.bonus {
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--mint);
  box-shadow: 0 4px 0 0 var(--mint-deep);
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #06342b;
  transform: rotate(12deg);
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s ease;
}
.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: rotate(12deg) scale(0.6);
}
.pop-enter-to,
.pop-leave {
  opacity: 1;
  transform: rotate(12deg) scale(1);
}

.guess-row {
  width: 100%;
  max-width: 640px;
  display: flex;
  gap: 12px;
}

.hotkeys {
  font-family: "Fredoka", sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: var(--ink-mute);
  letter-spacing: 0.06em;
}

/* ----- RESULTS ----- */
.results {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 28px;
  flex: 1;
  min-height: 0;
}

.score-card {
  padding: 36px;
  display: flex;
  flex-direction: column;
}

.result-title {
  font-size: 44px;
  margin: 8px 0 4px;
}

.result-sub {
  color: var(--ink-soft);
  font-size: 17px;
  margin: 0 0 24px;
}

.big-score {
  background: linear-gradient(160deg, #ffedd8 0%, #ffd9b7 100%);
  border-radius: 24px;
  padding: 24px 28px;
  border: 2px dashed #ffc093;
  margin-bottom: 18px;
}

.big-number {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 96px;
  line-height: 1;
  color: var(--ink);
}

.play-again {
  margin-top: auto;
  align-self: stretch;
}

.lineup-card {
  padding: 32px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.lineup-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
}

.lineup-title {
  font-size: 26px;
}

.lineup-count {
  font-family: "Fredoka", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--ink-mute);
}

.lineup-section-head {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.mint-text {
  color: var(--mint-deep);
}
.coral-text {
  color: var(--coral-deep);
}
.mute {
  color: var(--ink-mute);
  font-weight: 500;
}

.tick {
  width: 22px;
  height: 22px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.tick.mint {
  background: var(--mint);
  color: #06342b;
}
.tick.coral {
  background: #ffe0e1;
  color: var(--coral-deep);
}

.lineup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
  margin-bottom: 24px;
}

.lineup-cell {
  background: #fffbf1;
  border-radius: 16px;
  padding: 10px;
  border: 1.5px solid var(--line);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  &.missed {
    background: #fff7f7;
    border: 1.5px dashed #ffc2c4;
  }
}

.cell-image-wrap {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }

  &.mint {
    background: #dff8f0;
  }
  &.coral {
    background: #ffe0e1;
  }
}

.cell-name {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: var(--ink);
  text-transform: capitalize;
}

@media (max-width: 960px) {
  .results {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .play-header,
  .hud,
  .stage-area {
    padding-left: 20px;
    padding-right: 20px;
  }
  .hud {
    grid-template-columns: 1fr 1fr;
  }
  .hud-right {
    display: none;
  }
  .timer-bar {
    width: 180px;
  }
}
</style>
