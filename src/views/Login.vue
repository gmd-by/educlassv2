<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')

function handleSignIn() {
  if (auth.login(email.value.trim(), password.value)) {
    router.replace('/dashboard')
  } else {
    error.value = 'Invalid email or password.'
  }
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
        <input v-model="email"
               type="text"
               class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 foxus:outline-none focus:ring-2 focus:ring-emerald-500"/>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input v-model="password"
               type="password"
               class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
        <label class="block text-xs font-medium text-gray-500 hover:text-emerald-500 mb-4 mt-2">Forgot password?</label>
        <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>
        <button @click="handleSignIn"
                class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg py-2">
          Sign In
        </button>
      </div>
    </main>
  </div>
</template>