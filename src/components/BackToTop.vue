<template>
  <div
    class="absolute right-10 bottom-5 flex justify-center cursor-pointer transition-opacity"
    :class="isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    @click="scrollToTop"
  >
    <div class="absolute flex flex-col items-center mt-1">
      <ChevronUp class="h-4" />
      <p class="text-sm">返回</p>
    </div>
    <img class="w-15" src="/img/logo-bg.png" alt="">
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, type Ref } from 'vue'
import { ChevronUp } from 'lucide-vue-next'

const scrollContainer = inject<Ref<HTMLElement>>('scrollContainer')

const isVisible = ref(false)

const handleScroll = () => {
  isVisible.value = (scrollContainer?.value?.scrollTop ?? 0) > 0
}

onMounted(() => {
  scrollContainer?.value?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  scrollContainer?.value?.removeEventListener('scroll', handleScroll)
})

const scrollToTop = () => {
  scrollContainer?.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* 如果需要额外样式，可以添加 */
</style>