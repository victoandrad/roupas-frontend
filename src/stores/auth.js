import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/api/auth.service'

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || null)
  const isAuthenticated = computed(() => !!token.value)

  const userEmail = computed(() => {
    if (!token.value) return null
    const payload = decodeToken(token.value)
    return payload?.sub || null
  })

  async function login(email, password) {
    const response = await authService.login(email, password)
    token.value = response.data.token || response.data
    localStorage.setItem('auth_token', token.value)
  }

  function logout() {
    token.value = null
    localStorage.removeItem('auth_token')
  }

  return { token, isAuthenticated, userEmail, login, logout }
})
