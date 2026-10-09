<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import SvgIcon from './SvgIcon.vue'

const props = defineProps({
  modelValue: { default: null },
  options: { type: Array, required: true },
  placeholder: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
})
const emit = defineEmits(['update:modelValue'])

const MENU_MAX_HEIGHT = 224
const root = ref(null)
const panel = ref(null)
const open = ref(false)
const opensUp = ref(false)
const panelStyle = ref({})
const activeIndex = ref(-1)

const selected = computed(() => props.options.find((option) => option.value === props.modelValue))
const joinedRadius = computed(() => {
  if (!open.value) return ''
  return opensUp.value ? 'rounded-t-none' : 'rounded-b-none'
})

function place() {
  const rect = root.value.getBoundingClientRect()
  const below = window.innerHeight - rect.bottom
  opensUp.value = below < MENU_MAX_HEIGHT && rect.top > below
  panelStyle.value = {
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    ...(opensUp.value
        ? { bottom: `${window.innerHeight - rect.top - 1}px` }
        : { top: `${rect.bottom - 1}px` }),
  }
}

function setListeners(active) {
  const method = active ? 'addEventListener' : 'removeEventListener'
  document[method]('click', onOutsideClick)
  window[method]('scroll', onScroll, true)
  window[method]('resize', closeMenu)
}

function onOutsideClick(event) {
  if (!root.value.contains(event.target)) closeMenu()
}

function onScroll(event) {
  if (!panel.value?.contains(event.target)) closeMenu()
}

function openMenu() {
  place()
  activeIndex.value = props.options.findIndex((option) => option.value === props.modelValue)
  open.value = true
  setListeners(true)
}

function closeMenu() {
  open.value = false
  setListeners(false)
}

function toggle() {
  if (open.value) closeMenu()
  else openMenu()
}

function choose(option) {
  emit('update:modelValue', option.value)
  closeMenu()
}

async function move(step) {
  const last = props.options.length - 1
  activeIndex.value = Math.min(last, Math.max(0, activeIndex.value + step))
  await nextTick()
  panel.value?.children[activeIndex.value]?.scrollIntoView({ block: 'nearest' })
}

function onKeydown(event) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!open.value) openMenu()
    else move(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Enter' && open.value && activeIndex.value >= 0) {
    event.preventDefault()
    choose(props.options[activeIndex.value])
  } else if (event.key === 'Escape' && open.value) {
    closeMenu()
  }
}

onBeforeUnmount(closeMenu)
</script>

<template>
  <div ref="root" class="relative">
    <button type="button"
            class="flex items-center justify-between w-full gap-2 px-3 text-left bg-white border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            :class="[
              size === 'sm' ? 'py-1' : 'py-2',
              invalid ? 'border-red-500' : 'border-gray-300',
              joinedRadius,
            ]"
            aria-haspopup="listbox"
            :aria-expanded="open"
            @click="toggle"
            @keydown="onKeydown">
      <span class="truncate" :class="selected ? '' : 'text-gray-400'">
        {{ selected ? selected.label : placeholder }}
      </span>
      <SvgIcon name="downlogo"
               class="h-4 w-4 text-gray-500"
               :class="open ? 'rotate-180' : ''"/>
    </button>
    <ul v-if="open"
        ref="panel"
        role="listbox"
        class="fixed z-50 max-h-56 overflow-auto py-1 text-sm bg-white border border-gray-300"
        :class="opensUp ? 'rounded-t' : 'rounded-b'"
        :style="panelStyle">
      <li v-for="(option, index) in options"
          :key="option.value"
          role="option"
          class="px-3 py-2 cursor-pointer"
          :class="[
            index === activeIndex ? 'bg-emerald-100' : '',
            option.value === modelValue ? 'font-medium' : '',
          ]"
          :aria-selected="option.value === modelValue"
          @mouseenter="activeIndex = index"
          @click="choose(option)">
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>