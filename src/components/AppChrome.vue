<template>
  <div class="chrome" :class="bg">
    <header class="chrome-header">
      <app-logo />
      <nav class="tabs">
        <router-link
          v-for="t in tabs"
          :key="t.to"
          :to="t.to"
          class="tab"
          :class="{ active: isActive(t) }"
        >
          <span>{{ t.icon }}</span
          >{{ t.label }}
        </router-link>
      </nav>
      <div class="chrome-spacer" />
    </header>
    <main class="chrome-main">
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'AppChrome',
  props: {
    bg: { type: String, default: 'bg-cream' }
  },
  data () {
    return {
      tabs: [
        { label: 'Play', icon: '🎯', to: '/' },
        { label: 'Leaderboard', icon: '🏆', to: '/leaderboard' }
      ]
    }
  },
  methods: {
    isActive (tab) {
      if (tab.to === '/') { return this.$route.path === '/' || this.$route.path === '/play' }
      return this.$route.path === tab.to
    }
  }
}
</script>

<style lang="scss" scoped>
.chrome {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.chrome-header {
  padding: 24px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.chrome-spacer {
  min-width: 1px;
}

.chrome-main {
  flex: 1;
  padding: 8px 36px 36px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

@media (max-width: 720px) {
  .chrome-header {
    padding: 20px 20px;
  }
  .chrome-main {
    padding: 8px 20px 20px;
  }
}
</style>
