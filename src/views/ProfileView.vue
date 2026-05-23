<template>
  <div class="profile">
    <div class="container p-8">
      <div class="card" style="max-width: 1114px;">
        <div class="card-body plr-32 ptb-12">
          <div class="card-header pb-12">
            {{ playerName || 'Pokedex' }}
          </div>
          <div class="mb-24" v-if="encounters.length === 0">
            Come back after playing to see your stats!
          </div>
          <template v-else>
            <div class="text-24">
              <strong>Lifetime score:</strong>
              {{ totalScore }}
            </div>
            <div style="border-top: 1px solid rgb(241, 241, 241);padding: 10px 0px;height: 10px;margin-top: 32px;width: 100%;"></div>
            <div>
              <div class="text-24 text-bold text-center">
                Encounters
              </div>
              <div class="encounter-grid">
                <div class="encounter" v-for="(encounter, index) in encounters" :key="index">
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
import { getEncounters, getTotalScore } from '@/storage'

export default {
  name: 'ProfileView',
  data () {
    return {
      totalScore: getTotalScore(),
      encounters: []
    }
  },
  computed: {
    playerName () {
      return this.$store.getters.playerName
    },
    pokemon () {
      return this.$store.getters.getPokemon
    }
  },
  mounted () {
    const counts = getEncounters()
    this.encounters = Object.entries(counts)
      .map(([id, count]) => ({
        pokemon: this.pokemon.find(p => p.id === Number(id)),
        count
      }))
      .filter(e => e.pokemon)
      .sort((a, b) => b.count - a.count)
  }
}
</script>
