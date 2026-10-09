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
    return
  }
  error.value = 'Invalid email or password.'
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <!-- header START -->
    <header class="flex items-center h-[62px] px-6 bg-emerald-700 shadow">
      <img src="/edulogo.png" alt="EduClass" class="h-7">
    </header>
    <!-- header END -->

    <main class="flex flex-1 items-center justify-center">
      <form class="w-full max-w-sm p-8 bg-white rounded shadow"
            @submit.prevent="handleSignIn">
        <h1 class="mb-6 text-2xl font-bold text-center text-gray-800">Sign in</h1>

        <label for="email" class="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input id="email"
               v-model="email"
               type="text"
               class="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-700">

        <label for="password" class="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input id="password"
               v-model="password"
               type="password"
               class="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-700">

        <button type="button"
                class="block mt-2 mb-4 text-xs font-medium text-gray-500 hover:text-emerald-700">
          Forgot password?
        </button>

        <p v-if="error" class="mb-4 text-sm text-red-600">{{ error }}</p>

        <button type="submit"
                class="w-full py-2 font-medium text-white bg-emerald-700 rounded hover:bg-emerald-900">
          Sign In
        </button>
      </form>
    </main>
  </div>
</template>