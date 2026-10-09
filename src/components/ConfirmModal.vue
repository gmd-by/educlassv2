<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirm' },
})
const emit = defineEmits(['confirm', 'close'])
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/45"
       @click.self="emit('close')">
    <div class="w-full max-w-sm overflow-hidden bg-white rounded shadow-lg">
      <h2 class="px-4 py-2 text-sm font-medium text-white uppercase bg-red-700">{{ title }}</h2>
      <p class="p-4 text-sm text-gray-600">{{ message }}</p>
      <div class="flex justify-end gap-2 px-4 py-3 text-sm border-t border-gray-200">
        <button type="button"
                class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                @click="emit('close')">
          Cancel
        </button>
        <button type="button"
                class="px-3 py-1 font-medium text-white bg-red-700 rounded hover:bg-red-900"
                @click="emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>