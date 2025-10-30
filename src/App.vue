<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Info, ChevronDown, ChevronUp, HelpCircle, LogIn, Drum } from 'lucide-vue-next'
import { songs } from './data'
const types = ['全部', '流行', '动漫', '游戏', '古典', '儿童', '博歌乐', '综合', '南梦宫原创']
const selectedType = ref('全部')
const tags = ['魔王里', '双打', '华语']
const selectedTags = ref<string[]>([])
const sorts = ['默认', '简单', '一般', '困难', '魔王', '魔王里']
const selectedSort = ref('默认')
const searchQuery = ref('')

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const filteredSongs = computed(() => {
  let filtered = songs

  // 搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(song =>
      song.song_name.toLowerCase().includes(query) ||
      (song.subtitle && typeof song.subtitle === 'string' && song.subtitle.toLowerCase().includes(query)) ||
      song.song_name_jp.toLowerCase().includes(query)
    )
  }

  // 类型筛选
  if (selectedType.value !== '全部') {
    filtered = filtered.filter(song => song.type === `${selectedType.value}音乐`)
  }

  // 标签筛选
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(song => {
      const hasMaouRi = selectedTags.value.includes('魔王里') && song.level_5 && song.level_5 !== '-'
      const hasDouble = selectedTags.value.includes('双打') && song.song_name.includes('【双打】')
      const hasChinese = selectedTags.value.includes('华语') && (
        song.song_name.match(/[\u4e00-\u9fa5]/) ||
        (song.subtitle && typeof song.subtitle === 'string' && song.subtitle.match(/[\u4e00-\u9fa5]/))
      )
      return hasMaouRi || hasDouble || hasChinese
    })
  }

  // 排序
  const sortKey = selectedSort.value
  if (sortKey === '默认') {
    filtered = [...filtered].sort((a, b) => a.sort - b.sort)
  } else if (sortKey === '简单') {
    filtered = [...filtered].sort((a, b) => parseInt(String(a.level_1)) - parseInt(String(b.level_1)))
  } else if (sortKey === '一般') {
    filtered = [...filtered].sort((a, b) => parseInt(String(a.level_2)) - parseInt(String(b.level_2)))
  } else if (sortKey === '困难') {
    filtered = [...filtered].sort((a, b) => parseInt(String(a.level_3)) - parseInt(String(b.level_3)))
  } else if (sortKey === '魔王') {
    filtered = [...filtered].sort((a, b) => parseInt(String(a.level_4)) - parseInt(String(b.level_4)))
  } else if (sortKey === '魔王里') {
    filtered = [...filtered].sort((a, b) => {
      const aLevel = a.level_5 && a.level_5 !== '-' ? parseInt(String(a.level_5)) : parseInt(String(a.level_4))
      const bLevel = b.level_5 && b.level_5 !== '-' ? parseInt(String(b.level_5)) : parseInt(String(b.level_4))
      return aLevel - bLevel
    })
  }

  return filtered
})
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
      <p class="bg-gradient-to-b from-amber-200 to-amber-400 rounded-full px-4 py-2 text-border text-white">曲目搜索</p>
      <p class="rounded-full px-4 py-2">成绩查询</p>
    </div>
    <div class="bg-white/50 w-full rounded-xl p-4 border-white border-2 ring-2 ring-amber-950 space-y-4">
      <!-- 搜索 -->
      <div class="flex items-center">
        <Search class="absolute ml-4" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="请输入歌曲名称、作曲家，或者别名咚~"
          class="w-full pl-12 p-4 bg-white rounded-xl border-white border-2 ring-2 ring-amber-950 outline-none"
        >
      </div>
      <!-- 筛选与排序 -->
      <div class="space-y-2">
        <div class="flex items-center">
          <p class="w-15">分类</p>
          <div class="flex space-x-2">
            <p
              v-for="type in types" :key="type"
              @click="selectedType = type"
              class="text-amber-950 px-2 py-0.5 rounded cursor-pointer hover:bg-amber-400/50"
              :class="{ 'text-border !bg-amber-400 text-white': selectedType === type }"
            >
              {{ type }}
            </p>
          </div>
        </div>
        <div class="flex items-center">
          <p class="w-15">标签</p>
          <div class="flex space-x-2">
            <p
              v-for="tag in tags" :key="tag"
              @click="toggleTag(tag)"
              class="text-amber-950 px-2 py-0.5 rounded cursor-pointer hover:bg-amber-400/50"
              :class="{ 'text-border !bg-amber-400 text-white': selectedTags.includes(tag) }"
            >
              {{ tag }}
            </p>
          </div>
        </div>
        <div class="flex items-center">
          <p class="w-15">排序</p>
          <div class="flex space-x-2">
            <div
              v-for="(sort, index) in sorts" :key="sort"
              @click="selectedSort = sort"
              class="text-amber-950 px-2 py-0.5 rounded cursor-pointer flex items-center hover:bg-amber-400/50"
              :class="{ 'text-border !bg-amber-400 text-white': selectedSort === sort }"
            >
              <p>{{ sort }}</p>
              <ChevronDown v-if="index" class="w-5 !text-amber-950 opacity-50" />
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-blue-200 rounded-full px-4 py-2 text-sm shadow flex items-center space-x-2">
      <Info class="w-5" />
      <p>查找到 {{ filteredSongs.length }} 条数据</p>
    </div>
    <div class="w-full">
      <div
        v-for="song in filteredSongs"
        :key="song.id"
        class="p-4 rounded-xl flex justify-between items-center [content-visibility:auto] hover:(bg-black/5)"
      >
        <div class="flex items-center space-x-2">
          <p class="text-sm px-2 py-1 rounded-full bg-blue-500 text-white text-shadow border-2 border-white">
            {{ song.type }}
          </p>
          <div>
            <p>{{ song.song_name }}</p>
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
              <p class="text-white font-bold text-xl text-border">{{ (song as any)[`level_${i}`] || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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