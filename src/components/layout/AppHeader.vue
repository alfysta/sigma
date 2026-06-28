<template>
    <header
        class="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center z-30 shadow-lg transition-colors duration-500"
        @click.stop>
        <!-- Left -->
        <div class="flex items-center gap-4">
            <!-- Hamburger Icon (Desktop: hiasan, Mobile: tombol) -->
            <button class="hamburger-btn" @click="toggleSidebar" title="Menu">
                <font-awesome-icon icon="bars" class="text-xl" />
            </button>

            <!-- App Name (Mobile Only) -->
            <h2 class="text-lg font-bold text-gold-gradient md:hidden">SIGMA</h2>
        </div>

        <!-- Right -->
        <div class="flex items-center gap-3">
            <!-- Theme Switch -->
            <div class="relative">
                <button class="theme-switch-btn" title="Ganti Tema" @click.stop="toggleThemeDropdown">
                    <font-awesome-icon :icon="isDarkMode ? 'moon' : 'sun'" class="text-lg" />
                </button>

                <Transition name="dropdown-fade">
                    <div v-if="showThemeDropdown" class="theme-dropdown" @click.stop>
                        <button class="theme-option" :class="{ active: isDarkMode }" @click="setTheme('dark')">
                            <font-awesome-icon icon="moon" class="w-4" />
                            <span>Dark Mode</span>
                        </button>
                        <button class="theme-option" :class="{ active: !isDarkMode }" @click="setTheme('light')">
                            <font-awesome-icon icon="sun" class="w-4" />
                            <span>Light Mode</span>
                        </button>
                    </div>
                </Transition>
            </div>

            <!-- User Dropdown -->
            <div class="relative">
                <button class="flex items-center gap-3 group" @click.stop="toggleUserDropdown">
                    <div class="avatar-circle">
                        <span class="avatar-text">{{ userInitials }}</span>
                    </div>
                    <div class="hidden md:block text-left">
                        <p
                            class="text-sm font-bold text-white group-hover:text-brand-gold transition-colors duration-300">
                            {{ authStore.userName }}
                        </p>
                        <p class="text-[11px] text-brand-gold">{{ authStore.user?.Role || 'User' }}</p>
                    </div>
                    <font-awesome-icon icon="chevron-down"
                        class="text-brand-gold text-xs hidden md:block transition-transform duration-300"
                        :class="{ 'rotate-180': showUserDropdown }" />
                </button>

                <Transition name="dropdown-fade">
                    <div v-if="showUserDropdown" class="dropdown-menu shadow-2xl" @click.stop>
                        <!-- User Info (Mobile Only) -->
                        <div class="px-5 py-3 border-b border-white/10 md:hidden">
                            <p class="font-bold text-white text-base">{{ authStore.userName }}</p>
                            <p class="text-xs text-brand-gold mt-0.5">{{ authStore.user?.Role }}</p>
                        </div>

                        <!-- Profile -->
                        <button
                            class="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:bg-white/5 mx-2 mt-2 rounded-lg transition-colors duration-200"
                            @click="goToProfile">
                            <font-awesome-icon icon="user-circle" />
                            <span>Profil Saya</span>
                        </button>

                        <!-- Divider -->
                        <div class="border-t border-white/5 my-1 mx-3"></div>

                        <!-- Logout -->
                        <button
                            class="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/20 mx-2 mb-2 rounded-lg transition-colors duration-200"
                            @click="handleLogout">
                            <font-awesome-icon icon="power-off" />
                            <span>Keluar</span>
                        </button>
                    </div>
                </Transition>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const emit = defineEmits<{
    (e: 'toggle-sidebar'): void
}>()

const router = useRouter()
const authStore = useAuthStore()

const showThemeDropdown = ref(false)
const showUserDropdown = ref(false)
const isDarkMode = ref(true)

const userInitials = computed(() => {
    const name = authStore.user?.Nama_Lengkap || '??'
    return name
        .split(' ')
        .filter(w => w.length > 0)
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
})

const toggleThemeDropdown = () => {
    showThemeDropdown.value = !showThemeDropdown.value
    showUserDropdown.value = false
}

const toggleUserDropdown = () => {
    showUserDropdown.value = !showUserDropdown.value
    showThemeDropdown.value = false
}

const setTheme = (theme: string) => {
    if (theme === 'dark') {
        document.body.classList.remove('light-mode')
        isDarkMode.value = true
        localStorage.setItem('sigma_theme', 'dark')
    } else {
        document.body.classList.add('light-mode')
        isDarkMode.value = false
        localStorage.setItem('sigma_theme', 'light')
    }
    showThemeDropdown.value = false
}

const toggleSidebar = () => {
    // Hanya berfungsi di mobile
    if (window.innerWidth < 768) {
        emit('toggle-sidebar')
    }
}

const goToProfile = () => {
    showUserDropdown.value = false
    router.push({ name: 'profile' })
}

const handleLogout = async () => {
    showUserDropdown.value = false

    const { useSwal } = await import('@/plugins/sweetalert')
    const { confirmDelete, toastSuccess } = useSwal()

    const confirmed = await confirmDelete()
    if (confirmed) {
        authStore.logout()
        toastSuccess('Berhasil logout!')
        setTimeout(() => {
            router.push('/login')
        }, 500)
    }
}

const handleClickOutside = () => {
    showThemeDropdown.value = false
    showUserDropdown.value = false
}

const loadTheme = () => {
    const saved = localStorage.getItem('sigma_theme')
    if (saved === 'light') {
        document.body.classList.add('light-mode')
        isDarkMode.value = false
    } else {
        document.body.classList.remove('light-mode')
        isDarkMode.value = true
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    loadTheme()
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ═══════════════════════════════════════════
   HAMBURGER BUTTON
   ═══════════════════════════════════════════ */
.hamburger-btn {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(251, 191, 36, 0.15);
    color: #fbbf24;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

/* Desktop: tampil sebagai ikon hiasan */
@media (min-width: 768px) {
    .hamburger-btn {
        cursor: default;
        opacity: 0.7;
    }

    .hamburger-btn:hover {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(251, 191, 36, 0.15);
        transform: none;
        box-shadow: none;
    }
}

/* Mobile: tombol aktif */
@media (max-width: 767px) {
    .hamburger-btn {
        cursor: pointer;
        opacity: 1;
    }

    .hamburger-btn:hover {
        background: rgba(251, 191, 36, 0.08);
        border-color: rgba(251, 191, 36, 0.4);
        box-shadow: 0 0 20px rgba(251, 191, 36, 0.15);
        transform: scale(1.05);
    }

    .hamburger-btn:active {
        transform: scale(0.95);
    }
}

/* ═══════════════════════════════════════════
   AVATAR
   ═══════════════════════════════════════════ */
.avatar-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #1e0a2d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.avatar-circle:hover {
    border-color: rgba(251, 191, 36, 0.5);
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
}

.avatar-text {
    line-height: 1;
}

/* ═══════════════════════════════════════════
   THEME SWITCH BUTTON
   ═══════════════════════════════════════════ */
.theme-switch-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(251, 191, 36, 0.2);
    color: #fbbf24;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.theme-switch-btn:hover {
    background: rgba(251, 191, 36, 0.1);
    border-color: rgba(251, 191, 36, 0.4);
    transform: scale(1.05);
}

/* ═══════════════════════════════════════════
   THEME DROPDOWN
   ═══════════════════════════════════════════ */
.theme-dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    background: rgba(20, 5, 35, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(251, 191, 36, 0.3);
    border-radius: 14px;
    padding: 8px;
    min-width: 160px;
    z-index: 120;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.theme-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
}

.theme-option:hover {
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
}

.theme-option.active {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
    font-weight: 700;
}

/* ═══════════════════════════════════════════
   USER DROPDOWN
   ═══════════════════════════════════════════ */
.dropdown-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    background: rgba(20, 5, 35, 0.95);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(251, 191, 36, 0.3);
    border-radius: 16px;
    padding: 4px;
    min-width: 240px;
    z-index: 100;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

/* ═══════════════════════════════════════════
   DROPDOWN ANIMATION
   ═══════════════════════════════════════════ */
.dropdown-fade-enter-active {
    transition: all 0.2s ease-out;
}

.dropdown-fade-leave-active {
    transition: all 0.15s ease-in;
}

.dropdown-fade-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
}

.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
}
</style>
