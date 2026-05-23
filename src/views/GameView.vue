<template>
  <app-chrome v-if="!countdownStarted">
    <div class="home">
      <section class="hero">
        <div class="eyebrow">60-second silhouette sprint</div>
        <h1 class="display hero-title">
          Who's that <span class="accent">pokemon?</span>
        </h1>

        <div class="chips">
          <div v-for="c in chips" :key="c.text" class="chip">
            <span class="chip-accent">{{ c.icon }}</span
            >{{ c.text }}
          </div>
        </div>

        <form class="start-row" @submit.prevent="start">
          <div class="name-field">
            <label class="name-label">Trainer name</label>
            <input
              ref="nameInput"
              v-model="name"
              class="input"
              maxlength="20"
              placeholder="enter a name"
            />
          </div>
          <button
            type="submit"
            class="btn btn-coral btn-lg"
            :disabled="!name.trim() || pokemon.length === 0"
          >
            Start ▸
          </button>
        </form>
      </section>

      <aside class="stage-wrap">
        <div class="stage-frame">
          <div class="stage">
            <svg class="rays" viewBox="0 0 400 400">
              <line
                v-for="i in 12"
                :key="i"
                :x1="200 + Math.cos(((i - 1) / 12) * Math.PI * 2) * 80"
                :y1="200 + Math.sin(((i - 1) / 12) * Math.PI * 2) * 80"
                :x2="200 + Math.cos(((i - 1) / 12) * Math.PI * 2) * 280"
                :y2="200 + Math.sin(((i - 1) / 12) * Math.PI * 2) * 280"
                stroke="#fff"
                stroke-width="34"
                stroke-linecap="round"
                opacity="0.4"
              />
            </svg>

            <div class="silhouette-wrap">
              <img
                v-if="featured"
                :src="featured.imageUrl"
                class="silhouette"
                alt=""
              />
            </div>

            <div class="badge-q">?</div>

            <div class="badge-timer">
              <span class="chip-accent">⏱</span> 1:00
            </div>
          </div>

          <div class="float float-tl">
            <img v-if="floatA" :src="floatA.imageUrl" alt="" />
          </div>
          <div class="float float-br">
            <img v-if="floatB" :src="floatB.imageUrl" alt="" />
          </div>
        </div>
      </aside>
    </div>
  </app-chrome>

  <div v-else class="countdown bg-cream">
    <div class="countdown-number">{{ timeLeft }}</div>
  </div>
</template>

<script>
import AppChrome from '@/components/AppChrome.vue'

export default {
  name: 'GameView',
  components: { AppChrome },
  data () {
    return {
      timeLeft: 3,
      countdownStarted: false,
      countdownTimer: null,
      name: this.$store.getters.playerName,
      featured: null,
      floatA: null,
      floatB: null,
      chips: [
        { icon: '⏱', text: 'Start with 60s' },
        { icon: '✓', text: '+2s per catch' },
        { icon: '↪', text: 'Pass with esc' },
        { icon: '✨', text: 'Hints every 2s' }
      ]
    }
  },
  computed: {
    pokemon () {
      return this.$store.getters.getPokemon
    }
  },
  mounted () {
    this.pickShowcase()
    this.$nextTick(() => {
      if (!this.name) this.$refs.nameInput?.focus()
    })
  },
  beforeDestroy () {
    clearInterval(this.countdownTimer)
  },
  methods: {
    randomPokemon () {
      return this.pokemon[Math.floor(Math.random() * this.pokemon.length)]
    },
    pickShowcase () {
      if (this.pokemon.length === 0) return
      this.featured = this.randomPokemon()
      this.floatA = this.randomPokemon()
      this.floatB = this.randomPokemon()
    },
    start () {
      this.$store.commit('setPlayerName', this.name)
      this.countdownStarted = true
      this.countdownTimer = setInterval(() => {
        if (this.timeLeft <= 1) {
          clearInterval(this.countdownTimer)
          this.$router.push('/play')
          return
        }
        this.timeLeft -= 1
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 36px;
  align-items: stretch;
  flex: 1;
  min-height: 0;
}

.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.hero-title {
  font-size: clamp(48px, 8vw, 84px);
  margin: 14px 0 18px;
  .accent {
    color: var(--coral);
  }
}

.hero-sub {
  font-size: 19px;
  color: var(--ink-soft);
  line-height: 1.5;
  max-width: 460px;
  margin: 0 0 32px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 36px;
  max-width: 540px;
}

.start-row {
  display: flex;
  gap: 14px;
  align-items: stretch;
  max-width: 540px;
}

.name-field {
  flex: 1;
  position: relative;
}

.name-label {
  position: absolute;
  top: -10px;
  left: 18px;
  font-family: "Fredoka", sans-serif;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--coral);
  background: var(--cream);
  padding: 0 8px;
}

.stage-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-frame {
  position: relative;
  width: 100%;
  max-width: 520px;
  aspect-ratio: 1 / 1;
}

.stage {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, #ffd9da 0%, #ffb0b3 60%, #ff8a8e 100%);
  border-radius: 36px;
  box-shadow: 0 14px 0 -2px rgba(214, 60, 66, 0.45),
    0 30px 60px -20px rgba(255, 90, 95, 0.5);
  border: 3px solid #fff;
  overflow: hidden;
}

.rays {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.35;
}

.silhouette-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18%;
}

.float {
  position: absolute;
  padding: 10px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 0 0 #e5dec9, inset 0 0 0 1.5px #f1e8d4;
  img {
    width: 56px;
    height: 56px;
    display: block;
  }
}

.float-tl {
  top: 30px;
  left: -10px;
  transform: rotate(-12deg);
}
.float-br {
  bottom: 20px;
  right: 0;
  transform: rotate(8deg);
}

.badge-q {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 64px;
  height: 64px;
  border-radius: 22px;
  background: var(--butter);
  box-shadow: 0 5px 0 0 var(--butter-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 38px;
  color: var(--ink);
  transform: rotate(8deg);
}

.badge-timer {
  position: absolute;
  bottom: 24px;
  left: 24px;
  padding: 10px 18px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 0 0 #e5dec9;
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.countdown {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-number {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: clamp(160px, 30vw, 280px);
  color: var(--coral);
  line-height: 1;
  text-shadow: 0 14px 0 var(--coral-deep);
}

@media (max-width: 960px) {
  .home {
    grid-template-columns: 1fr;
  }
  .stage-wrap {
    display: none;
  }
}

@media (max-width: 560px) {
  .start-row {
    flex-direction: column;
  }
}
</style>
