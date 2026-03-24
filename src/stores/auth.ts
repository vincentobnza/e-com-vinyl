import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/api/auth'
import { authApi } from '@/api/auth'
import { getStoredToken, setStoredToken } from '@/utils/authStorage'

export { getStoredToken, setStoredToken }

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getStoredToken())
  const user = ref<User | null>(null)
  const isHydrated = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function hydrate() {
    if (!token.value) {
      isHydrated.value = true
      return
    }
    try {
      const { data } = await authApi.getUser()
      user.value = data.user
    } catch {
      setStoredToken(null)
      token.value = null
      user.value = null
    } finally {
      isHydrated.value = true
    }
  }

  async function login(email: string, password: string) {
    const { data } = await authApi.login({ email, password })
    token.value = data.token
    user.value = data.user
    setStoredToken(data.token)
    return data
  }

  async function register(name: string, email: string, password: string, passwordConfirmation: string) {
    const { data } = await authApi.register({ name, email, password, password_confirmation: passwordConfirmation })
    token.value = data.token
    user.value = data.user
    setStoredToken(data.token)
    return data
  }

  async function logout(skipApi = false) {
    try {
      if (!skipApi) await authApi.logout()
    } finally {
      token.value = null
      user.value = null
      setStoredToken(null)
    }
  }

  return {
    token,
    user,
    isHydrated,
    isAuthenticated,
    hydrate,
    login,
    register,
    logout,
  }
})
