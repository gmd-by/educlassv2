<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
})

const maskStyle = computed(() => {
  const url = `url(/${props.name}.svg)`
  return {
    maskImage: url,
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskImage: url,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    WebkitMaskSize: 'contain',
  }
})
</script>

<template>
  <span aria-hidden="true"
        class="inline-block shrink-0 bg-current"
        :style="maskStyle"/>
</template>