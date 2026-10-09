<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
})

const maskStyle = computed(() => {
  const mask = `url(/${props.name}.svg) center / contain no-repeat`
  return { mask, WebkitMask: mask }
})
</script>

<template>
  <span class="inline-block shrink-0 bg-current"
        :style="maskStyle"
        aria-hidden="true"/>
</template>