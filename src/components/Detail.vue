<script setup lang="ts">
import { onMounted, ref, inject, watchEffect, version } from 'vue'

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

watchEffect(() => {
  const cn = cnData.value?.find((item: any) => item.id === props.songId)
  const wiki = wikiData.value?.find((item: any) => Number(item.songNo) === props.songId)

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
            <div class="p-2 grid grid-cols-3">
              <div class="space-y-2">
                <div class="bg-red-400 text-white rounded-lg overflow-hidden text-center">
                  <p class="p-1 bg-red-500 text-sm">历史最高得分</p>
                  <p class="text-xl p-2">900000</p>
                </div>
                <div class="grid grid-cols-2">
                  <div class="flex">
                    <img class="m-auto w-15" src="/img/score_badge/score_7.png" alt=""></img>
                  </div>
                  <div class="flex">
                    <img class="m-auto w-15" src="/img/crown/crown_gold.png" alt=""></img>
                  </div>
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