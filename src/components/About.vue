<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { X } from 'lucide-vue-next'

const emit = defineEmits(['update:visible'])

const dialogRef = ref<HTMLDialogElement>()

onMounted(() => {
  dialogRef.value?.show()
})

const closeDialog = () => {
  emit('update:visible', false)
}
</script>

<template>
  <dialog ref="dialogRef" @click="closeDialog" class="fixed w-full h-full top-0 bg-black/50 flex z-50">
    <div @click.stop class="dialog-content relative bg-white rounded-xl m-auto shadow-xl w-120 max-w-[90%] max-h-[calc(100%-4rem)] flex flex-col overflow-hidden">
      <div class="absolute right-4 top-4 z-10">
        <button @click="closeDialog" class="p-2 rounded-full transition-colors hover:bg-gray-200">
          <X class="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-6 overscroll-contain">
        <h2 class="text-2xl mb-4 text-amber-900">关于 Donder 查分器</h2>

        <div class="space-y-1 mb-4 text-gray-700">
          <p>源代码 <a href="https://github.com/luluxia/donder-tool" target="_blank" class="text-blue">luluxia/donder-tool</a></p>
          <p>图片素材 <a href="https://www.spriters-resource.com/arcade/taikonotatsujin2020version/" target="_blank" class="text-blue">spriters-resource.com</a></p>
          <p>界面参考 <a href="https://dxrating.net/search" target="_blank" class="text-blue">DXRating</a></p>
        </div>
        
        <div class="space-y-4 text-gray-700">
          <p>这是一个非官方的太鼓达人查分工具，旨在帮助玩家更方便地查询和管理自己的游戏成绩。</p>
          
          <h3 class="text-lg text-amber-800">功能介绍</h3>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>曲目搜索：快速查找游戏收录的曲目信息</li>
            <li>成绩查询：查看个人的游玩记录和详细数据</li>
            <li>数据统计：直观展示良/可/不可等判定数据</li>
          </ul>

          <h3 class="text-lg text-amber-800">免责声明</h3>
          <p class="text-sm">本工具仅供学习交流使用，相关数据和图片版权归原作者及 Bandai Namco 所有。</p>

          <h3 class="text-lg text-amber-800">友情链接</h3>
          <div class="flex flex-col">
            <a href="https://qm.qq.com/q/bywwY4MmEo" target="_blank" class="text-blue w-max">太鼓达人入坑群</a>
            <a href="https://tjahelp.eu.org/" target="_blank" class="text-blue w-max">菌菌机器人</a>
            <a href="https://rating.ourtaiko.org/" target="_blank" class="text-blue w-max">太鼓之达人 Rating & 六维分析</a>
            <a href="https://www.donder.click/search-song.html" target="_blank" class="text-blue w-max">歌曲筛选器</a>
            <p>微信小程序 Don Note</p>
          </div>
        </div>

        <div class="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Donder Tool © 2025</p>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
dialog::backdrop {
  display: none;
}
</style>
