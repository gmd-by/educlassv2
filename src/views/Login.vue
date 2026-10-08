<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function handleSignIn() {
  auth.login()
  router.replace('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <header class="sticky top-0 z-10 bg-white shadow px-6 py-4">
      <span class="text-xl font-bold text-gray-800">EduClass</span>
    </header>

    <main class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-800 text-center mb-6">Sign in</h1>

        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="text"
               class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500" />

        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password"
               class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <label class="block text-xs font-medium text-gray-500 hover:text-emerald-500 mb-4 -mt-2">Forgot password?</label>

        <button
            @click="handleSignIn"
            class="w-full bg-blue-600 hover:bg-emerald-800 text-white font-medium rounded-lg py-2 hover: bg-emerald-700">
          Sign in
        </button>
      </div>
    </main>
  </div>
</template>