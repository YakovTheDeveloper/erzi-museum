<template>
    <div class="container">
        <p :style="{ fontSize: '100px', textAlign: 'center' }">Найдите все парные карточки</p>
        <div class="cards">

        </div>
        <button @click="onGameEnd">
            Закончить игру
        </button>
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/counter';

const store = useUiStore()
const onGameEnd = () => {
    store.showGameOver()
}
</script>

<style scoped>
.container {
    height: 100%;
    padding: 120px 182px;
    background: url('/images/bg-game.png');
    background-repeat: 'no-repeat';
    background-size: 'cover';

    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

.cards {
    display: grid;
    grid-template-columns: repeat(1fr, 6);
    grid-template-rows: repeat(1fr, 702px);
    height: 1468px;
    gap: 64px;
}

.card {
    height: 100%;
    background-color: #fff;
    border-radius: 60px;
}

button {
    margin: 0 auto;
    padding: 24px 32px;
    background: url('/images/bg-game-over-red.png');
    background-position: 1% 16%;
    /* background-color: #FF0004; */
    background-repeat: 'no-repeat';
    background-size: 'cover';
    font-size: 64px;
}
</style>