<script setup lang="ts">

</script>

<template>
  <img class="fixed w-screen h-screen object-cover -z-1" src="/img/bg.png" alt="">
  <div class="w-full h-50 bg-gradient-to-b from-amber-400 to-transparent flex flex-col items-center">
    <div class="w-screen-xl p-8">
      <p>Taiko Score</p>
    </div>
    <div>
      <img class="w-80" src="/img/logo.png" alt="">
    </div>
  </div>
  <div class="w-screen-xl mx-auto my-8 flex flex-col items-center gap-8">
    <div class="flex rounded-full bg-white/25 border-white border-2 ring-3 ring-amber-950 font-bold">
      <p class="bg-amber-400 rounded-full px-4 py-2">全部曲目</p>
      <p class="rounded-full px-4 py-2">成绩查询</p>
    </div>
    <input
      type="text"
      placeholder="请输入歌曲名称、作曲家，或者别名咚~"
      class="w-full p-4 bg-white/25 rounded-xl border-white border-2 ring-3 ring-amber-950 focus:(outline-none bg-white/50)"
    >
  </div>
</template>
