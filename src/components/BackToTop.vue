<template>
  <div
    class="fixed right-10 bottom-5 flex justify-center cursor-pointer transition-opacity touch-none"
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
import { ref, watchEffect, inject, type Ref } from 'vue'
import { ChevronUp } from 'lucide-vue-next'

const scrollContainer = inject<Ref<HTMLElement>>('scrollContainer')

const isVisible = ref(false)

const handleScroll = () => {
  isVisible.value = (scrollContainer?.value?.scrollTop ?? 0) > 0
}

let cleanup: (() => void) | null = null

watchEffect((onCleanup) => {
  if (scrollContainer?.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
    
    cleanup = () => {
      scrollContainer.value?.removeEventListener('scroll', handleScroll)
    }
    
    onCleanup(cleanup)
  }
})

const scrollToTop = () => {
  scrollContainer?.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
