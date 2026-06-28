<template>
    <div class="w-full h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style="background: radial-gradient(circle at 30% 10%, #2d0a4e, #000000); color: #f3f4f6;">

        <!-- Background Math Symbols -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden z-0" style="opacity: 0.12; color: #d4af37;">
            <span v-for="item in bgElements" :key="item.id" class="absolute font-bold"
                style="font-family: 'Times New Roman', serif;" :style="{
                    top: item.top, left: item.left, right: item.right,
                    fontSize: item.fontSize, transform: `rotate(${item.rotate}deg)`
                }">{{ item.symbol }}</span>
        </div>

        <!-- Gradient Orb -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
            style="background: rgba(251, 191, 36, 0.05);"></div>

        <!-- Login Card -->
        <div class="rounded-3xl p-8 md:p-10 w-full max-w-md relative z-10 animate-fadeIn"
            style="background: rgba(20, 5, 35, 0.55); backdrop-filter: blur(20px); border: 1px solid rgba(251, 191, 36, 0.2); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);">

            <!-- Logo -->
            <div class="text-center mb-8">
                <div class="relative inline-flex w-16 h-16 rounded-full items-center justify-center mb-4 animate-pulseSlow"
                    style="background: linear-gradient(135deg, #3b0d31, #5c164e, #2a0822); border: 2px solid rgba(212, 175, 55, 0.7); box-shadow: 0 0 40px rgba(212, 175, 55, 0.4);">
                    <svg viewBox="40 30 90 120" fill="none" class="w-8 h-auto">
                        <path
                            d="M 50 40 L 120 40 L 120 55 L 75 55 L 105 90 L 75 125 L 120 125 L 120 140 L 50 140 L 85 90 Z"
                            fill="#D4AF37" />
                    </svg>
                </div>
                <h1 class="text-4xl md:text-5xl font-extrabold tracking-wider mb-1"
                    style="background: linear-gradient(to right, #fbbf24, #fef08a, #fbbf24); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">
                    SIGMA
                </h1>
                <div class="w-12 h-1 mx-auto mt-2 rounded-full"
                    style="background: linear-gradient(to right, #fbbf24, transparent);"></div>
                <p class="text-gray-400 mt-3 text-xs md:text-sm font-bold tracking-wider">
                    Sistem Informasi Guru & Manajemen Akademik
                </p>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleLogin" class="space-y-5">
                <!-- Username -->
                <div>
                    <label class="text-[#fbbf24] text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 block">
                        Username / NISN
                    </label>
                    <div class="relative group">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#fbbf24] transition-colors">
                            <font-awesome-icon icon="user" class="text-sm" />
                        </span>
                        <input v-model="username" type="text" placeholder="Masukkan Username / NISN"
                            class="w-full pl-11 pr-4 py-3 text-sm text-white rounded-xl transition-all bg-black/40 border border-purple-800/60 focus:border-[#fbbf24] focus:shadow-[0_0_12px_rgba(251,191,36,0.3)] outline-none" />
                    </div>
                </div>

                <!-- Password -->
                <div>
                    <label class="text-[#fbbf24] text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 block">
                        Password
                    </label>
                    <div class="relative group">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#fbbf24] transition-colors">
                            <font-awesome-icon icon="lock" class="text-sm" />
                        </span>
                        <input v-model="password" :type="showPassword ? 'text' : 'password'"
                            placeholder="Masukkan Password"
                            class="w-full pl-11 pr-12 py-3 text-sm text-white rounded-xl transition-all bg-black/40 border border-purple-800/60 focus:border-[#fbbf24] focus:shadow-[0_0_12px_rgba(251,191,36,0.3)] outline-none" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#fbbf24] transition-colors text-sm">
                            <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                        </button>
                    </div>
                </div>

                <!-- Error -->
                <div v-if="authStore.error"
                    class="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs flex items-center gap-2">
                    <font-awesome-icon icon="circle-exclamation" />
                    {{ authStore.error }}
                </div>

                <!-- Button -->
                <button type="submit" :disabled="authStore.isLoading || !username || !password"
                    class="btn-login w-full py-3.5 text-base font-extrabold uppercase tracking-[0.1em] flex justify-center items-center gap-3 mt-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="!authStore.isLoading">
                        <font-awesome-icon icon="right-to-bracket" class="text-lg" /> Masuk Sistem
                    </span>
                    <span v-else class="flex items-center gap-2">
                        <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Memproses...
                    </span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useSwal } from '@/plugins/sweetalert'

const router = useRouter()
const authStore = useAuthStore()
const { toastSuccess, error: swalError } = useSwal()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const bgElements = [
    { id: 1, symbol: '∑', top: '5%', left: '3%', fontSize: '6rem', rotate: -15 },
    { id: 2, symbol: '∫', top: '8%', right: '8%', fontSize: '6rem', rotate: 10 },
    { id: 3, symbol: '∞', top: '20%', left: '50%', fontSize: '4rem', rotate: -5 },
    { id: 4, symbol: 'π', top: '70%', left: '10%', fontSize: '5rem', rotate: 25 },
    { id: 5, symbol: '√', top: '80%', right: '5%', fontSize: '6rem', rotate: -20 },
]

const handleLogin = async () => {
    if (!username.value.trim() || !password.value.trim()) {
        swalError('Lengkapi Data', 'Username dan password wajib diisi.')
        return
    }
    const result = await authStore.login(username.value.trim(), password.value)
    if (result.success) {
        toastSuccess(`Selamat datang, ${authStore.userName}!`)
        setTimeout(() => router.push('/dashboard'), 800)
    } else {
        swalError('Login Gagal', result.message || 'Periksa username dan password.')
    }
}
</script>

<style scoped>
/* ─── Custom Styles (Tailwind v4 compatible) ─── */
.btn-login {
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #1e0a2d;
    position: relative;
    overflow: hidden;
}

.btn-login:hover:not(:disabled) {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
    transform: translateY(-2px);
}

.btn-login::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
}

.btn-login:hover:not(:disabled)::before {
    opacity: 1;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes pulseSlow {

    0%,
    100% {
        box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
    }

    50% {
        box-shadow: 0 0 40px rgba(251, 191, 36, 0.6);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.6s ease-out;
}

.animate-pulseSlow {
    animation: pulseSlow 3s ease-in-out infinite;
}
</style>
