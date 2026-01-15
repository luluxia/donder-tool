<script setup lang="ts">
import { onMounted, ref, inject, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import Score from './detail/Score.vue'
import Ranking from './detail/Ranking.vue'
import Button from './Button.vue'

const dialogRef = ref<HTMLDialogElement>()
const emit = defineEmits(['update:visible', 'update:select-level'])
const props = defineProps<{
  songId: number
  selectLevel: number
}>()

const closeDialog = () => {
  emit('update:visible', false)
}
const handleLevelChange = (newLevel: number) => {
  emit('update:select-level', newLevel)
}

onMounted(() => {
  dialogRef.value?.show()
})

const songData = inject('songData') as any
const data = computed(() => {
  const cn = songData.value?.find((item: any) => item.id === props.songId)
  return {
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
    levels: (() => {
      if (cn?.level_5 === '-') {
        return [cn?.level_1, cn?.level_2, cn?.level_3, cn?.level_4];
      } else {
        return [cn?.level_1, cn?.level_2, cn?.level_3, cn?.level_4, cn?.level_5];
      }
    })(),
  }
})

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

const tabs = ref(['成绩详情', '排行榜', '谱面预览'])
const activeTab = ref('成绩详情')
</script>

<template>
  <dialog ref="dialogRef" @click="closeDialog" class="fixed w-full h-full top-0 bg-black/50 flex z-1">
    <div @click.stop class="dialog-content relative bg-white rounded-xl m-auto shadow-xl w-200 max-w-full h-[calc(100%-4rem)] flex overflow-hidden">
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
        <!-- 内容 -->
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
          <div class="w-full min-h-60 flex flex-col border-2 border-amber-950 rounded-lg rounded-tl-none overflow-hidden">
            <!-- 选项 -->
            <div class="flex p-2 space-x-2 !bg-amber-100 border-b-2 border-amber-950">
              <p
                v-for="tab in tabs"
                @click="activeTab = tab"
                :key="tab"
                class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-amber-400/50"
                :class="{ 'text-border !bg-amber-400 text-white': activeTab === tab }"
              >
                {{ tab }}
              </p>
            </div>
            <!-- 成绩详情 -->
            <Score v-if="activeTab === '成绩详情'" :songId="songId" :selectLevel="selectLevel" />
            <!-- 排行榜 -->
            <Ranking v-if="activeTab === '排行榜'" :songId="songId" :selectLevel="selectLevel" />
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