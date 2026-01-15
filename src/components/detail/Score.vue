<script setup lang="ts">
import { inject, computed } from 'vue'

const props = defineProps<{
  songId: number
  selectLevel: number
}>()
const scores = inject('scores') as any
const score = computed(() => {
  return scores.value?.find((s: any) => s.song_no === props.songId && s.level === props.selectLevel)
})
</script>

<template>
  <div v-if="score" class="p-2 w-full grid grid-cols-2 gap-2 md:grid-cols-3">
    <div class="space-y-1 flex flex-col">
      <div class="bg-red-400 text-white rounded-lg overflow-hidden text-center flex-1 flex flex-col">
        <p class="p-1 bg-red-500 text-sm">历史最高得分</p>
        <div class="flex-1 flex flex-col justify-center items-center">
          <p class="text-border m-auto text-white font-bold text-3xl tracking-widest">{{ score?.high_score }}</p>
        </div>
      </div>
      <p class="text-xs opacity-50 text-center">{{ score?.highscore_datetime.replace(/\//g, '.') }}</p>
      <div class="grid grid-cols-2">
        <div class="flex">
          <img class="m-auto w-15" :src="`/img/score_badge/score_${score?.best_score_rank}.png`" alt=""></img>
        </div>
        <div class="flex">
          <img 
            v-if="score?.dondaful_combo_cnt > 0"
            class="m-auto w-15" 
            src="/img/crown/crown_rainbow.png" 
            alt=""
          />
          <img 
            v-else-if="score?.full_combo_cnt > 0"
            class="m-auto w-15" 
            src="/img/crown/crown_gold.png" 
            alt=""
          />
          <img 
            v-else-if="score?.clear_cnt > 0"
            class="m-auto w-15" 
            src="/img/crown/crown_silver.png" 
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="space-y-1 text-border text-white">
      <div class="flex justify-between items-center bg-gradient-to-r from-orange-400 to-gray-300 px-2 py-0.5 rounded-lg">
        <p class="text-border text-white">良</p>
        <p>{{ score?.good_cnt }}</p>
      </div>
      <div class="flex justify-between items-center bg-gradient-to-r from-gray-400 to-gray-300 px-2 py-0.5 rounded-lg">
        <p class="text-border text-white">可</p>
        <p>{{ score?.ok_cnt }}</p>
      </div>
      <div class="flex justify-between items-center bg-gradient-to-r from-blue-400 to-gray-300 px-2 py-0.5 rounded-lg">
        <p class="text-border text-white">不可</p>
        <p>{{ score?.ng_cnt }}</p>
      </div>
      <div class="flex justify-between items-center bg-gradient-to-r from-amber-400 to-gray-300 px-2 py-0.5 rounded-lg">
        <p class="text-border text-white">连打数</p>
        <p>{{ score?.pound_cnt }}</p>
      </div>
      <div class="flex justify-between items-center bg-gradient-to-r from-red-400 to-gray-300 px-2 py-0.5 rounded-lg">
        <p class="text-border text-white">最大连击数</p>
        <p>{{ score?.combo_cnt }}</p>
      </div>
    </div>
    <div class="space-y-1 text-border text-white col-span-2 md:col-span-1">
      <div class="flex justify-center items-center bg-gray-200 px-2 py-0.5 rounded-lg">
        <p>游玩统计</p>
      </div>
      <div class="grid grid-cols-2 gap-1 md:grid-cols-1">
        <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
          <p>游玩次数</p>
          <p>{{ score?.stage_cnt }}</p>
        </div>
        <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
          <p>通关次数</p>
          <p>{{ score?.clear_cnt }}</p>
        </div>
        <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
          <p>全连次数</p>
          <p>{{ score?.full_combo_cnt }}</p>
        </div>
        <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
          <p>全良连段次数</p>
          <p>{{ score?.dondaful_combo_cnt }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="m-auto flex flex-col items-center space-y-2 opacity-50">
    <img class="w-35" src="/img/sticker/sticker_2.png" alt="">
    <p>还没有该难度的游玩记录咚~</p>
  </div>
</template>