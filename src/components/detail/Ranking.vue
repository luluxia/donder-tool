<script setup lang="ts">
import { inject, computed, ref, watchEffect, type Ref } from 'vue'
import axios from 'axios'
import { Loader2 } from 'lucide-vue-next'

const DONDER_API = import.meta.env.VITE_DONDER_API

const props = defineProps<{
  songId: number
  selectLevel: number
}>()
const provinces = [
  { id: 0, name: '全部地区' },
  { id: 1, name: '北京' },
  { id: 2, name: '天津' },
  { id: 3, name: '河北' },
  { id: 4, name: '山西' },
  { id: 5, name: '内蒙古' },
  { id: 6, name: '辽宁' },
  { id: 7, name: '吉林' },
  { id: 8, name: '黑龙江' },
  { id: 9, name: '上海' },
  { id: 10, name: '江苏' },
  { id: 11, name: '浙江' },
  { id: 12, name: '安徽' },
  { id: 13, name: '福建' },
  { id: 14, name: '江西' },
  { id: 15, name: '山东' },
  { id: 16, name: '河南' },
  { id: 17, name: '湖北' },
  { id: 18, name: '湖南' },
  { id: 19, name: '广东' },
  { id: 20, name: '广西' },
  { id: 21, name: '海南' },
  { id: 22, name: '重庆' },
  { id: 23, name: '四川' },
  { id: 24, name: '贵州' },
  { id: 25, name: '云南' },
  { id: 26, name: '西藏' },
  { id: 27, name: '陕西' },
  { id: 28, name: '甘肃' },
  { id: 29, name: '青海' },
  { id: 30, name: '宁夏' },
  { id: 31, name: '新疆' },
]

const data = ref<any>(null)
const selectedProvince = ref(0)
const loading = ref(false)

watchEffect(async () => {
  if (!props.songId || !props.selectLevel) return
  loading.value = true
  const res = await axios.get(
    `${DONDER_API}/ranking/${props.songId}/${props.selectLevel}/${selectedProvince.value}`
  )
  loading.value = false
  if (res.data.success) {
    data.value = JSON.parse(res.data.data)
  } else {
    data.value = null
  }
})

const userId = inject<Ref<string>>('userId')
const userRankScore = computed(() => {
  if (!data.value || !userId) return null
  console.log('data value', data.value, 'userId', userId.value)
  return data.value.find((item: any) => item.gameCostume.userid === String(userId.value))
})
</script>

<template>
  <div class="p-2 space-y-2">
    <select
      class="w-full p-2 rounded-md bg-sky-400 text-white outline-none"
      v-model="selectedProvince"
    >
      <option v-for="province in provinces" :key="province.id" :value="province.id">
        {{ province.name }}
      </option>
    </select>
    <div v-if="loading" class="bg-sky-50 h-40 flex flex-col items-center justify-center space-y-2 rounded-md">
      <div>
        <Loader2 class="animate-spin text-sky-400 w-8 h-8" />
      </div>
      <p>加载中</p>
    </div>
    <div v-if="!loading && data.length" class="bg-sky-50 rounded-md overflow-hidden">
      <!-- 个人成绩 -->
      <div v-if="userRankScore" class="flex items-center space-x-2 p-2 border-b-2 bg-sky-100 border-sky-200">
        <div
          v-if="userRankScore"
          class="w-8 h-8 bg-sky-200 flex rounded-full"
          :class="{
            '!bg-amber-400': userRankScore.rank === 1,
            '!bg-gray-400': userRankScore.rank === 2,
            '!bg-orange-400': userRankScore.rank === 3,
          }"
        >
          <p class="m-auto" :class="userRankScore.rank <= 3 && 'text-border text-white'">{{ userRankScore.rank }}</p>
        </div>
        <div v-else class="w-8 h-8 bg-sky-200 flex rounded-full">
          <p class="m-auto">-</p>
        </div>
        <p class="flex-1">
          {{ userRankScore.gameCostume.mydon_name }}
        </p>
        <p>{{ userRankScore.province_name }}</p>
        <div class="text-border text-white text-xl w-23 text-center">
          {{ userRankScore.score }}
        </div>
      </div>
      <!-- 排行榜成绩 -->
      <div v-for="item in data" class="flex items-center space-x-2 p-2 odd-of-type:bg-sky-100">
        <div
          class="w-8 h-8 bg-sky-200 flex rounded-full"
          :class="{
            '!bg-amber-400': item.rank === 1,
            '!bg-gray-400': item.rank === 2,
            '!bg-orange-400': item.rank === 3,
          }"
        >
          <p class="m-auto" :class="item.rank <= 3 && 'text-border text-white'">{{ item.rank }}</p>
        </div>
        <p class="flex-1">{{ item.gameCostume.mydon_name }}</p>
        <p>{{ item.province_name }}</p>
        <p class="text-border text-white text-xl w-23 text-center">{{ item.score }}</p>
      </div>
    </div>
  </div>
</template>