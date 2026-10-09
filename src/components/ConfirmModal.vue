<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirm' },
})
const emit = defineEmits(['confirm', 'close'])
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4"
       @click.self="emit('close')">
    <div class="w-full max-w-sm bg-white rounded shadow-lg overflow-hidden">
      <div class="bg-red-700 text-white px-4 py-2">
        <h2 class="font-medium text-sm uppercase">{{ title }}</h2>
      </div>
      <p class="p-4 text-sm text-gray-600">{{ message }}</p>
      <div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 text-sm">
        <button type="button"
                class="border border-gray-300 rounded bg-white px-3 py-1 hover:bg-gray-50"
                @click="emit('close')">
          Cancel
        </button>
        <button type="button"
                class="bg-red-700 text-white font-medium rounded px-3 py-1 hover:bg-red-800"
                @click="emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>