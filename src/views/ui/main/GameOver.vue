<template>
    <div :style="mainStyle" class="game-over-container">
        <div class="content" :style="contentStyle">
            <p class="fz-1">Отличная работа</p>
            <div class="content-again">
                <p class="fz-3">Повторить игру?</p>
                <div class="content-again-choice-actions">
                    <p class="fz-2" @click="onNo">Нет</p>
                    <p class="fz-2" @click="onYes">Да</p>
                </div>
            </div>
        </div>
    </div>,
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
const { isGameOver } = storeToRefs(useUiStore())
const store = useUiStore()
let contentAppearTimeout = null
const showContent = ref(false)

const onNo = () => { store.hideGameOver() }
const onYes = () => { store.hideGameOver() }

const mainStyle = computed(() => {
    return {
        background: `url('/images/animations/2/${1}.png'), url('/images/bg-game-over.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', // or custom sizes like '100% auto'
        transition: 'all 0.5s',
        opacity: isGameOver.value ? 100 : 0,
        zIndex: isGameOver.value ? 1 : -1
    }
})

const contentStyle = computed(() => ({
    opacity: showContent.value ? 100 : 0,
}))

watchEffect(() => {
    if (isGameOver.value) {
        contentAppearTimeout = setTimeout(() => showContent.value = true, 1000)
        return
    }
    contentAppearTimeout && clearTimeout(contentAppearTimeout)
    showContent.value = false

})


</script>

<style scoped>
.game-over-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 264px;
    transition: opacity 0.5s;
    opacity: 0;
}

.content-again {
    display: flex;
    flex-direction: column;
    gap: 120px;
    align-items: center;
}

.content-again-choice-actions {
    display: flex;
    justify-content: space-between;
    width: 1110px;
}

.fz-1 {
    font-size: 120px;
}

.fz-2 {
    font-size: 100px;
}

.fz-3 {
    font-size: 64px;
}
</style>