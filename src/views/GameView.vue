<template>
  <div class="game">
    <div class="container p-8">
      <div class="card mw-480">
        <div class="card-body plr-32 ptb-12">
          <div class="card-header pb-12">
            New game
          </div>
          <div class="info-card">
            <div class="p-8">Identify as many pokemon silhouttes as you can in <strong>60 seconds</strong></div>
            <div class="p-8">Get <strong>+2 seconds</strong> for each correct answer</div>
            <div class="p-8">Click <strong>pass</strong> if you don't know the answer</div>
          </div>
          <div class="p-12">
            Ready?
          </div>
          <div class="p-12">
            <button class="button text-20 text-bold">
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import http from '@/http'

export default {
  name: 'LoginView',
  data: () => {
    return {}
  }
}
</script>
