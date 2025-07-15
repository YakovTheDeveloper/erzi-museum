<script setup lang="ts">
import Game from '@/views/ui/main/Game.vue';
import GameOver from '@/views/ui/main/GameOver.vue';
import Main from '@/views/ui/main/Main.vue';


</script>

<template>
  <main>
    <!-- <Main></Main> -->
    <Game></Game>
    <GameOver />
  </main>
</template>

<style scoped>
main {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>