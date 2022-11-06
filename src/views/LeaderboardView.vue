<template>
  <div class="leaderboard">
    <div class="container p-8">
      <div class="card mw-480">
        <div class="card-body plr-32 ptb-12">
          <div class="card-header pb-12">
            Leaderboard
          </div>
          <table class="mb-12">
            <tr v-for="lbItem in leaderboard" :key="lbItem.userId" :class="lbItem.userId === currentUser.userId ? 'text-bold' : ''">
              <td class="text-right p-8">{{ lbItem.score }}</td>
              <td class="p-8">{{ lbItem.user.name }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/http'

export default {
  name: 'LeaderboardView',
  data: () => {
    return {
      leaderboard: []
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters.currentUser
    }
  },
  async mounted () {
    const data = await http.get('game/leaderboard')
    this.leaderboard = data
  }
}
</script>
