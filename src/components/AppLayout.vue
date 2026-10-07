<script setup>
import { useRouter } from 'vue-router'

defineProps( {
  pageName: {
    type: String,
    required: true,
  },
})

const router = useRouter()

function handleSignOut() {
  router.replace('/login')
}
</script>

<template>
  <div class="h-screen flex">
    <!-- SIDEBAR -->
    <aside
        id="sidebar"
        class="w-56 bg-emerald-700 text-white flex flex-col justify-between gap-4 p-4 overflow-y-auto">
      <nav class="space-y-2">
        <RouterLink to="/dashboard" class="flex items-center ps-2.5 mb-5">
          <img src="/edulogo.png"
               class="h-9 me-3"
               alt="logo"/>
          <span class="self-center text-lg text-heading font-semibold whitespace-nowrap"/>
        </RouterLink>
        <hr class="border-emerald-100 opacity-25">
        <RouterLink to="/dashboard" class="block px-3 py-2 hover:bg-gray-800">Dashboard</RouterLink>
        <RouterLink to="/students" class="block px-3 py-2 hover:bg-gray-800">Students</RouterLink>
        <RouterLink to="/announcements" class="block px-3 py-2 hover:bg-gray-800">Announcements</RouterLink>
      </nav>

      <button
          @click="handleSignOut()"
          class="w-full text-left px-3 py-2 rounded hover:bg-gray-800">
        Sign out
      </button>
    </aside>
      <!-- SIDEBAR END -->

    <main class="flex-1 flex-col overflow-y-auto bg-gray-100">
      <div class="sticky top-0 shrink-0 z-10 bg-white shadow px-6 py-3">
        <span class="font-semibold text-gray-700">{{ pageName }}</span>
      </div>

      <slot />
    </main>
  </div>
</template>

<style scoped>

</style>