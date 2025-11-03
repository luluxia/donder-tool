<script setup lang="ts">
import { onMounted, ref, inject, watchEffect } from 'vue'

const emit = defineEmits(['update:visible', 'update:select-level'])

const dialogRef = ref<HTMLDialogElement>()

onMounted(() => {
  dialogRef.value?.show()
})

const closeDialog = () => {
  emit('update:visible', false)
}

const props = defineProps<{
  songId: number
  selectLevel: number
}>()

const data = ref()

const cnData = inject('cnData') as any
const wikiData = inject('wikiData') as any
const scores = inject('scores') as any

watchEffect(() => {
  const cn = cnData.value?.find((item: any) => item.id === props.songId)
  const wiki = wikiData.value?.find((item: any) => Number(item.songNo) === props.songId)

  const score = scores.value?.find((s: any) => s.song_no === props.songId && s.level === props.selectLevel)

  data.value = {
    type: cn?.type || '',
    title: cn?.song_name || '',
    titleJp: cn?.song_name_jp || '',
    subtitle: cn?.subtitle || '',
    openDay: (() => {
      const dateStr = cn?.open_day || '';
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
      }
      return '';
    })(),
    bpm: (() => {
      if (wiki?.bpm.min === wiki?.bpm.max) {
        return wiki?.bpm.min || ''
      } else {
        return `${wiki?.bpm.min || ''} - ${wiki?.bpm.max || ''}`
      }
    })(),
    artists: wiki?.artists.join(' / ') || '',
    version: wiki?.version.join(' / ') || '',
    levels: Object.values(wiki?.courses || {}).filter(Boolean).map((course: any, index) => ({
      index: index + 1,
      level: course?.level,
      images: course?.images,
    })),
    scoreData: score || null,
  }
})

const handleLevelChange = (newLevel: number) => {
  emit('update:select-level', newLevel)
}
</script>

<template>
  <dialog ref="dialogRef" @click="closeDialog" class="fixed w-screen h-screen top-0 bg-black/50 flex">
    <div @click.stop class="dialog-content bg-white rounded-xl m-auto shadow-xl w-200 h-[calc(100vh-4rem)] flex overflow-hidden">
      <div v-if="data" class="space-y-4 flex-1 overflow-y-auto p-8">
        <!-- 歌曲ID -->
        <p class="text-gray text-sm">#{{ props.songId }}</p>
        <!-- 标题 -->
        <div class="flex items-center space-x-2">
          <p class="text-sm px-2 py-1 rounded-full text-white text-shadow border-2 border-white bg-blue-500">
            {{ data.type }}
          </p>
          <div>
            <p class="text-xl">{{ data.title }}</p>
            <p v-if="data.subtitle" class="text-sm text-gray-500">{{ data.subtitle }}</p>
          </div>
        </div>
        <!-- 信息 -->
        <div class="space-y-1">
          <div class="flex items-center space-x-2 text-sm">
            <p class="text-gray-500">上线日期</p>
            <p class="flex-1 min-w-0">{{ data.openDay }}</p>
          </div>
          <div class="flex items-center space-x-2 text-sm">
            <p class="text-gray-500">日文标题</p>
            <p class="flex-1 min-w-0">{{ data.titleJp }}</p>
          </div>
          <div class="flex items-center space-x-2 text-sm">
            <p class="text-gray-500">作曲家</p>
            <p class="flex-1 min-w-0">{{ data.artists }}</p>
          </div>
          <div class="flex items-center space-x-2 text-sm">
            <p class="text-gray-500">收录版本</p>
            <p class="flex-1 min-w-0">{{ data.version }}</p>
          </div>
          <div class="flex items-center space-x-2 text-sm">
            <p class="text-gray-500">BPM</p>
            <p class="flex-1 min-w-0">{{ data.bpm }}</p>
          </div>
          <!-- <div class="flex items-center space-x-2 text-sm">
            <p class="text-gray-500">别名</p>
            <p class="flex-1 min-w-0">别名1 / 别名2 / 别名3 / 别名1 / 别名2 / 别名3/ 别名1 / 别名2 / 别名3 / 别名1 / 别名2 / 别名3</p>
          </div>
          <div class="flex items-center space-x-2 text-sm">
            <p class="text-gray-500">标签</p>
            <p class="flex-1 min-w-0">别名1 / 别名2 / 别名3 / 别名1 / 别名2 / 别名3/ 别名1 / 别名2 / 别名3 / 别名1 / 别名2 / 别名3</p>
          </div> -->
        </div>
        <!-- 谱面预览 -->
        <div>
          <div class="flex items-end space-x-1 h-10">
            <div
              v-for="level in data.levels"
              @click="handleLevelChange(level.index)"
              class="relative w-15 rounded-t-lg border-2 border-b-none border-amber-950 overflow-hidden transition-all cursor-pointer hover:opacity-100"
              :class="{
                'bg-red-300': level.index === 1,
                'bg-lime-300': level.index === 2,
                'bg-blue-300': level.index === 3,
                'bg-pink-300': level.index === 4,
                'bg-purple-300': level.index === 5,
                'h-10 opacity-100': selectLevel === level.index,
                'h-8 opacity-50': selectLevel !== level.index,
              }"
            >
              <div class="absolute w-full h-full bg-gradient-to-b from-white/50 to-transparent"></div>
              <div class="relative w-full h-full flex items-center justify-center space-x-1">
                <img class="w-6" :src="`/img/level/level_${level.index}.png`" alt="">
                <p class="text-white font-bold text-xl text-border">{{ level.level }}</p>
              </div>
            </div>
          </div>
          <div class="w-full min-h-50 border-2 border-amber-950 rounded-lg rounded-tl-none overflow-hidden">
            <div v-if="data.scoreData" class="p-2 grid grid-cols-3 gap-2">
              <div class="space-y-1 flex flex-col">
                <div class="bg-red-400 text-white rounded-lg overflow-hidden text-center flex-1 flex flex-col">
                  <p class="p-1 bg-red-500 text-sm">历史最高得分</p>
                  <div class="flex-1 flex flex-col justify-center items-center">
                    <p class="text-border m-auto text-white font-bold text-3xl tracking-widest">{{ data.scoreData?.high_score }}</p>
                  </div>
                </div>
                <p class="text-xs opacity-50 text-center">{{ data.scoreData?.highscore_datetime }}</p>
                <div class="grid grid-cols-2">
                  <div class="flex">
                    <img class="m-auto w-15" :src="`/img/score_badge/score_${data.scoreData?.best_score_rank}.png`" alt=""></img>
                  </div>
                  <div class="flex">
                    <img class="m-auto w-15" :src="`/img/crown/crown_${data.scoreData?.full_combo_cnt > 0 ? 'gold' : 'silver'}.png`" alt=""></img>
                  </div>
                </div>
              </div>
              <div class="space-y-1 text-border text-white">
                <div class="flex justify-between items-center bg-gradient-to-r from-orange-400 to-gray-300 px-2 py-0.5 rounded-lg">
                  <p class="text-border text-white">良</p>
                  <p>{{ data.scoreData?.good_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gradient-to-r from-gray-400 to-gray-300 px-2 py-0.5 rounded-lg">
                  <p class="text-border text-white">可</p>
                  <p>{{ data.scoreData?.ok_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gradient-to-r from-blue-400 to-gray-300 px-2 py-0.5 rounded-lg">
                  <p class="text-border text-white">不可</p>
                  <p>{{ data.scoreData?.ng_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gradient-to-r from-amber-400 to-gray-300 px-2 py-0.5 rounded-lg">
                  <p class="text-border text-white">连打数</p>
                  <p>{{ data.scoreData?.pound_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gradient-to-r from-red-400 to-gray-300 px-2 py-0.5 rounded-lg">
                  <p class="text-border text-white">最大连击数</p>
                  <p>{{ data.scoreData?.combo_cnt }}</p>
                </div>
              </div>
              <div class="space-y-1 text-border text-white">
                <div class="flex justify-center items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                  <p>游玩统计</p>
                </div>
                <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                  <p>游玩次数</p>
                  <p>{{ data.scoreData?.stage_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                  <p>通关次数</p>
                  <p>{{ data.scoreData?.clear_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                  <p>全连次数</p>
                  <p>{{ data.scoreData?.full_combo_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                  <p>全良连段次数</p>
                  <p>{{ data.scoreData?.dondaful_combo_cnt }}</p>
                </div>
              </div>
            </div>
            <img v-for="image in data.levels[selectLevel - 1]?.images" :src="image" :key="image" alt="">
          </div>
        </div>
        <p class="bg-gradient-to-b from-amber-200 to-amber-400 text-border text-white w-max p-2 rounded ring-2 ring-amber-950">
          编辑信息
        </p>
      </div>
    </div>
  </dialog>
</template>

<style>
dialog::backdrop {
  display: none;
}
</style>