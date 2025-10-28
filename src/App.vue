<script setup lang="ts">
import { songs } from './data'
</script>

<template>
  <img class="fixed w-screen h-screen object-cover -z-1" src="/img/bg.png" alt="">
  <div class="w-full h-50 bg-gradient-to-b from-amber-400 to-transparent flex flex-col items-center">
    <div class="w-screen-xl p-8">
      <p>Taiko Score</p>
    </div>
    <div>
      <img class="w-80" src="/img/logo.png" alt="">
    </div>
  </div>
  <div class="w-screen-xl mx-auto my-8 flex flex-col items-center gap-8 text-dark">
    <div class="flex rounded-full bg-white/25 border-white border-2 ring-2 ring-amber-950 font-bold">
      <p class="bg-gradient-to-b from-amber-200 to-amber-400 rounded-full px-4 py-2">全部曲目</p>
      <p class="rounded-full px-4 py-2">成绩查询</p>
    </div>
    <input
      type="text"
      placeholder="请输入歌曲名称、作曲家，或者别名咚~"
      class="w-full p-4 bg-white/25 rounded-xl border-white border-2 ring-2 ring-amber-950 focus:(outline-none bg-white/50)"
    >
    <div class="bg-white w-full rounded-xl border-white border-2 ring-2 ring-amber-950 overflow-hidden">
      <p class="font-bold p-4 bg-gray-200">筛选与排序</p>
      <div>
        <p class="font-bold">筛选</p>
      </div>
    </div>
    <div class="w-full">
      <div
        v-for="song in songs.slice(0, 10)"
        :key="song.id"
        class="p-4 rounded-xl flex justify-between items-center hover:(bg-black/5)"
      >
        <div class="flex items-center space-x-2">
          <p class="text-sm px-2 py-1 rounded-full bg-blue-500 text-white text-shadow font-bold border-2 border-white">
            {{ song.type }}
          </p>
          <div>
            <p class="font-bold">{{ song.song_name }}</p>
            <p v-if="song.subtitle" class="text-sm text-gray-500">{{ song.subtitle }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <div
            v-for="i in 5"
            class="relative w-15 h-10 rounded-lg border-2 border-white"
            :class="{
              'bg-red-300': i === 1,
              'bg-lime-300': i === 2,
              'bg-blue-300': i === 3,
              'bg-pink-300': i === 4,
              'bg-purple-300': i === 5,
            }"
          >
            <div class="absolute w-full h-full bg-gradient-to-b from-white/50 to-transparent"></div>
            <div class="relative w-full h-full flex items-center justify-center space-x-1">
              <img class="w-6" :src="`/img/level_${i}.png`" alt="">
              <p class="text-white font-bold text-xl text-border">{{ song[`level_${i}`] || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.text-border {
  text-shadow: -1px -1px 1px #451a03, 1px -1px 1px #451a03, -1px 1px 1px #451a03, 1px 1px 1px #451a03;
}
</style>