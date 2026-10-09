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

const MENU_HEIGHT = 240
const open = ref(false)
const root = ref(null)
const panel = ref(null)
const panelStyle = ref({})
const activeIndex = ref(-1)

const selected = computed(() => props.options.find((option) => option.value === props.modelValue))

function place() {
  const rect = root.value.getBoundingClientRect()
  const below = window.innerHeight - rect.bottom
  const style = { left: `${rect.left}px`, width: `${rect.width}px` }
  if (below < MENU_HEIGHT && rect.top > below) {
    style.bottom = `${window.innerHeight - rect.top + 4}px`
  } else {
    style.top = `${rect.bottom + 4}px`
  }
  panelStyle.value = style
}

function onOutsideClick(event) {
  if (!root.value.contains(event.target)) closeMenu()
}

function onScroll(event) {
  if (panel.value && panel.value.contains(event.target)) return
  closeMenu()
}

function openMenu() {
  place()
  activeIndex.value = props.options.findIndex((option) => option.value === props.modelValue)
  open.value = true
  document.addEventListener('click', onOutsideClick)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', closeMenu)
}

function closeMenu() {
  open.value = false
  document.removeEventListener('click', onOutsideClick)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', closeMenu)
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
            class="flex w-full items-center justify-between gap-2 rounded border bg-white text-left"
            :class="[
              invalid ? 'border-red-500' : 'border-gray-300',
              size === 'sm' ? 'px-3 py-1' : 'px-3 py-2',
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
        class="fixed z-50 max-h-56 overflow-auto rounded border border-gray-300 bg-white py-1 text-sm"
        :style="panelStyle">
      <li v-for="(option, index) in options"
          :key="option.value"
          role="option"
          :aria-selected="option.value === modelValue"
          class="cursor-pointer px-3 py-2"
          :class="[
            index === activeIndex ? 'bg-emerald-100' : '',
            option.value === modelValue ? 'font-medium' : '',
          ]"
          @mouseenter="activeIndex = index"
          @click="choose(option)">
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>