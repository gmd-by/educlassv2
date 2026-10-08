import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')

    function login(email, password) {
        if (email === 'admin@educlass.test' && password === 'admin123') {
            isLoggedIn.value = true
            localStorage.setItem('isLoggednIn', 'true')
            return true
        }
        return false
    }

    function logout() {
        isLoggedIn.value = false
        localStorage.removeItem('isLoggedIn')
    }
    return { isLoggedIn, login, logout }
})