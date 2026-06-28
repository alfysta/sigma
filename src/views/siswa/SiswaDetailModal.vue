<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div class="detail-overlay" @click.self="close">
                <Transition name="modal-scale">
                    <div v-if="visible" class="detail-card">
                        <!-- Close Button -->
                        <button @click="close" class="detail-close-btn">
                            <font-awesome-icon icon="times" />
                        </button>

                        <!-- Hero Photo Section -->
                        <div class="detail-hero">
                            <div class="detail-hero-bg"></div>
                            <div class="detail-photo-wrapper">
                                <div class="detail-photo-ring"></div>
                                <img :src="siswa.Foto_URL || `https://ui-avatars.com/api/?name=${encodeURIComponent(siswa.Nama_Siswa || 'S')}&size=200&background=fbbf24&color=1e0a2d&bold=true&font-size=0.4&length=2`"
                                    class="detail-photo" referrerpolicy="no-referrer" crossorigin="anonymous"
                                    @error="(e) => (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(siswa.Nama_Siswa || 'S')}&size=200&background=fbbf24&color=1e0a2d&bold=true`" />
                            </div>
                            <div class="detail-hero-info">
                                <h2 class="detail-name">{{ siswa.Nama_Siswa || 'Tanpa Nama' }}</h2>
                                <div class="detail-badges">
                                    <span class="detail-badge detail-badge-class">
                                        <font-awesome-icon icon="school" class="text-[10px]" />
                                        {{ siswa.Kelas || '-' }}
                                    </span>
                                    <span class="detail-badge detail-badge-nisn">
                                        <font-awesome-icon icon="fingerprint" class="text-[10px]" />
                                        {{ siswa.NISN || '-' }}
                                    </span>
                                    <span class="detail-badge"
                                        :class="siswa.Jenis_Kelamin === 'Laki-laki' ? 'detail-badge-male' : 'detail-badge-female'">
                                        <font-awesome-icon
                                            :icon="siswa.Jenis_Kelamin === 'Laki-laki' ? 'mars' : 'venus'"
                                            class="text-[10px]" />
                                        {{ siswa.Jenis_Kelamin || '-' }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Info Grid -->
                        <div class="detail-body">
                            <div class="detail-grid">
                                <!-- NIS -->
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                                        <font-awesome-icon icon="id-card" />
                                    </div>
                                    <div class="detail-info-content">
                                        <span class="detail-info-label">NIS</span>
                                        <span class="detail-info-value">{{ siswa.NIS || '-' }}</span>
                                    </div>
                                </div>

                                <!-- Agama -->
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-amber-500/10 text-amber-400 border-amber-500/20">
                                        <font-awesome-icon icon="star" />
                                    </div>
                                    <div class="detail-info-content">
                                        <span class="detail-info-label">Agama</span>
                                        <span class="detail-info-value">{{ siswa.Agama || '-' }}</span>
                                    </div>
                                </div>

                                <!-- Tempat, Tanggal Lahir -->
                                <div class="detail-info-card detail-info-full">
                                    <div
                                        class="detail-info-icon bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                        <font-awesome-icon icon="cake-candles" />
                                    </div>
                                    <div class="detail-info-content">
                                        <span class="detail-info-label">Tempat, Tanggal Lahir</span>
                                        <span class="detail-info-value">{{ siswa.Tempat_Lahir || '-' }}, {{
                                            formatDate(siswa.Tanggal_Lahir) }}</span>
                                    </div>
                                </div>

                                <!-- Alamat -->
                                <div class="detail-info-card detail-info-full">
                                    <div class="detail-info-icon bg-rose-500/10 text-rose-400 border-rose-500/20">
                                        <font-awesome-icon icon="map-location-dot" />
                                    </div>
                                    <div class="detail-info-content">
                                        <span class="detail-info-label">Alamat</span>
                                        <span class="detail-info-value">{{ siswa.Alamat || '-' }}</span>
                                    </div>
                                </div>

                                <!-- Tahun Ajaran -->
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                                        <font-awesome-icon icon="calendar" />
                                    </div>
                                    <div class="detail-info-content">
                                        <span class="detail-info-label">Tahun Ajaran</span>
                                        <span class="detail-info-value">{{ siswa.Tahun_Ajaran || '-' }}</span>
                                    </div>
                                </div>

                                <!-- Tahun Masuk -->
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-purple-500/10 text-purple-400 border-purple-500/20">
                                        <font-awesome-icon icon="door-open" />
                                    </div>
                                    <div class="detail-info-content">
                                        <span class="detail-info-label">Tahun Masuk</span>
                                        <span class="detail-info-value">{{ siswa.Tahun_Masuk || '-' }}</span>
                                    </div>
                                </div>

                                <!-- Keterangan -->
                                <div class="detail-info-card detail-info-full">
                                    <div class="detail-info-icon bg-orange-500/10 text-orange-400 border-orange-500/20">
                                        <font-awesome-icon icon="note-sticky" />
                                    </div>
                                    <div class="detail-info-content">
                                        <span class="detail-info-label">Keterangan</span>
                                        <span class="detail-info-value">{{ siswa.Keterangan || 'Aktif' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="detail-footer">
                            <span class="detail-footer-text">SIGMA • Sistem Informasi Guru & Manajemen Akademik</span>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ siswa: any }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const visible = ref(false)

onMounted(() => {
    requestAnimationFrame(() => { visible.value = true })
})

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    try {
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return dateStr
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch { return dateStr }
}

const close = () => {
    visible.value = false
    setTimeout(() => emit('close'), 300)
}
</script>

<style scoped>
/* ═══════════════════════════════════════════
   OVERLAY
   ═══════════════════════════════════════════ */
.detail-overlay {
    position: fixed;
    inset: 0;
    z-index: 110;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
}

/* ═══════════════════════════════════════════
   CARD
   ═══════════════════════════════════════════ */
.detail-card {
    position: relative;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE */
    border-radius: 2rem;
    background: linear-gradient(180deg, #1a0a2e 0%, #0f0018 100%);
    border: 1px solid rgba(251, 191, 36, 0.15);
    box-shadow:
        0 0 100px rgba(147, 51, 234, 0.2),
        0 30px 60px rgba(0, 0, 0, 0.6);
}

.detail-card::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari */
}

/* ═══════════════════════════════════════════
   CLOSE BUTTON
   ═══════════════════════════════════════════ */
.detail-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.3s;
}

.detail-close-btn:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.5);
}

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */
.detail-hero {
    position: relative;
    padding: 2.5rem 2rem 2rem;
    text-align: center;
    overflow: hidden;
}

.detail-hero-bg {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent 70%);
    pointer-events: none;
}

.detail-photo-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 1.25rem;
}

.detail-photo-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid rgba(251, 191, 36, 0.3);
    animation: photoRingPulse 2s ease-in-out infinite;
}

.detail-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(251, 191, 36, 0.5);
    box-shadow: 0 0 30px rgba(251, 191, 36, 0.2);
}

@keyframes photoRingPulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.5;
    }

    50% {
        transform: scale(1.05);
        opacity: 1;
    }
}

.detail-hero-info {
    position: relative;
    z-index: 2;
}

.detail-name {
    font-size: 1.25rem;
    font-weight: 800;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.75rem;
}

.detail-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
}

.detail-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.75rem;
    border-radius: 2rem;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid;
}

.detail-badge-class {
    background: rgba(147, 51, 234, 0.15);
    color: #c084fc;
    border-color: rgba(147, 51, 234, 0.3);
}

.detail-badge-nisn {
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
    border-color: rgba(251, 191, 36, 0.3);
}

.detail-badge-male {
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    border-color: rgba(59, 130, 246, 0.3);
}

.detail-badge-female {
    background: rgba(236, 72, 153, 0.15);
    color: #f472b6;
    border-color: rgba(236, 72, 153, 0.3);
}

/* ═══════════════════════════════════════════
   BODY / GRID
   ═══════════════════════════════════════════ */
.detail-body {
    padding: 1rem 1.5rem 0.5rem;
}

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

/* ═══════════════════════════════════════════
   INFO CARD
   ═══════════════════════════════════════════ */
.detail-info-card {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    transition: all 0.3s;
}

.detail-info-card:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
}

.detail-info-full {
    grid-column: 1 / -1;
}

.detail-info-icon {
    width: 40px;
    height: 40px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1rem;
    border: 1px solid;
}

.detail-info-content {
    flex: 1;
    min-width: 0;
}

.detail-info-label {
    display: block;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7280;
    margin-bottom: 0.2rem;
}

.detail-info-value {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #e5e7eb;
    word-break: break-word;
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
.detail-footer {
    padding: 1rem 1.5rem;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.03);
}

.detail-footer-text {
    font-size: 0.6rem;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 500;
}

/* ═══════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════ */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-scale-enter-active {
    transition: all 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.modal-scale-leave-active {
    transition: all 0.25s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.modal-scale-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
}

.modal-scale-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}

/* Scrollbar */
.detail-card::-webkit-scrollbar {
    width: 4px;
}

.detail-card::-webkit-scrollbar-track {
    background: transparent;
}

.detail-card::-webkit-scrollbar-thumb {
    background: rgba(251, 191, 36, 0.2);
    border-radius: 10px;
}
</style>
