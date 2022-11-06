<template>
  <div class="profile">
    <div class="container p-8">
      <div class="card" style="max-width: 1114px;">
        <div class="card-body plr-32 ptb-12">
          <div class="card-header pb-12">
            {{ currentUser.name }}
          </div>
          <div class="mb-24" v-if="userStats.encounters.length === 0">
            Come back after playing to see your stats!
          </div>
          <template v-else>
            <div class="text-24">
              <strong>Lifetime score:</strong>
              {{ userStats.totalScore }}
            </div>
            <div style="border-top: 1px solid rgb(241, 241, 241);padding: 10px 0px;height: 10px;margin-top: 32px;width: 100%;"></div>
            <div>
              <div class="text-24 text-bold text-center">
                Encounters
              </div>
              <div class="encounter-grid">
                <div class="encounter" v-for="(encounter, index) in userStats.encounters" :key="index">
                  <img style="width:160px;max-width:100%;" :src="encounter.pokemon.imageUrl">
                  <div>
                    <span class="text-bold" style="text-transform: capitalize;">{{ encounter.pokemon.name }}</span>: {{ encounter.count }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/http'

export default {
  name: 'ProfileView',
  data: () => {
    return {
      userStats: []
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters.currentUser
    }
  },
  async mounted () {
    const url = `game/stats/${this.currentUser.userId}`.replace('#', '%23')
    const data = await http.get(url)
    this.userStats = data
  }
}
</script>
