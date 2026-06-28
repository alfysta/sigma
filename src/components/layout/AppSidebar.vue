<template>
    <Transition name="overlay-fade">
        <div v-if="isMobileOpen" class="fixed inset-0 bg-black/50 z-40 md:hidden" @click="closeSidebar"></div>
    </Transition>


    <!-- Logo Section -->

    <aside :class="[
        'w-72 flex flex-col h-full custom-scrollbar flex-shrink-0 transition-transform duration-300 ease-in-out z-50',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
        'fixed md:sticky top-0 left-0 h-screen'
    ]"
        style="background: rgba(15, 0, 26, 0.9); backdrop-filter: blur(20px); border-right: 1px solid rgba(251, 191, 36, 0.15);">
        <!-- Logo -->
        <div class="p-6 flex items-center justify-between border-b border-white/5">
            <div class="flex items-center gap-3">
                <div
                    class="relative inline-flex w-8 h-8 rounded-full bg-gradient-to-br from-[#0a0015] via-[#5c164e] to-[#0a0015] border-[1.5px] border-[#d4af37]/70 items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)] icon-pulse-slow group overflow-hidden cursor-pointer">
                    <svg viewBox="40 30 90 120" fill="none" class="w-4 h-auto">
                        <path
                            d="M 50 40 L 120 40 L 120 55 L 75 55 L 105 90 L 75 125 L 120 125 L 120 140 L 50 140 L 85 90 Z"
                            fill="#D4AF37" />
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gold-gradient">SIGMA</h2>
            </div>
            <button class="md:hidden text-brand-gold hover:text-white transition" @click="closeSidebar">
                <font-awesome-icon icon="times" class="text-2xl" />
            </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            <template v-for="menu in menus" :key="menu.id">

                <!-- ========== MENU DENGAN SUBMENU ========== -->
                <div v-if="menu.submenu" class="relative">
                    <!-- Parent: TIDAK PAKAI BACKGROUND, hanya icon chevron yang berubah -->
                    <a href="#"
                        class="menu-item flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300 text-gray-300 hover:bg-white/5 hover:text-white"
                        @click.prevent="toggleSubmenu(menu.id)">
                        <div class="flex items-center gap-3">
                            <font-awesome-icon :icon="menu.icon" class="w-6 text-center text-lg" />
                            <span>{{ menu.text }}</span>
                        </div>
                        <font-awesome-icon icon="chevron-down"
                            class="text-xs transition-transform duration-300 ease-in-out"
                            :style="{ transform: isSubmenuOpen(menu.id) ? 'rotate(180deg)' : 'rotate(0deg)' }" />
                    </a>

                    <!-- Submenu dengan animasi smooth -->
                    <div class="submenu-wrapper" :class="{ 'submenu-open': isSubmenuOpen(menu.id) }">
                        <div class="submenu-inner">
                            <a v-for="sub in menu.submenu" :key="sub.id" href="#"
                                class="menu-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-300 pl-11 my-1"
                                :class="activeView === sub.id
                                    ? 'bg-brand-main/60 text-brand-gold shadow-lg border-r-4 border-brand-gold'
                                    : 'text-gray-300 hover:bg-white/5'" @click.prevent="navigateTo(sub.id)">
                                <font-awesome-icon :icon="sub.icon" class="text-center text-lg" />
                                <span>{{ sub.text }}</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- ========== MENU TUNGGAL (TANPA SUBMENU) ========== -->
                <a v-else href="#"
                    class="menu-item flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300"
                    :class="activeView === menu.id
                        ? 'bg-brand-main/60 text-brand-gold shadow-lg border-r-4 border-brand-gold'
                        : 'text-gray-300 hover:bg-white/5'" @click.prevent="navigateTo(menu.id)">
                    <font-awesome-icon :icon="menu.icon" class="w-6 text-center text-lg" />
                    <span>{{ menu.text }}</span>
                </a>

            </template>
        </nav>

        <!-- Footer -->
        <div class="p-4 text-center text-[10px] text-gray-500 border-t border-white/5">
            Aplikasi ini dibuat oleh <br>
            <span class="text-brand-gold font-bold">Fendi A. Fauzi &copy; 2026</span>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isMobileOpen = ref(false)
const openSubmenus = ref<string[]>([])
const activeView = ref('dashboard')

const guruMenus = [
    { id: 'dashboard', icon: 'chart-pie', text: 'Dashboard' },
    {
        id: 'master', icon: 'chart-simple', text: 'Data Master',
        submenu: [
            { id: 'siswa', icon: 'users', text: 'Data Siswa' },
            { id: 'cetak_kartu', icon: 'id-card', text: 'Cetak Kartu Siswa' },
            { id: 'gtk', icon: 'person-chalkboard', text: 'Data GTK' },
            { id: 'kelas', icon: 'chalkboard', text: 'Kelas' },
            { id: 'mapel', icon: 'book', text: 'Mata Pelajaran' },
        ],
    },
    { id: 'absensi', icon: 'calendar-check', text: 'Kehadiran' },
    { id: 'jurnal', icon: 'book-journal-whills', text: 'Jurnal Mengajar' },
    {
        id: 'penjadwalan', icon: 'table-cells', text: 'Penjadwalan Sekolah',
        submenu: [
            { id: 'kalender', icon: 'calendar-alt', text: 'Kalender Akademik' },
            { id: 'scheduling', icon: 'calendar-plus', text: 'Penjadwalan Otomatis' },
            { id: 'jadwal', icon: 'calendar-check', text: 'Jadwal Pelajaran' },
        ],
    },
    {
        id: 'lms', icon: 'microscope', text: 'LMS',
        submenu: [
            { id: 'materi', icon: 'book-open', text: 'Materi Pembelajaran' },
            { id: 'ujian', icon: 'pen-to-square', text: 'Ujian Online' },
            { id: 'analisis', icon: 'square-poll-vertical', text: 'Analisis Ujian' },
        ],
    },
    {
        id: 'nilai', icon: 'chart-line', text: 'Penilaian',
        submenu: [
            { id: 'daftar_tugas', icon: 'list-check', text: 'Daftar Tugas' },
            { id: 'periksa_tugas', icon: 'clipboard-check', text: 'Pemeriksaan Tugas' },
            { id: 'nilai_tugas', icon: 'envelope-open-text', text: 'Nilai Tugas' },
            { id: 'nilai_uh', icon: 'file-signature', text: 'Nilai Ulangan' },
            { id: 'nilai_us', icon: 'file-pen', text: 'Ujian Semester' },
            { id: 'rapor', icon: 'laptop-file', text: 'Nilai Rapor' },
            { id: 'leaderboard', icon: 'trophy', text: 'Leaderboard' },
        ],
    },
    { id: 'pembinaan', icon: 'handshake-angle', text: 'Pembinaan Wali' },
    { id: 'kenaikan', icon: 'arrow-up', text: 'Kenaikan Kelas' },
    {
        id: 'setting', icon: 'cog', text: 'Pengaturan',
        submenu: [
            { id: 'users', icon: 'users-gear', text: 'Manajemen User' },
            { id: 'profile', icon: 'user-circle', text: 'Profil Saya' },
            { id: 'settings', icon: 'gears', text: 'Pengaturan Sistem' },
            { id: 'pengumuman', icon: 'bullhorn', text: 'Pengumuman' },
            { id: 'log', icon: 'history', text: 'Log Aktivitas' },
        ],
    },
    { id: 'backup', icon: 'database', text: 'Backup & Restore' },
]

const siswaMenus = [
    { id: 'dashboard', icon: 'chart-pie', text: 'Dashboard' },
    { id: 'absensi', icon: 'calendar-check', text: 'Kehadiran' },
    { id: 'materi', icon: 'book-open', text: 'Materi Pembelajaran' },
    { id: 'kumpul_tugas', icon: 'upload', text: 'Daftar Tugas' },
    { id: 'nilai_tugas', icon: 'star', text: 'Nilai Tugas' },
    { id: 'nilai_uh', icon: 'file-signature', text: 'Nilai Ulangan' },
    { id: 'nilai_us', icon: 'file-lines', text: 'Ujian Semester' },
    { id: 'rapor', icon: 'award', text: 'Nilai Rapor' },
    { id: 'profile', icon: 'user-circle', text: 'Profil Saya' },
]

const menus = computed(() => authStore.isSiswa ? siswaMenus : guruMenus)

const isSubmenuOpen = (id: string) => openSubmenus.value.includes(id)

// 🔥 TOGGLE SUBMENU: Hanya collapse kalau klik menu DENGAN submenu
const toggleSubmenu = (id: string) => {
    const isCurrentlyOpen = openSubmenus.value.includes(id)

    // Tutup SEMUA submenu
    openSubmenus.value = []

    // Buka yang diklik (kalau sebelumnya tidak terbuka)
    if (!isCurrentlyOpen) {
        openSubmenus.value.push(id)
    }
}

// 🔥 NAVIGATE: Tidak menutup submenu saat klik menu TUNGGAL
const navigateTo = (viewId: string) => {
    activeView.value = viewId
    if (window.innerWidth < 768) closeSidebar()

    const routeMap: Record<string, string> = {
        dashboard: 'dashboard', siswa: 'siswa', cetak_kartu: 'cetak-kartu', gtk: 'gtk',
        kelas: 'kelas', mapel: 'mapel', absensi: 'absensi', jadwal: 'jadwal',
        users: 'users', profile: 'profile', settings: 'settings',
        pengumuman: 'pengumuman', log: 'log', backup: 'backup',
    }
    const routeName = routeMap[viewId]
    if (routeName) router.push({ name: routeName })
}

const closeSidebar = () => { isMobileOpen.value = false }
const toggle = () => { if (window.innerWidth < 768) isMobileOpen.value = !isMobileOpen.value }

const handleKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSidebar() }
const handleResize = () => { if (window.innerWidth >= 768) isMobileOpen.value = false }

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('resize', handleResize)
})

defineExpose({ toggle })

watch(
    () => route.name,
    (newRouteName) => {
        if (newRouteName && typeof newRouteName === 'string') {
            const reverseMap: Record<string, string> = {
                dashboard: 'dashboard',
                siswa: 'siswa',
                gtk: 'gtk',
                kelas: 'kelas',
                mapel: 'mapel',
                absensi: 'absensi',
                jadwal: 'jadwal',
                users: 'users',
                profile: 'profile',
                settings: 'settings',
                pengumuman: 'pengumuman',
                log: 'log',
                backup: 'backup',
            }
            const viewId = reverseMap[newRouteName]
            if (viewId) {
                activeView.value = viewId
            }
        }
    },
    { immediate: true }
)
</script>

<style scoped>
/* ═══════════════════════════════════════════
   SUBMENU ANIMATION - SMOOTH
   ═══════════════════════════════════════════ */
.submenu-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s ease-in-out;
    overflow: hidden;
}

.submenu-wrapper.submenu-open {
    grid-template-rows: 1fr;
}

.submenu-inner {
    min-height: 0;
}

/* ═══════════════════════════════════════════
   OVERLAY
   ═══════════════════════════════════════════ */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0;
}
</style>
