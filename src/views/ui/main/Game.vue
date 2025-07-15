<template>
    <div class="container">
        <p :style="{ fontSize: '100px', textAlign: 'center' }">Найдите все парные карточки</p>
        <div class="cards">
            <div class="card" :key="card.id" v-for="card in cards" @click="onCardClick(card)">
                <div class="card-inner" :class="{ flipped: isCardOpened(card.id) }">
                    <div class="card-front"></div>
                    <div class="card-back" :style="getOpenedCardStyle(card.id, card.image)"></div>
                </div>
            </div>
        </div>
        <button @click="onGameEnd">
            Закончить игру
        </button>
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/counter';
import { computed, ref, watchEffect } from 'vue';


type Card = { id: string; image: string }
const currentTurn = ref<Card[]>([])
const lock = ref(false)
const cardsToShow = ref<Card[]>([])
const initCards = [
    { id: 0, image: '1' },
    { id: 1, image: '2' },
    { id: 2, image: '3' },
    { id: 3, image: '4' },
    { id: 4, image: '5' },
    { id: 5, image: '6' },
    { id: 6, image: '6' },
    { id: 7, image: '5' },
    { id: 8, image: '4' },
    { id: 9, image: '3' },
    { id: 10, image: '2' },
    { id: 11, image: '1' },
]

const store = useUiStore()
const onGameEnd = () => {
    store.showGameOver()
}

const cards = computed(() => {
    const doubled = initCards.flatMap((el, idx) => [
        { id: `${idx * 2 + 1}`, image: el.image },
        { id: `${idx * 2 + 2}`, image: el.image },
    ])
    const shuffled = [...doubled].sort(() => Math.random() - 0.5)
    return shuffled
})

const isCardOpened = (id: string) => {
    return cardsToShow.value.some((card) => card.id === id)
}

const getOpenedCardStyle = (id: string, image: string) => {
    if (cardsToShow.value.some((card) => card.id === id)) {
        return {
            background: `url('') center no-repeat`,
            // background: `url(${getServerImageUrl(image)}) center no-repeat`,
        }
    }
    return {}
}



const onCardClick = (card: Card) => {
    if (lock.value) return // Ignore if locked (checking cards)
    if (currentTurn.value.length >= 2) return // Prevent flipping more than two cards at once
    if (cardsToShow.value.some((shownCard) => shownCard.id === card.id)) return // Ignore clicking already flipped card

    currentTurn.value = [...currentTurn.value, card]
    cardsToShow.value = [...cardsToShow.value, card]
}

watchEffect(() => {
    if (currentTurn.value.length === 2) {
        lock.value = true // immediately lock

        if (currentTurn.value[0].image === currentTurn.value[1].image) {
            // matched cards stay opened
            currentTurn.value = []
            lock.value = false
            return
        }

        // unmatched, flip back after timeout
        setTimeout(() => {
            cardsToShow.value = cardsToShow.value.filter(
                (card) => !currentTurn.value.some((turn) => turn.id === card.id),
            )
            currentTurn.value = []
            lock.value = false
        }, 1750)
    }
})


watchEffect(() => {
    console.log(`output->cardsToShow.value`, cardsToShow.value)
    console.log(`output->cards.value.length`, cards.value.length)
    if (cardsToShow.value.length === 0 || cards.value.length === 0) return
    if (cardsToShow.value.length === cards.value.length) {
        setTimeout(() => {
            store.showGameOver()
        }, 1000)
    }
})

</script>

<style scoped lang="scss">
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

.card {
    border-radius: 60px;
    overflow: hidden;
    perspective: 1000px;
    transform-style: preserve-3d;

    &-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        will-change: transform;

        &.flipped {
            transform: rotateY(180deg);
        }
    }

    &-front,
    &-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border: 1px solid #ccc;
        border-radius: 60px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        transition: box-shadow 0.3s ease;
    }

    &-front {
        background: url('/images/games/memory/card.png') center no-repeat;
        background-size: cover;
        /* Or a back design */
    }

    &-back {
        transform: rotateY(180deg);
        background-size: cover;
        background-position: center;
    }
}
</style>