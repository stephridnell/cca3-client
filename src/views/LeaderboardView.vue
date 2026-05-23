<template>
  <div class="leaderboard">
    <div class="container p-8">
      <div class="card mw-480">
        <div class="card-body plr-32 ptb-12">
          <div class="card-header pb-12">
            Leaderboard
          </div>
          <div class="mb-12" v-if="leaderboard.length === 0">
            No scores yet — play a round to start the board.
          </div>
          <table class="mb-12" v-else>
            <tr v-for="(entry, i) in leaderboard" :key="i" :class="entry.name === playerName ? 'text-bold' : ''">
              <td class="text-right p-8">{{ entry.score }}</td>
              <td class="p-8">{{ entry.name }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLeaderboard } from '@/storage'

export default {
  name: 'LeaderboardView',
  data () {
    return {
      leaderboard: getLeaderboard()
    }
  },
  computed: {
    playerName () {
      return this.$store.getters.playerName
    }
  }
}
</script>
