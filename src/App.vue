<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { HelpCircle, LogIn, Drum } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import Detail from './components/Detail.vue'

const route = useRoute()

const detailVisible = ref(false)
const detailSongId = ref()
const detailLevel = ref()

provide('detailVisible', detailVisible)
provide('detailSongId', detailSongId)
provide('detailLevel', detailLevel)

const cnData = ref()
const wikiData = ref()

provide('cnData', cnData)
provide('wikiData', wikiData)

onMounted(async () => {
  const cnResponse = await fetch('/data/cn.json')
  cnData.value = await cnResponse.json()

  const wikiResponse = await fetch('/data/wiki.json')
  wikiData.value = await wikiResponse.json()
})
</script>

<template>
  <!-- 背景 -->
  <div class="fixed w-screen h-screen -z-1">
    <img class="absolute w-full h-full object-cover" src="/img/bg.png" alt="" />
    <div class="absolute w-full h-50 bg-gradient-to-b from-amber-400 to-transparent"></div>
  </div>
  <!-- 内容 -->
  <div class="w-screen h-screen overflow-auto [scrollbar-gutter:stable_both-edges]">
    <div class="w-full h-50 flex flex-col items-center mb-12">
      <div class="w-screen-xl p-8 flex justify-between items-center">
        <div class="text-amber-800 flex space-x-2">
          <Drum class="w-6" />
          <p>Donder 查分器</p>
        </div>
        <div class="flex space-x-2">
          <div class="text-amber-800 p-2 rounded-full w-10 h-10 flex hover:bg-black/5">
            <HelpCircle class="m-auto" />
          </div>
          <div class="text-amber-800 p-2 rounded-full w-10 h-10 flex hover:bg-black/5">
            <LogIn class="m-auto" />
          </div>
        </div>
      </div>
      <div>
        <img class="w-80" src="/img/logo.png" alt="" />
      </div>
    </div>
    <div class="w-screen-xl mx-auto my-8 flex flex-col items-center gap-8 text-dark">
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