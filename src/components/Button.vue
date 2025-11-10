<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <div :class="[
    'bg-gradient-to-b from-amber-200 to-amber-400 text-border text-white w-max p-2 rounded ring-2 ring-amber-950',
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:(from-amber-100 to-amber-300)'
  ]">
    <slot />
  </div>
</template>
