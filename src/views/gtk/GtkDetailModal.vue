<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div class="detail-overlay" @click.self="close">
                <Transition name="modal-scale">
                    <div v-if="visible" class="detail-card">
                        <button @click="close" class="detail-close-btn"><font-awesome-icon icon="times" /></button>

                        <div class="detail-hero">
                            <div class="detail-hero-bg"></div>
                            <div class="detail-photo-wrapper">
                                <div class="detail-photo-ring"></div>
                                <img :src="gtk.Foto_Guru || `https://ui-avatars.com/api/?name=${encodeURIComponent(gtk.Nama || 'G')}&size=200&background=fbbf24&color=1e0a2d&bold=true`"
                                    class="detail-photo" referrerpolicy="no-referrer" crossorigin="anonymous" />
                            </div>
                            <div class="detail-hero-info">
                                <h2 class="detail-name">{{ gtk.Nama || '-' }}</h2>
                                <div class="detail-badges">
                                    <span class="detail-badge detail-badge-class"><font-awesome-icon icon="briefcase"
                                            class="text-[10px]" />{{ gtk.Jenis_PTK || '-' }}</span>
                                    <span class="detail-badge detail-badge-nisn"><font-awesome-icon icon="fingerprint"
                                            class="text-[10px]" />{{ gtk.NIP || '-' }}</span>
                                    <span class="detail-badge"
                                        :class="gtk.JK === 'L' ? 'detail-badge-male' : 'detail-badge-female'"><font-awesome-icon
                                            :icon="gtk.JK === 'L' ? 'mars' : 'venus'" class="text-[10px]" />{{ gtk.JK
                                                === 'L' ? 'Laki-laki' : 'Perempuan' }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-body">
                            <div class="detail-grid">
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-indigo-500/10 text-indigo-400"><font-awesome-icon
                                            icon="id-card" /></div>
                                    <div class="detail-info-content"><span class="detail-info-label">NUPTK</span><span
                                            class="detail-info-value">{{ gtk.NUPTK || '-' }}</span></div>
                                </div>
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-amber-500/10 text-amber-400"><font-awesome-icon
                                            icon="star" /></div>
                                    <div class="detail-info-content"><span class="detail-info-label">Agama</span><span
                                            class="detail-info-value">{{ gtk.Agama || '-' }}</span></div>
                                </div>
                                <div class="detail-info-card detail-info-full">
                                    <div class="detail-info-icon bg-emerald-500/10 text-emerald-400"><font-awesome-icon
                                            icon="cake-candles" /></div>
                                    <div class="detail-info-content"><span class="detail-info-label">Tempat, Tgl
                                            Lahir</span><span class="detail-info-value">{{ gtk.Tempat_Lahir || '-' }},
                                            {{ gtk.Tanggal_Lahir || '-' }}</span></div>
                                </div>
                                <div class="detail-info-card detail-info-full">
                                    <div class="detail-info-icon bg-rose-500/10 text-rose-400"><font-awesome-icon
                                            icon="map-location-dot" /></div>
                                    <div class="detail-info-content"><span class="detail-info-label">Alamat</span><span
                                            class="detail-info-value">{{ gtk.Alamat_Jalan || '-' }}, RT {{ gtk.RT || '-'
                                            }}/RW {{ gtk.RW || '-' }}, {{ gtk.Desa || '-' }}</span></div>
                                </div>
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-cyan-500/10 text-cyan-400"><font-awesome-icon
                                            icon="phone" /></div>
                                    <div class="detail-info-content"><span
                                            class="detail-info-label">Telepon/HP</span><span
                                            class="detail-info-value">{{ gtk.Telepon || '-' }} / {{ gtk.HP || '-'
                                            }}</span></div>
                                </div>
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-purple-500/10 text-purple-400"><font-awesome-icon
                                            icon="envelope" /></div>
                                    <div class="detail-info-content"><span class="detail-info-label">Email</span><span
                                            class="detail-info-value">{{ gtk.Email || '-' }}</span></div>
                                </div>
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-blue-500/10 text-blue-400"><font-awesome-icon
                                            icon="building-columns" /></div>
                                    <div class="detail-info-content"><span class="detail-info-label">Status
                                            Kepegawaian</span><span class="detail-info-value">{{ gtk.Status_Kepegawaian
                                                || '-' }}</span></div>
                                </div>
                                <div class="detail-info-card">
                                    <div class="detail-info-icon bg-orange-500/10 text-orange-400"><font-awesome-icon
                                            icon="layer-group" /></div>
                                    <div class="detail-info-content"><span
                                            class="detail-info-label">Pangkat/Gol</span><span
                                            class="detail-info-value">{{ gtk.Pangkat_Golongan || '-' }}</span></div>
                                </div>
                            </div>
                        </div>
                        <div class="detail-footer"><span class="detail-footer-text">SIGMA • Sistem Informasi Guru &
                                Manajemen Akademik</span></div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
defineProps<{ gtk: any }>()
const emit = defineEmits<{ (e: 'close'): void }>()
const visible = ref(false)
onMounted(() => requestAnimationFrame(() => { visible.value = true }))
const close = () => { visible.value = false; setTimeout(() => emit('close'), 300) }
</script>

<style scoped>
.detail-overlay {
    position: fixed;
    inset: 0;
    z-index: 110;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(0, 0, 0, .85);
    backdrop-filter: blur(8px)
}

.detail-card {
    position: relative;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;
    border-radius: 2rem;
    background: linear-gradient(180deg, #1a0a2e, #0f0018);
    border: 1px solid rgba(251, 191, 36, .15);
    box-shadow: 0 0 100px rgba(147, 51, 234, .2), 0 30px 60px rgba(0, 0, 0, .6)
}

.detail-card::-webkit-scrollbar {
    display: none
}

.detail-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0, 0, 0, .5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, .1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all .3s
}

.detail-close-btn:hover {
    background: rgba(239, 68, 68, .3)
}

.detail-hero {
    position: relative;
    padding: 2.5rem 2rem 2rem;
    text-align: center;
    overflow: hidden
}

.detail-hero-bg {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(147, 51, 234, .3), transparent 70%)
}

.detail-photo-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 1.25rem
}

.detail-photo-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid rgba(251, 191, 36, .3);
    animation: photoRing 2s ease-in-out infinite
}

.detail-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(251, 191, 36, .5);
    box-shadow: 0 0 30px rgba(251, 191, 36, .2)
}

@keyframes photoRing {

    0%,
    100% {
        transform: scale(1);
        opacity: .5
    }

    50% {
        transform: scale(1.05);
        opacity: 1
    }
}

.detail-name {
    font-size: 1.25rem;
    font-weight: 800;
    color: white;
    text-transform: uppercase;
    margin-bottom: .75rem
}

.detail-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: .5rem
}

.detail-badge {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    padding: .3rem .75rem;
    border-radius: 2rem;
    font-size: .7rem;
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid
}

.detail-badge-class {
    background: rgba(147, 51, 234, .15);
    color: #c084fc;
    border-color: rgba(147, 51, 234, .3)
}

.detail-badge-nisn {
    background: rgba(251, 191, 36, .1);
    color: #fbbf24;
    border-color: rgba(251, 191, 36, .3)
}

.detail-badge-male {
    background: rgba(59, 130, 246, .15);
    color: #60a5fa;
    border-color: rgba(59, 130, 246, .3)
}

.detail-badge-female {
    background: rgba(236, 72, 153, .15);
    color: #f472b6;
    border-color: rgba(236, 72, 153, .3)
}

.detail-body {
    padding: 1rem 1.5rem .5rem
}

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .75rem
}

.detail-info-card {
    display: flex;
    align-items: flex-start;
    gap: .75rem;
    padding: 1rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, .02);
    border: 1px solid rgba(255, 255, 255, .04)
}

.detail-info-full {
    grid-column: 1/-1
}

.detail-info-icon {
    width: 40px;
    height: 40px;
    border-radius: .75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1rem;
    border: 1px solid
}

.detail-info-content {
    flex: 1;
    min-width: 0
}

.detail-info-label {
    display: block;
    font-size: .6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #6b7280;
    margin-bottom: .2rem
}

.detail-info-value {
    display: block;
    font-size: .85rem;
    font-weight: 600;
    color: #e5e7eb;
    word-break: break-word
}

.detail-footer {
    padding: 1rem 1.5rem;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, .03)
}

.detail-footer-text {
    font-size: .6rem;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: .2em
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity .3s
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0
}

.modal-scale-enter-active {
    transition: all .35s cubic-bezier(.22, .61, .36, 1)
}

.modal-scale-leave-active {
    transition: all .25s cubic-bezier(.55, .06, .68, .19)
}

.modal-scale-enter-from {
    opacity: 0;
    transform: scale(.9) translateY(20px)
}

.modal-scale-leave-to {
    opacity: 0;
    transform: scale(.95) translateY(10px)
}
</style>
