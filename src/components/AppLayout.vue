<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import SvgIcon from './SvgIcon.vue'

defineProps({
  pageName: { type: String, required: true },
})

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboardlogo' },
  { to: '/students', label: 'Students', icon: 'studentlogo' },
  { to: '/announcements', label: 'Announcements', icon: 'announcementlogo' },
]

const router = useRouter()
const auth = useAuthStore()

function handleSignOut() {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="flex h-screen">
    <!-- sidebar START -->
    <aside class="flex flex-col justify-between overflow-y-auto w-56 gap-4 p-4 font-medium text-white bg-emerald-700">
      <nav class="space-y-2">
        <RouterLink to="/dashboard" class="flex items-center mb-5 ps-2.5">
          <img src="/edulogo.png" alt="EduClass" class="h-7">
        </RouterLink>
        <hr class="border-emerald-100 opacity-25">
        <RouterLink v-for="link in navLinks"
                    :key="link.to"
                    :to="link.to"
                    class="flex items-center gap-3 px-3 py-2 rounded hover:bg-emerald-900 transition-colors duration-200">
          <SvgIcon :name="link.icon" class="h-5 w-5"/>
          {{ link.label }}
        </RouterLink>
      </nav>
      <button type="button"
              class="flex items-center w-full gap-3 px-3 py-2 text-left rounded hover:bg-emerald-900 transition-colors duration-200"
              @click="handleSignOut">
        <SvgIcon name="signoutlogo" class="h-5 w-5"/>
        Sign out
      </button>
    </aside>
    <!-- sidebar END -->

    <main class="flex-1 overflow-y-auto bg-gray-100">
      <!-- header START -->
      <div class="sticky top-0 z-10 flex items-center h-[62px] px-6 bg-white shadow">
        <span class="font-semibold text-gray-700">{{ pageName }}</span>
      </div>
      <!-- header END -->

      <slot/>
    </main>
  </div>
</template>