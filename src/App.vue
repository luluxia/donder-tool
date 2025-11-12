<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { HelpCircle, LogIn, Drum } from 'lucide-vue-next'
import 'vue-sonner/style.css'
import { Toaster } from 'vue-sonner'
import { useRoute } from 'vue-router'
import Detail from './components/Detail.vue'
import BackToTop from './components/BackToTop.vue'

const route = useRoute()

const scrollContainer = ref()

const detailVisible = ref(false)
const detailSongId = ref()
const detailLevel = ref()

provide('detailVisible', detailVisible)
provide('detailSongId', detailSongId)
provide('detailLevel', detailLevel)
provide('scrollContainer', scrollContainer)

const songData = ref()
// const wikiData = ref()

const userId = ref()
provide('userId', userId)
const scores = ref([])

provide('songData', songData)
// provide('wikiData', wikiData)
provide('scores', scores)

onMounted(async () => {
  const songResponse = await fetch('/data/song.json')
  songData.value = await songResponse.json()

  // const wikiResponse = await fetch('/data/wiki.json')
  // wikiData.value = await wikiResponse.json()

  // const scoreResponse = await fetch('/songscore.json')
  // const scoreData = await scoreResponse.json()
  // scores.value = scoreData.scoreInfo

  localStorage.getItem('userId') && (userId.value = localStorage.getItem('userId') || '')
})
</script>

<template>
  <Toaster position="top-center" richColors />
  <!-- 背景 -->
  <div class="fixed w-screen h-screen -z-1">
    <img class="absolute w-full h-full object-cover" src="/img/bg.png" alt="" />
    <div class="absolute w-full h-50 bg-gradient-to-b from-amber-400 to-transparent"></div>
  </div>
  <!-- 内容 -->
  <div ref="scrollContainer" class="w-screen h-screen overflow-auto px-2 [scrollbar-gutter:stable_both-edges] md:px-6">
    <div class="w-full h-50 flex flex-col items-center mb-12">
      <div class="w-full max-w-screen-xl p-4 flex justify-between items-center">
        <div class="text-amber-800 flex space-x-2">
          <Drum class="w-6" />
          <p>Donder 查分器</p>
        </div>
        <div class="flex space-x-2">
          <div class="text-amber-800 p-2 rounded-full w-10 h-10 flex hover:bg-black/5">
            <HelpCircle class="m-auto" />
          </div>
        </div>
      </div>
      <div>
        <img class="w-80" src="/img/logo.png" alt="" />
      </div>
    </div>
    <div class="w-full max-w-screen-xl mx-auto my-8 flex flex-col items-center gap-8 text-dark">
      <div class="flex rounded-full bg-white/25 border-white border-2 ring-2 ring-amber-950">
        <router-link
          to="/search"
          class="rounded-full px-4 py-2 transition-colors"
          :class="{
            'bg-gradient-to-b from-amber-200 to-amber-400 text-border text-white': route.path === '/search'
          }"
        >
          曲目搜索
        </router-link>
        <router-link
          to="/score"
          class="rounded-full px-4 py-2 transition-colors"
          :class="{
            'bg-gradient-to-b from-amber-200 to-amber-400 text-border text-white': route.path === '/score'
          }"
        >
          成绩查询
        </router-link>
      </div>
    </div>
    <router-view />
  </div>
  <transition name="dialog-fade">
    <Detail
      v-if="detailVisible"
      v-model:visible="detailVisible"
      v-model:select-level="detailLevel"
      :song-id="detailSongId"
    />
  </transition>
  <BackToTop />
</template>

<style>
@font-face {
  font-family: ChillRoundF;
  src: url('/font/ChillRoundF.woff2') format('woff2');
}

html {
  scrollbar-width: thin;
}

body {
  font-family: ChillRoundF, sans-serif;
}

.text-border {
  text-shadow: -1px -1px 1px #451a03, 1px -1px 1px #451a03, -1px 1px 1px #451a03, 1px 1px 1px #451a03;
}

.dialog-fade-enter-active, .dialog-fade-leave-active {
  transition: opacity 0.2s;
}
.dialog-fade-enter-from, .dialog-fade-leave-to {
  opacity: 0;
}
.dialog-fade-enter-active .dialog-content, .dialog-fade-leave-active .dialog-content {
  transition: transform 0.2s;
}
.dialog-fade-enter-from .dialog-content, .dialog-fade-leave-to .dialog-content {
  transform: scale(0.5);
}
</style>