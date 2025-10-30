<script setup lang="ts">
import { HelpCircle, LogIn, Drum } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <img class="fixed w-screen h-screen object-cover -z-1" src="/img/bg.png" alt="">
  <div class="w-full h-50 bg-gradient-to-b from-amber-400 to-transparent flex flex-col items-center mb-12">
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
      <img class="w-80" src="/img/logo.png" alt="">
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
</template>

<style>
@font-face {
  font-family: ChillRoundF;
  src: url('/font/ChillRoundF.woff2') format('woff2');
}

body {
  font-family: ChillRoundF, sans-serif;
}

.text-border {
  text-shadow: -1px -1px 1px #451a03, 1px -1px 1px #451a03, -1px 1px 1px #451a03, 1px 1px 1px #451a03;
}
</style>