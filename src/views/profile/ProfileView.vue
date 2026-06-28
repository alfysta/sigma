<template>
    <div>
        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-20">
            <div class="loading-spinner-premium">
                <div class="spinner-ring"></div>
                <div class="spinner-ring-reverse"></div>
                <font-awesome-icon icon="user-gear" class="text-brand-gold text-2xl z-10 animate-pulse" />
            </div>
        </div>

        <!-- Error -->
        <div v-else-if="errorMsg" class="text-center py-20 text-red-400">
            <font-awesome-icon icon="triangle-exclamation" class="text-4xl mb-3" />
            <p>{{ errorMsg }}</p>
        </div>

        <!-- Profile -->
        <div v-else-if="profile" class="max-w-full mx-auto space-y-6 animate-fadeIn">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-2 text-left gap-4">
                <div class="space-y-0.5">
                    <div class="flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span class="text-amber-500 font-black text-[9px] uppercase tracking-widest">SIGMATRIKS DIGITAL
                            CORE</span>
                    </div>
                    <h2 class="text-2xl font-black text-white tracking-tight flex items-center">
                        <font-awesome-icon icon="user-shield" class="text-amber-500 mr-3 text-xl" />Kredensial Akun
                    </h2>
                </div>
                <div
                    class="sm:text-right flex sm:flex-col justify-between sm:justify-center border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                    <span class="text-gray-500 text-[9px] uppercase font-black tracking-widest block">Status
                        Otentikasi</span>
                    <span
                        class="text-emerald-400 font-mono text-xs font-black flex items-center sm:justify-end gap-1.5">
                        <font-awesome-icon icon="circle-check" class="text-[11px]" /> Terverifikasi Aman
                    </span>
                </div>
            </div>

            <!-- Card -->
            <div class="profile-card">
                <div
                    class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-500/5 via-yellow-600/0 to-transparent rounded-full blur-3xl pointer-events-none">
                </div>

                <div class="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <!-- Foto -->
                    <div class="relative group flex-shrink-0">
                        <div
                            class="absolute -inset-1 bg-gradient-to-tr from-amber-500 to-zinc-700 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500">
                        </div>
                        <div
                            class="relative w-32 h-44 bg-zinc-950 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                            <img :src="profile.foto || getPlaceholder(profile.nama)" alt="Foto Profil"
                                referrerpolicy="no-referrer" crossorigin="anonymous"
                                class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 w-full space-y-6">
                        <div
                            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5 text-center sm:text-left">
                            <div class="space-y-1">
                                <h3 class="text-2xl font-black text-white tracking-wide uppercase">{{ profile.nama }}
                                </h3>
                                <div
                                    class="flex items-center justify-center sm:justify-start gap-1.5 font-mono text-xs text-gray-500">
                                    <span>Username:</span>
                                    <span class="text-gray-400 font-bold">{{ authStore.user?.Username }}</span>
                                </div>
                            </div>
                            <div class="flex justify-center sm:justify-end">
                                <span class="badge-role">
                                    <font-awesome-icon icon="crown" class="mr-1" /> {{ profile.role }}
                                </span>
                            </div>
                        </div>

                        <!-- Siswa Fields -->
                        <div v-if="profile.role === 'Siswa'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="info-card"><span class="info-label">NISN</span><span
                                    class="info-value"><font-awesome-icon icon="fingerprint"
                                        class="text-amber-500/70 text-xs mr-2" />{{ profile.identitas }}</span></div>
                            <div class="info-card"><span class="info-label">Kelas</span><span
                                    class="badge-kelas"><font-awesome-icon icon="school" class="mr-1.5 text-[10px]" />{{
                                        profile.kelas || '-' }}</span></div>
                            <div class="info-card"><span class="info-label">TTL</span><span
                                    class="info-value"><font-awesome-icon icon="cake-candles"
                                        class="text-gray-600 text-xs mr-2" />{{ profile.ttl }}</span></div>
                            <div class="info-card"><span class="info-label">Jenis Kelamin</span><span
                                    class="info-value"><font-awesome-icon icon="venus-mars"
                                        class="text-gray-600 text-xs mr-2" />{{ profile.jk }}</span></div>
                            <div class="info-card sm:col-span-2"><span class="info-label">Alamat</span><span
                                    class="info-value"><font-awesome-icon icon="map-location-dot"
                                        class="text-gray-600 text-xs mr-2" />{{ profile.alamat }}</span></div>
                        </div>

                        <!-- Guru Fields -->
                        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div class="info-card"><span class="info-label">NIP</span><span
                                    class="info-value"><font-awesome-icon icon="id-card"
                                        class="text-amber-500/70 text-xs mr-2" />{{ profile.identitas }}</span></div>
                            <div class="info-card"><span class="info-label">NUPTK</span><span class="info-value">{{
                                profile.nuptk }}</span></div>
                            <div class="info-card"><span class="info-label">Status Kepegawaian</span><span
                                    class="badge-status">{{ profile.statusKepegawaian }}</span></div>
                            <div class="info-card"><span class="info-label">TTL</span><span class="info-value">{{
                                profile.tempatLahir }}, {{ profile.tanggalLahir }}</span></div>
                            <div class="info-card"><span class="info-label">Email</span><span
                                    class="info-value"><font-awesome-icon icon="envelope"
                                        class="text-gray-600 mr-2" />{{ profile.email }}</span></div>
                            <div class="info-card"><span class="info-label">Jenis Kelamin</span><span
                                    class="info-value"><font-awesome-icon icon="venus-mars"
                                        class="text-gray-600 text-xs mr-2" />{{ profile.jk }}</span></div>
                            <div class="info-card"><span class="info-label">Jenis PTK</span><span
                                    class="info-value"><font-awesome-icon icon="person-chalkboard"
                                        class="text-gray-600 text-xs mr-2" />{{ profile.jenisPTK }}</span></div>
                            <div class="info-card"><span class="info-label">Agama</span><span class="info-value">{{
                                profile.agama }}</span></div>
                            <div class="info-card"><span class="info-label">HP</span><span
                                    class="info-value"><font-awesome-icon icon="phone"
                                        class="text-gray-600 text-xs mr-2" />{{ profile.hp }}</span></div>
                            <div class="info-card sm:col-span-2 md:col-span-3"><span
                                    class="info-label">Alamat</span><span class="info-value"><font-awesome-icon
                                        icon="map-location-dot" class="text-gray-600 text-xs mr-2" />{{ profile.alamat
                                        }}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { useAuthStore } from '@/stores/authStore'

const { profile, isLoading, loadProfile, getPlaceholder } = useProfile()
const authStore = useAuthStore()
const errorMsg = ref('')

onMounted(async () => {
    try {
        await loadProfile()
    } catch (err: any) {
        errorMsg.value = err.message || 'Gagal memuat profile'
    }
})
</script>

<style scoped>
.profile-card {
    background: rgba(20, 5, 35, 0.4);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 1.5rem;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

.info-card {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.info-label {
    color: #6b7280;
    font-size: 0.55rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 0.25rem;
}

.info-value {
    color: #e5e7eb;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
}

.badge-role {
    display: inline-block;
    background: linear-gradient(to right, #f59e0b, #d97706);
    color: #1e0a2d;
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
}

.badge-kelas {
    display: inline-flex;
    align-items: center;
    background: rgba(245, 158, 11, 0.1);
    color: #fbbf24;
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-status {
    display: inline-flex;
    align-items: center;
    background: rgba(16, 185, 129, 0.1);
    color: #34d399;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(16, 185, 129, 0.2);
}

.loading-spinner-premium {
    position: relative;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #fbbf24;
    animation: spin 1s linear infinite;
}

.spinner-ring-reverse {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-bottom-color: #a855f7;
    animation: spin 0.7s linear infinite reverse;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
