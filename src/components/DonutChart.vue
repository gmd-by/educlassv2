<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
})

const chartColors = [
  '#b91c1c', '#65a30d', '#d97706', '#0f766e', '#eab308', '#1e40af', '#78716c', '#c026d3'
]

const circumference = 2 * Math.PI * 36

function colorAt(index) {
  return chartColors[index % chartColors.length]
}

const slices = computed(() => {
  const total = props.items.reduce((sum, item) => sum + item.count, 0)
  if (total === 0) return []
  let startAt = 0
  return props.items.map((item) => {
    const length = (item.count / total) * circumference
    const slice = { key: item.key, length, offset: -startAt }
    startAt +=length
    return slice
  })
})
</script>

<template>
  <div class="bg-white rounded shadow overflow-hidden flex flex-col">
    <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
      {{ title }}
    </h2>
    <div class="p-4 flex flex-col xl:flex-row items-center gap-4 flex-1">
      <div class="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100"
             aria-hidden="true"
             class="h-full w-full -rotate-90">
          <circle v-for="(slice, index) in slices"
                  :key="slice.key"
                  cx="50"
                  cy="50"
                  r="36"
                  fill="none"
                  stroke-width="16"
                  :stroke="colorAt(index)"
                  :stroke-dasharray="`${slice.length} ${circumference - slice.length}`"
                  :stroke-dashoffset="slice.offset"/>
        </svg>
      </div>
      <ul class="w-full xl:flex-1">
        <li v-for="(item, index) in items"
            :key="item.key"
            class="flex justify-between gap-3 py-1 text-xs">
          <span class="flex items-center gap-2 text-gray-600">
            <span class="h-2.5 w-2.5 rounded-full shrink-0"
                  :style="{ backgroundColor: colorAt(index) }"></span>
            {{ item.label }}
          </span>
          <span class="font-semibold text-gray-800">{{ item.count }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>