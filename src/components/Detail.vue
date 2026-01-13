<script setup lang="ts">
import { onMounted, ref, inject, watchEffect } from 'vue'
import { X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import Button from './Button.vue'

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

const songData = inject('songData') as any
// const wikiData = inject('wikiData') as any
const scores = inject('scores') as any

watchEffect(() => {
  const cn = songData.value?.find((item: any) => item.id === props.songId)
  // const wiki = wikiData.value?.find((item: any) => Number(item.songNo) === props.songId)

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
    score,
    levels: (() => {
      if (cn?.level_5 === '-') {
        return [cn?.level_1, cn?.level_2, cn?.level_3, cn?.level_4];
      } else {
        return [cn?.level_1, cn?.level_2, cn?.level_3, cn?.level_4, cn?.level_5];
      }
    })(),
  }

})

const handleLevelChange = (newLevel: number) => {
  emit('update:select-level', newLevel)
}

// 复制标题
const copyTitle = () => {
  if (data.value?.title) {
    navigator.clipboard.writeText(data.value.title)
    toast.success('已复制歌曲标题到剪贴板咚~')
  }
}

const jumpToWiki = () => {
  const wikiUrl = `https://taiko.wiki/song/${props.songId}`
  window.open(wikiUrl, '_blank')
}

</script>

<template>
  <dialog ref="dialogRef" @click="closeDialog" class="fixed w-full h-full top-0 bg-black/50 flex z-1">
    <div @click.stop class="dialog-content relative bg-white rounded-xl m-auto shadow-xl w-200 max-w-full max-h-[calc(100%-4rem)] flex overflow-hidden">
      <div class="absolute right-4 top-4">
        <button @click="closeDialog" class="p-2 rounded-full transition-colors hover:bg-gray-200">
          <X class="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <div v-if="data" class="space-y-2 flex-1 overflow-y-auto p-4 overscroll-contain md:p-8">
        <!-- 歌曲ID -->
        <p class="text-gray text-sm">#{{ props.songId }}</p>
        <!-- 标题 -->
        <div class="flex flex-col space-y-1">
          <p
            class="text-sm w-max px-2 py-1 rounded-full text-white text-shadow border-2 border-white"
            :class="{
              'bg-blue-500' : data.type === '流行音乐',
              'bg-pink-500' : data.type === '动漫音乐',
              'bg-purple-500' : data.type === '游戏音乐',
              'bg-amber-500' : data.type === '古典音乐',
              'bg-yellow-500' : data.type === '儿童音乐',
              'bg-gray-500' : data.type === '博歌乐音乐',
              'bg-green-500' : data.type === '综合音乐',
              'bg-red-500' : data.type === '南梦宫原创音乐',
            }"
          >
            {{ data.type }}
          </p>
          <p @click="copyTitle" class="text-xl cursor-pointer w-max max-w-full">{{ data.title || '未知曲目' }}</p>
          <p v-if="data.subtitle" class="text-sm text-gray-500">{{ data.subtitle }}</p>
        </div>
        <!-- 哔哩哔哩 -->
        <div v-if="data.title" class="border-blue text-blue-500 bg-blue-50 border-2 rounded-lg flex w-max">
          <img class="w-5 mx-2" src="/img/icon/bilibili.svg" alt="">
          <a
            :href="`bilibili://search?keyword=${encodeURIComponent(`太鼓达人 ${data.title}`)}`"
            target="_blank"
            class="px-2 py-1 rounded-md hover:bg-blue-100"
          >APP</a>
          <a
            :href="`https://search.bilibili.com/all?keyword=${encodeURIComponent(`太鼓达人 ${data.title}`)}`"
            target="_blank"
            class="px-2 py-1 rounded-md hover:bg-blue-100"
          >WEB</a>
        </div>
        <!-- 信息 -->
        <div v-if="data.title" class="space-y-1">
          <div class="flex items-center space-x-2 text-sm">
            <p class="text-gray-500">上线日期</p>
            <p class="flex-1 min-w-0">{{ data.openDay }}</p>
          </div>
          <div class="flex items-center space-x-2 text-sm">
            <p class="text-gray-500">日文标题</p>
            <p class="flex-1 min-w-0">{{ data.titleJp }}</p>
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
              v-for="(level, index) in data.levels"
              @click="handleLevelChange(Number(index) + 1)"
              class="relative w-15 rounded-t-lg border-2 border-b-none border-amber-950 overflow-hidden transition-all cursor-pointer hover:opacity-100"
              :class="{
                'bg-red-300': Number(index) + 1 === 1,
                'bg-lime-300': Number(index) + 1 === 2,
                'bg-blue-300': Number(index) + 1 === 3,
                'bg-pink-300': Number(index) + 1 === 4,
                'bg-purple-300': Number(index) + 1 === 5,
                'h-10 opacity-100': selectLevel === Number(index) + 1,
                'h-8 opacity-50': selectLevel !== Number(index) + 1,
              }"
            >
              <div class="absolute w-full h-full bg-gradient-to-b from-white/50 to-transparent"></div>
              <div class="relative w-full h-full flex items-center justify-center space-x-1">
                <img class="w-6" :src="`/img/level/level_${Number(index) + 1}.png`" alt="">
                <p class="text-white font-bold text-xl text-border">{{ level }}</p>
              </div>
            </div>
          </div>
          <div class="w-full min-h-44 flex border-2 border-amber-950 rounded-lg rounded-tl-none overflow-hidden">
            <div v-if="data.score" class="p-2 w-full grid grid-cols-2 gap-2 md:grid-cols-3">
              <div class="space-y-1 flex flex-col">
                <div class="bg-red-400 text-white rounded-lg overflow-hidden text-center flex-1 flex flex-col">
                  <p class="p-1 bg-red-500 text-sm">历史最高得分</p>
                  <div class="flex-1 flex flex-col justify-center items-center">
                    <p class="text-border m-auto text-white font-bold text-3xl tracking-widest">{{ data.score?.high_score }}</p>
                  </div>
                </div>
                <p class="text-xs opacity-50 text-center">{{ data.score?.highscore_datetime.replace(/\//g, '.') }}</p>
                <div class="grid grid-cols-2">
                  <div class="flex">
                    <img class="m-auto w-15" :src="`/img/score_badge/score_${data.score?.best_score_rank}.png`" alt=""></img>
                  </div>
                  <div class="flex">
                    <img 
                      v-if="data.score?.dondaful_combo_cnt > 0"
                      class="m-auto w-15" 
                      src="/img/crown/crown_rainbow.png" 
                      alt=""
                    />
                    <img 
                      v-else-if="data.score?.full_combo_cnt > 0"
                      class="m-auto w-15" 
                      src="/img/crown/crown_gold.png" 
                      alt=""
                    />
                    <img 
                      v-else-if="data.score?.clear_cnt > 0"
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
                  <p>{{ data.score?.good_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gradient-to-r from-gray-400 to-gray-300 px-2 py-0.5 rounded-lg">
                  <p class="text-border text-white">可</p>
                  <p>{{ data.score?.ok_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gradient-to-r from-blue-400 to-gray-300 px-2 py-0.5 rounded-lg">
                  <p class="text-border text-white">不可</p>
                  <p>{{ data.score?.ng_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gradient-to-r from-amber-400 to-gray-300 px-2 py-0.5 rounded-lg">
                  <p class="text-border text-white">连打数</p>
                  <p>{{ data.score?.pound_cnt }}</p>
                </div>
                <div class="flex justify-between items-center bg-gradient-to-r from-red-400 to-gray-300 px-2 py-0.5 rounded-lg">
                  <p class="text-border text-white">最大连击数</p>
                  <p>{{ data.score?.combo_cnt }}</p>
                </div>
              </div>
              <div class="space-y-1 text-border text-white col-span-2 md:col-span-1">
                <div class="flex justify-center items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                  <p>游玩统计</p>
                </div>
                <div class="grid grid-cols-2 gap-1 md:grid-cols-1">
                  <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                    <p>游玩次数</p>
                    <p>{{ data.score?.stage_cnt }}</p>
                  </div>
                  <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                    <p>通关次数</p>
                    <p>{{ data.score?.clear_cnt }}</p>
                  </div>
                  <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                    <p>全连次数</p>
                    <p>{{ data.score?.full_combo_cnt }}</p>
                  </div>
                  <div class="flex justify-between items-center bg-gray-200 px-2 py-0.5 rounded-lg">
                    <p>全良连段次数</p>
                    <p>{{ data.score?.dondaful_combo_cnt }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="m-auto flex flex-col items-center space-y-2 opacity-50">
              <img class="w-35" src="/img/sticker/sticker_2.png" alt="">
              <p>还没有该难度的游玩记录咚~</p>
            </div>
          </div>
        </div>
        <div>
          <Button @click="jumpToWiki" class="w-full mt-4">Taiko Wiki</Button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style>
dialog::backdrop {
  display: none;
}
</style>