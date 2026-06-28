import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginWithRTDB } from '@/firebase'

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(JSON.parse(sessionStorage.getItem('sigma_user') || 'null'))
    const isLoading = ref(false)
    const error = ref(null)

    // Getters
    const isLoggedIn = computed(() => !!user.value)
    const isGuru = computed(() => user.value?.Role === 'Guru')
    const isSiswa = computed(() => user.value?.Role === 'Siswa')
    const userName = computed(() => user.value?.Nama_Lengkap || 'Pengguna')
    const userInitials = computed(() => {
        if (!user.value?.Nama_Lengkap) return '??'
        return user.value.Nama_Lengkap
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
    })

    // Actions
    const login = async (username, password) => {
        isLoading.value = true
        error.value = null

        try {
            const userData = await loginWithRTDB(username, password)
            user.value = userData
            sessionStorage.setItem('sigma_user', JSON.stringify(userData))
            return { success: true }
        } catch (err) {
            error.value = err.message
            return { success: false, message: err.message }
        } finally {
            isLoading.value = false
        }
    }

    const logout = () => {
        user.value = null
        sessionStorage.removeItem('sigma_user')
    }

    return {
        user,
        isLoading,
        error,
        isLoggedIn,
        isGuru,
        isSiswa,
        userName,
        userInitials,
        login,
        logout,
    }
})
