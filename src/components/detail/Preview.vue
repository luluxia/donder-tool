<script setup lang="ts">
import axios from 'axios'
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  songId: number
  selectLevel: number
}>()

const data = ref<string[]>([])
const loading = ref(false)

watchEffect(async () => {
  if (!props.songId || !props.selectLevel) return
  loading.value = true
  data.value = []
  const res = await axios.get(
    `https://cdn.ourtaiko.org/api/preview/${props.songId}`
  )
  loading.value = false
  if (res.data) {
    data.value = res.data[props.selectLevel] || []
  } else {
    data.value = []
  }
})

</script>

<template>
  <img v-for="url in data" :src="url" alt="">
  <div v-if="!loading && data.length === 0" class="m-auto flex flex-col items-center space-y-2 opacity-50 py-4">
    <img class="w-35" src="/img/sticker/sticker_2.png" alt="">
    <p>当前还没有该难度的谱面预览咚~</p>
  </div>
</template>