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
    <button @click="onGameEnd"><span>Закончить игру</span></button>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/counter'
import { computed, ref, watchEffect } from 'vue'

type Card = { id: string; image: string }
const currentTurn = ref<Card[]>([])
const lock = ref(false)
const cardsToShow = ref<Card[]>([])
const initCards = [
  { id: 1, image: '1' },
  { id: 2, image: '2' },
  { id: 3, image: '3' },
  //   { id: 4, image: '4' },
  //   { id: 5, image: '5' },
  //   { id: 6, image: '6' },
]

const store = useUiStore()
const onGameEnd = () => {
  resetGame()
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
      background: `url('/images/card-content-mock.png') center no-repeat`,
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

const resetGame = () => {
  store.showGameOver()
  currentTurn.value = []
  cardsToShow.value = []
}

watchEffect(() => {
  if (cardsToShow.value.length === 0 || cards.value.length === 0) return
  if (cardsToShow.value.length === cards.value.length) {
    setTimeout(() => {
      resetGame()
    }, 1500)
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
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, 702px);
  height: 1468px;
  gap: 64px;
}

button {
  position: relative;
  margin: 0 auto;
  padding: 24px 32px;
  background: url('/images/bg-game-over-red.png');
  background-position: 1% 16%;
  background-repeat: no-repeat;
  background-size: cover;
  font-size: 64px;
  color: white; /* optional: for contrast */
  border: none;
  overflow: hidden; /* ensures overlay doesn't spill out */

  &:active {
    &:before {
      background-color: #5b0d0eab; /* red overlay with 50% opacity */
    }
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(255, 0, 0, 0.349); /* red overlay with 50% opacity */
    z-index: 0;
  }
  > * {
    position: relative;
    z-index: 0;
  }
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
    border-radius: 60px;
    // box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transition: box-shadow 0.3s ease;
  }

  &-front {
    background-size: cover;

    background:
      url('/images/card-back.png') center no-repeat,
      linear-gradient(180deg, #d8ccbe 0%, #645a4e 100%);
    /* Or a back design */
  }

  &-back {
    transform: rotateY(180deg);
    background-size: cover;
    background-position: center;
  }
}

/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  width: 300px;
  height: 200px;
  border: 1px solid #f1f1f1;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
.flip-card-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
}
</style>
