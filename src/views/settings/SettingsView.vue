<template>
    <div>
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
            <div>
                <h1 class="text-3xl md:text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                    <span
                        class="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                        <font-awesome-icon icon="gears" class="text-brand-gold text-lg" />
                    </span>
                    Pengaturan Sistem
                </h1>
                <p class="text-gray-400 text-sm mt-2 ml-13">Konfigurasi aplikasi & identitas sekolah</p>
            </div>

            <!-- Tombol: Kiri di HP, Kanan di Desktop -->
            <button class="btn-gold-premium group self-start md:self-auto" @click="handleSave" :disabled="saving">
                <span class="btn-gold-icon">
                    <font-awesome-icon :icon="saving ? 'spinner' : 'save'" :class="{ 'animate-spin': saving }"
                        class="text-sm" />
                </span>
                <span>{{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
            </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-20">
            <div class="loading-spinner-premium">
                <div class="spinner-ring"></div>
                <div class="spinner-ring-reverse"></div>
                <font-awesome-icon icon="gear" class="text-brand-gold text-2xl z-10 animate-pulse" />
            </div>
        </div>

        <!-- Form -->
        <div v-else class="glass-card p-6 md:p-8">
            <div class="space-y-8">

                <!-- Group 1: Identitas Aplikasi -->
                <div>
                    <h4 class="section-title">
                        <font-awesome-icon icon="mobile-screen" class="mr-2" />Identitas Aplikasi
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">Nama Aplikasi</label>
                            <input v-model="form.APP_NAME" class="input-dark w-full" />
                        </div>
                        <div>
                            <label class="form-label">Institusi</label>
                            <input v-model="form.INSTITUSI" class="input-dark w-full" />
                        </div>
                    </div>
                </div>

                <!-- Group 2: Data Sekolah -->
                <div>
                    <h4 class="section-title">
                        <font-awesome-icon icon="school" class="mr-2" />Data Sekolah
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="form-label">Nama Sekolah</label>
                            <input v-model="form.NAMA_SEKOLAH" class="input-dark w-full" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="form-label">Alamat Sekolah</label>
                            <textarea v-model="form.ALAMAT_SEKOLAH" rows="2" class="input-dark w-full"></textarea>
                        </div>
                        <div>
                            <label class="form-label">Nama Kepala Sekolah</label>
                            <input v-model="form.NAMA_KEPALA_SEKOLAH" class="input-dark w-full" />
                        </div>
                        <div>
                            <label class="form-label">NIP Kepala Sekolah</label>
                            <input v-model="form.NIP_KEPALA_SEKOLAH" class="input-dark w-full" />
                        </div>
                        <div>
                            <label class="form-label">Nama Guru</label>
                            <input v-model="form.NAMA_GURU" class="input-dark w-full" />
                        </div>
                        <div>
                            <label class="form-label">NIP Guru</label>
                            <input v-model="form.NIP_GURU" class="input-dark w-full" />
                        </div>
                    </div>
                </div>

                <!-- Group 3: Akademik -->
                <div>
                    <h4 class="section-title">
                        <font-awesome-icon icon="calendar-alt" class="mr-2" />Akademik
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">Tahun Ajaran Aktif</label>
                            <input v-model="form.TAHUN_AJARAN_AKTIF" class="input-dark w-full"
                                placeholder="2026/2027" />
                        </div>
                        <div>
                            <label class="form-label">Daftar Semester</label>
                            <select v-model="form.DAFTAR_SEMESTER" class="input-dark w-full">
                                <option value="Ganjil">Ganjil</option>
                                <option value="Genap">Genap</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Group 4: Logo & TTD -->
                <div>
                    <h4 class="section-title">
                        <font-awesome-icon icon="image" class="mr-2" />Logo & Tanda Tangan
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <label class="form-label text-center">Logo Institusi</label>
                            <div class="preview-box">
                                <img v-if="form.LOGO_INSTITUSI" :src="form.LOGO_INSTITUSI"
                                    class="max-w-full max-h-full object-contain" referrerpolicy="no-referrer"
                                    crossorigin="anonymous" @error="form.LOGO_INSTITUSI = ''" />
                                <font-awesome-icon v-else icon="building-columns" class="text-gray-600 text-3xl" />
                            </div>
                            <input v-model="form.LOGO_INSTITUSI" class="input-dark w-full text-xs mt-2"
                                placeholder="URL Logo" />
                        </div>

                        <div class="text-center">
                            <label class="form-label text-center">Logo Sekolah</label>
                            <div class="preview-box">
                                <img v-if="form.LOGO_SEKOLAH" :src="form.LOGO_SEKOLAH"
                                    class="max-w-full max-h-full object-contain" referrerpolicy="no-referrer"
                                    crossorigin="anonymous" @error="form.LOGO_SEKOLAH = ''" />
                                <font-awesome-icon v-else icon="school" class="text-gray-600 text-3xl" />
                            </div>
                            <input v-model="form.LOGO_SEKOLAH" class="input-dark w-full text-xs mt-2"
                                placeholder="URL Logo" />
                        </div>

                        <div class="text-center">
                            <label class="form-label text-center">TTD Kepala Sekolah</label>
                            <div class="preview-box">
                                <img v-if="form.GAMBAR_TTD_KEPSEK" :src="form.GAMBAR_TTD_KEPSEK"
                                    class="max-w-full max-h-full object-contain" referrerpolicy="no-referrer"
                                    crossorigin="anonymous" @error="form.GAMBAR_TTD_KEPSEK = ''" />
                                <font-awesome-icon v-else icon="signature" class="text-gray-600 text-3xl" />
                            </div>
                            <input v-model="form.GAMBAR_TTD_KEPSEK" class="input-dark w-full text-xs mt-2"
                                placeholder="URL TTD" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { useSwal } from '@/plugins/sweetalert'

const { settings, isLoading, loadSettings, saveSettings } = useSettings()
const { successPremium, errorPremium, loading, closeLoading } = useSwal()

const saving = ref(false)

const form = reactive({
    APP_NAME: 'SIGMA',
    INSTITUSI: '',
    NAMA_SEKOLAH: '',
    ALAMAT_SEKOLAH: '',
    NAMA_KEPALA_SEKOLAH: '',
    NIP_KEPALA_SEKOLAH: '',
    NAMA_GURU: '',
    NIP_GURU: '',
    LOGO_INSTITUSI: '',
    LOGO_SEKOLAH: '',
    TAHUN_AJARAN_AKTIF: '',
    DAFTAR_SEMESTER: 'Ganjil',
    GAMBAR_TTD_KEPSEK: '',
})

onMounted(async () => {
    await loadSettings()
    // Copy settings ke form
    Object.assign(form, settings.value)
})

const handleSave = async () => {
    saving.value = true
    loading('Menyimpan pengaturan...')

    try {
        await saveSettings({ ...form })
        closeLoading()
        successPremium('Berhasil!', 'Pengaturan sistem berhasil disimpan.')
    } catch (err: any) {
        closeLoading()
        errorPremium('Gagal!', err.message || 'Terjadi kesalahan.')
    } finally {
        saving.value = false
    }
}
</script>

<style scoped>
.section-title {
    color: #fbbf24;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
}

.form-label {
    color: #fbbf24;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 0.5rem;
}

.preview-box {
    width: 96px;
    height: 96px;
    margin: 0 auto;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.btn-gold-premium {
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #1e0a2d;
    font-weight: 700;
    border-radius: 0.75rem;
    padding: 0.6rem 1.5rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
}

.btn-gold-premium:hover:not(:disabled) {
    box-shadow: 0 0 25px rgba(251, 191, 36, 0.5);
    transform: translateY(-2px);
}

.btn-gold-premium:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-gold-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-dark {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(107, 33, 168, 0.6);
    color: white;
    border-radius: 0.75rem;
    padding: 0.6rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.3s;
}

.input-dark:focus {
    border-color: #fbbf24;
    box-shadow: 0 0 12px rgba(251, 191, 36, 0.3);
}

.glass-card {
    background: rgba(20, 5, 35, 0.4);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border-radius: 1.5rem;
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
</style>
