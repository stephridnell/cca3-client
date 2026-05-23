<template>
  <app-chrome>
    <div class="lb">
      <div class="card podium-card">
        <div class="eyebrow">All time</div>
        <h2 class="display podium-title">Top trainers</h2>

        <div v-if="loading" class="state">Loading…</div>
        <div v-else-if="leaderboard.length === 0" class="state">
          No scores yet — play a round to start the board.
        </div>
        <div v-else class="podium">
          <div v-for="p in podiumLayout" :key="p.rank" class="podium-col">
            <div class="podium-avatar" :style="{ borderColor: p.color }">
              <span class="podium-initial">{{ initial(p.entry.name) }}</span>
              <div
                class="podium-rank"
                :style="{
                  background: p.color,
                  color: p.ink,
                  boxShadow: `0 3px 0 0 ${p.deep}`,
                }"
              >
                {{ p.rank }}
              </div>
            </div>
            <div class="podium-name">{{ p.entry.name }}</div>
            <div
              class="podium-bar"
              :style="{
                height: p.h + 'px',
                background: p.color,
                color: p.ink,
                boxShadow: `0 4px 0 0 ${p.deep}`,
              }"
            >
              {{ p.entry.score }}
            </div>
          </div>
        </div>
      </div>

      <div class="card list-card">
        <header class="list-head">
          <h3 class="display list-title">All trainers</h3>
          <div v-if="!loading" class="list-count">
            {{ leaderboard.length }} scored
          </div>
        </header>

        <div class="list-table-head">
          <div>#</div>
          <div>Trainer</div>
          <div class="right">Top score</div>
        </div>

        <div v-if="loading" class="state">Loading…</div>
        <div v-else-if="leaderboard.length === 0" class="state">
          Be the first.
        </div>
        <div v-else class="list-rows">
          <div v-for="(entry, i) in leaderboard" :key="i" class="list-row">
            <div class="rank">
              <span
                v-if="i < 3"
                class="rank-dot"
                :style="{ background: medal(i) }"
              />
              {{ i + 1 }}
            </div>
            <div class="trainer">
              <div class="avatar">{{ initial(entry.name) }}</div>
              <div class="trainer-name">{{ entry.name }}</div>
            </div>
            <div class="score">{{ entry.score }}</div>
          </div>
        </div>
      </div>
    </div>
  </app-chrome>
</template>

<script>
import AppChrome from '@/components/AppChrome.vue'
import { fetchLeaderboard } from '@/storage'

export default {
  name: 'LeaderboardView',
  components: { AppChrome },
  data () {
    return {
      leaderboard: [],
      loading: true
    }
  },
  computed: {
    podiumLayout () {
      const top3 = this.leaderboard.slice(0, 3)
      if (top3.length === 0) return []
      const cfg = [
        {
          rank: 1,
          h: 170,
          color: 'var(--butter)',
          deep: 'var(--butter-deep)',
          ink: 'var(--ink)'
        },
        {
          rank: 2,
          h: 130,
          color: '#E2E8F0',
          deep: '#94A3B8',
          ink: 'var(--ink)'
        },
        { rank: 3, h: 105, color: '#E0996A', deep: '#A86B3B', ink: '#fff' }
      ]
      const items = top3.map((entry, i) => ({ entry, ...cfg[i] }))
      if (items.length === 3) return [items[1], items[0], items[2]]
      return items
    }
  },
  async mounted () {
    this.leaderboard = await fetchLeaderboard()
    this.loading = false
  },
  methods: {
    initial (name) {
      return (name || '?').trim().charAt(0).toUpperCase() || '?'
    },
    medal (i) {
      return ['var(--butter)', '#94A3B8', '#A86B3B'][i]
    }
  }
}
</script>

<style lang="scss" scoped>
.lb {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 28px;
  flex: 1;
  min-height: 0;
}

.podium-card {
  padding: 28px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #ffffff 0%, #fff5da 100%);
  max-height: 440px;
  height: 100%;
}

.podium-title {
  font-size: 36px;
  margin: 6px 0 24px;
}

.podium {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  align-items: end;
  gap: 10px;
  margin-top: auto;
}

.podium-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.podium-avatar {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: #fff;
  border: 3px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.podium-initial {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 32px;
  color: var(--ink);
}

.podium-rank {
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 14px;
}

.podium-name {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 17px;
  color: var(--ink);
}

.podium-bar {
  width: 100%;
  border-radius: 20px 20px 6px 6px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 14px;
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 32px;
}

.list-card {
  padding: 28px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.list-title {
  font-size: 24px;
}

.list-count {
  font-family: "Fredoka", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--ink-mute);
}

.list-table-head {
  display: grid;
  grid-template-columns: 48px 1fr 110px;
  gap: 12px;
  padding: 0 16px 8px;
  font-family: "Fredoka", sans-serif;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);

  .right {
    text-align: right;
  }
}

.list-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-row {
  display: grid;
  grid-template-columns: 48px 1fr 110px;
  gap: 12px;
  padding: 14px 16px;
  background: #fffbf1;
  border: 1.5px solid var(--line);
  border-radius: 16px;
  align-items: center;
}

.rank {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: var(--ink-mute);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rank-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
}

.trainer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #f0eadb;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
}

.trainer-name {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 17px;
  color: var(--ink);
}

.score {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: var(--ink);
  text-align: right;
}

.state {
  padding: 24px;
  text-align: center;
  color: var(--ink-mute);
  font-family: "Fredoka", sans-serif;
  font-weight: 500;
}

@media (max-width: 960px) {
  .lb {
    grid-template-columns: 1fr;
  }
}
</style>
