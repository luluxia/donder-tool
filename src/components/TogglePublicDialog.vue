<script setup lang="ts">
import { watch, ref } from 'vue'
import Button from './Button.vue'
import { X } from 'lucide-vue-next'

interface Props {
  visible: boolean
  isPublic: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'confirm': []
}>()

const dialogRef = ref<HTMLDialogElement>()

watch(() => props.visible, (newVal) => {
  if (newVal) {
    dialogRef.value?.show()
  } else {
    dialogRef.value?.close()
  }
})

const closeDialog = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  emit('confirm')
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
      
      <div class="flex-1 overflow-y-auto p-6 overscroll-contain flex flex-col items-center justify-center">
        <h3 class="text-lg mb-4 text-amber-900">{{ isPublic ? '确认隐藏成绩' : '确认公开成绩' }}</h3>
        <p class="text-gray-600 mb-8 text-center max-w-xs">
          {{ isPublic ? '确认要隐藏成绩吗？隐藏后第三方将无法通过ID查询Donder查分器中的成绩记录咚~' : '确认要公开成绩吗？公开后第三方可直接通过ID查询Donder查分器中的成绩记录咚~' }}
        </p>
        <div class="flex gap-3">
          <Button
            @click="handleConfirm"
            :disabled="loading"
            class="px-6"
          >
            {{ loading ? '处理中...' : '确认' }}
          </Button>
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
