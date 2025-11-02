<script setup lang="ts">
import { ref, computed, inject, type Ref } from 'vue'
import { Search, Info, ChevronDown, ChevronUp } from 'lucide-vue-next'

const songs = inject('cnData') as any

const types = ['全部', '流行', '动漫', '游戏', '古典', '儿童', '博歌乐', '综合', '南梦宫原创']
const selectedType = ref('全部')
const tags = ['魔王里', '双打', '华语', '谱面分歧']
const selectedTags = ref<string[]>([])
const sorts = ['默认', '简单', '一般', '困难', '魔王', '魔王里']
const selectedSort = ref('默认')
const sortDirection = ref<'asc' | 'desc'>('desc')
const searchQuery = ref('')

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const selectSort = (sort: string) => {
  if (sort === '默认') {
    selectedSort.value = '默认'
    return
  }
  if (selectedSort.value === sort) {
    // 切换顺序
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    selectedSort.value = sort
    sortDirection.value = 'desc' // 默认降序
  }
}

const filteredSongs = computed(() => {
  let filtered = songs.value || []

  // 搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((song: any) =>
      song.song_name.toLowerCase().includes(query) ||
      (song.subtitle && typeof song.subtitle === 'string' && song.subtitle.toLowerCase().includes(query)) ||
      song.song_name_jp.toLowerCase().includes(query)
    )
  }

  // 类型筛选
  if (selectedType.value !== '全部') {
    filtered = filtered.filter((song: any) => song.type === `${selectedType.value}音乐`)
  }

  // 标签筛选
  // if (selectedTags.value.length > 0) {
  //   filtered = filtered.filter(song => {
  //     const hasMaouRi = selectedTags.value.includes('魔王里') && song.level_5 && song.level_5 !== '-'
  //     const hasDouble = selectedTags.value.includes('双打') && song.song_name.includes('【双打】')
  //     const hasChinese = selectedTags.value.includes('华语') && (
  //       song.song_name.match(/[\u4e00-\u9fa5]/) ||
  //       (song.subtitle && typeof song.subtitle === 'string' && song.subtitle.match(/[\u4e00-\u9fa5]/))
  //     )
  //     return hasMaouRi || hasDouble || hasChinese
  //   })
  // }

  // 排序
  const sortKey = selectedSort.value
  const multiplier = sortDirection.value === 'asc' ? 1 : -1
  if (sortKey === '简单') {
    filtered = [...filtered].sort((a, b) => multiplier * (parseInt(String(a.level_1)) - parseInt(String(b.level_1))))
  } else if (sortKey === '一般') {
    filtered = [...filtered].sort((a, b) => multiplier * (parseInt(String(a.level_2)) - parseInt(String(b.level_2))))
  } else if (sortKey === '困难') {
    filtered = [...filtered].sort((a, b) => multiplier * (parseInt(String(a.level_3)) - parseInt(String(b.level_3))))
  } else if (sortKey === '魔王') {
    filtered = [...filtered].sort((a, b) => multiplier * (parseInt(String(a.level_4)) - parseInt(String(b.level_4))))
  } else if (sortKey === '魔王里') {
    filtered = [...filtered].sort((a, b) => {
      const aLevel = a.level_5 && a.level_5 !== '-' ? parseInt(String(a.level_5)) : parseInt(String(a.level_4))
      const bLevel = b.level_5 && b.level_5 !== '-' ? parseInt(String(b.level_5)) : parseInt(String(b.level_4))
      return multiplier * (aLevel - bLevel)
    })
  }

  return filtered
})

const detailVisible = inject<Ref<boolean>>('detailVisible')
const detailSongId = inject<Ref<number | undefined>>('detailSongId')
const detailLevel = inject<Ref<number | undefined>>('detailLevel')

const handleOpenDetail = (songId: number, level: number) => {
  if (detailVisible && detailSongId && detailLevel) {
    detailSongId.value = songId
    detailLevel.value = level
    detailVisible.value = true
  }
}
</script>

<template>
  <div class="w-screen-xl mx-auto my-8 flex flex-col items-center gap-8 text-dark">
    <div class="bg-white/50 w-full rounded-xl p-4 border-white border-2 ring-2 ring-amber-950 space-y-4">
      <!-- 搜索 -->
      <div class="relative flex items-center">
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
              class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-amber-400/50"
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
              class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-amber-400/50"
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
              @click="selectSort(sort)"
              class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center hover:bg-amber-400/50"
              :class="{ 'text-border !bg-amber-400 text-white': selectedSort === sort }"
            >
              <p>{{ sort }}</p>
              <ChevronDown v-if="index > 0 && selectedSort === sort && sortDirection === 'desc'" class="w-5 !text-amber-950 opacity-50" />
              <ChevronUp v-else-if="index > 0 && selectedSort === sort && sortDirection === 'asc'" class="w-5 !text-amber-950 opacity-50" />
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
        @click="handleOpenDetail(song.id, song.level_5 && song.level_5 !== '-' ? 5 : 4)"
        :key="song.sort"
        class="p-4 rounded-xl flex justify-between items-center [content-visibility:auto] transition-colors hover:(bg-black/5)"
      >
        <div class="flex items-center space-x-2">
          <p
            class="text-sm px-2 py-1 rounded-full text-white text-shadow border-2 border-white"
            :class="{
              'bg-blue-500' : song.type === '流行音乐',
              'bg-pink-500' : song.type === '动漫音乐',
              'bg-purple-500' : song.type === '游戏音乐',
              'bg-amber-500' : song.type === '古典音乐',
              'bg-yellow-500' : song.type === '儿童音乐',
              'bg-gray-500' : song.type === '博歌乐音乐',
              'bg-green-500' : song.type === '综合音乐',
              'bg-red-500' : song.type === '南梦宫原创音乐',
            }"
          >
            {{ song.type }}
          </p>
          <div>
            <p class="text-xl">{{ song.song_name }}</p>
            <p v-if="song.subtitle" class="text-sm text-gray-500">{{ song.subtitle }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <div
            v-for="i in 5"
            @click.stop="handleOpenDetail(song.id, i)"
            class="relative w-15 h-10 rounded-lg border-2 border-white overflow-hidden"
            :class="{
              'bg-red-300': i === 1,
              'bg-lime-300': i === 2,
              'bg-blue-300': i === 3,
              'bg-pink-300': i === 4,
              'bg-purple-300': i === 5,
              'cursor-pointer transition-all hover:(ring-2 ring-amber-950)': (song[`level_${i}`] && song[`level_${i}`] !== '-')
            }"
          >
            <div class="absolute w-full h-full bg-gradient-to-b from-white/50 to-transparent"></div>
            <div class="relative w-full h-full flex items-center justify-center space-x-1">
              <img class="w-6" :src="`/img/level/level_${i}.png`" alt="">
              <p class="text-white font-bold text-xl text-border">{{ (song as any)[`level_${i}`] || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>