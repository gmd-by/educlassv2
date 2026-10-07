<script setup>
import { computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAnnouncementStore } from "../stores/announcements.js"

const announcementsStore = useAnnouncementStore()
const posts = computed(() => announcementsStore.posts)
</script>

<template>
<AppLayout page-name="Announcements">
  <div class="w-full px-[25px] py-2">
    <RouterLink to="/dashboard"
                class="inline-block mt-4 pb-2 text-sm font-medium text-emerald-600 hover:text-emerald-900">
      ← Back to Dashboard
    </RouterLink>
    <div class="bg-white rounded shadow overflow-hidden">
      <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
        ANNOUNCEMENTS
      </h2>

      <div class="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <article v-for="post in posts"
                 :key="post.id"
                 class="rounded border border-gray-200 overflow-hidden flex flex-col">

          <img :src="post.image || '/newsplaceholder.webp'"
               :alt="post.image ? post.title : ''"
               loading="lazy"
               class="h-36 w-full object-cover">
          <div class="p-4 flex-1">
            <div class="flex justify-between items-baseline gap-3">
              <h3 class="font-semibold text-gray-800">{{ post.title }}</h3>
              <span class="text-xs text-gray-400 shrink-0">{{ post.date }}</span>
            </div>
            <p class="text-xs text-gray-500 mb-2">{{ post.author }}</p>
            <p class="text-sm text-gray-600">{{ post.body }}</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</AppLayout>
</template>
