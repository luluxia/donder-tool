<script setup lang="ts">
import { ref } from 'vue'
import { Search, Info, ChevronDown, ChevronUp } from 'lucide-vue-next'

const types = ['全部', '流行', '动漫', '游戏', '古典', '儿童', '博歌乐', '综合', '南梦宫原创']
const selectedType = ref('全部')
const tags = ['魔王里', '双打', '华语']
const selectedTags = ref<string[]>([])
const crowns = ['银冠（通关）', '金冠（全连）', '彩冠（全良连段）']
const selectedCrown = ref('')
const levels = ['白粹', '铜粹', '银粹', '金雅', '粉雅', '紫雅', '极']
const selectedLevel = ref('')
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
</script>

<template>
  <div class="w-screen-xl mx-auto my-8 flex flex-col items-center gap-8 text-dark">
    <div class="bg-white/50 w-full rounded-xl p-4 border-white border-2 ring-2 ring-amber-950 flex justify-between items-center">
      <p>同步时间：2025.03.15 10:00</p>
      <p class="bg-gradient-to-b from-amber-200 to-amber-400 text-border text-white w-max p-2 rounded ring-2 ring-amber-950">同步成绩</p>
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
          <p class="w-15">皇冠</p>
          <div class="flex space-x-2">
            <p
              v-for="crown in crowns" :key="crown"
              @click="selectedCrown = crown"
              class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-amber-400/50"
              :class="{ 'text-border !bg-amber-400 text-white': selectedCrown === crown }"
            >
              {{ crown }}
            </p>
          </div>
        </div>
        <div class="flex items-center">
          <p class="w-15">等级</p>
          <div class="flex space-x-2">
            <p
              v-for="level in levels" :key="level"
              @click="selectedLevel = level"
              class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-amber-400/50"
              :class="{ 'text-border !bg-amber-400 text-white': selectedLevel === level }"
            >
              {{ level }}
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
  </div>
</template>