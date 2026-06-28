<template>
    <Teleport to="body">
        <Transition name="overlay-fade">
            <div v-if="visible" class="modal-overlay-premium" @click.self="close">
                <Transition name="slide-right">
                    <div v-if="visible" class="modal-panel-premium modal-panel-wide">
                        <div class="modal-header-premium">
                            <div class="flex items-center gap-3">
                                <span class="modal-header-icon"><font-awesome-icon :icon="editData ? 'pen' : 'plus'"
                                        class="text-sm" /></span>
                                <div>
                                    <h2 class="text-lg font-bold text-white">{{ editData ? 'Edit GTK' : 'Tambah GTK' }}
                                    </h2>
                                    <p class="text-[10px] text-gray-500 uppercase tracking-wider">{{ editData ?
                                        'Perbarui data' : 'Tambahkan GTK baru' }}</p>
                                </div>
                            </div>
                            <button @click="close" class="modal-close-btn"><font-awesome-icon icon="times"
                                    class="text-lg" /></button>
                        </div>

                        <div class="modal-body-premium">
                            <!-- Group 1: Data Pribadi -->
                            <div class="mb-6">
                                <h4 class="section-title"><font-awesome-icon icon="user" class="mr-2" />Data Pribadi
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div class="md:col-span-2"><label class="form-label">Nama Lengkap</label><input
                                            v-model="form.Nama" class="input-premium w-full" /></div>
                                    <div><label class="form-label">Jenis Kelamin</label><select v-model="form.JK"
                                            class="input-premium w-full">
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select></div>
                                    <div><label class="form-label">Tempat Lahir</label><input
                                            v-model="form.Tempat_Lahir" class="input-premium w-full" /></div>
                                    <div><label class="form-label">Tanggal Lahir</label><input
                                            v-model="form.Tanggal_Lahir" type="date" class="input-premium w-full" />
                                    </div>
                                    <div><label class="form-label">Agama</label><select v-model="form.Agama"
                                            class="input-premium w-full">
                                            <option
                                                v-for="a in ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']"
                                                :key="a">{{ a }}</option>
                                        </select></div>
                                    <div><label class="form-label">Status Perkawinan</label><input
                                            v-model="form.Status_Perkawinan" class="input-premium w-full" /></div>
                                    <div><label class="form-label">Nama Ibu Kandung</label><input
                                            v-model="form.Nama_Ibu_Kandung" class="input-premium w-full" /></div>
                                    <div><label class="form-label">NIK</label><input v-model="form.NIK"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">No. KK</label><input v-model="form.No_KK"
                                            class="input-premium w-full" /></div>
                                </div>
                            </div>

                            <!-- Group 2: Kepegawaian -->
                            <div class="mb-6">
                                <h4 class="section-title"><font-awesome-icon icon="id-card" class="mr-2" />Kepegawaian
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div><label class="form-label">NIP</label><input v-model="form.NIP"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">NUPTK</label><input v-model="form.NUPTK"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">Jenis PTK</label><input v-model="form.Jenis_PTK"
                                            class="input-premium w-full" placeholder="Guru" /></div>
                                    <div><label class="form-label">Status Kepegawaian</label><input
                                            v-model="form.Status_Kepegawaian" class="input-premium w-full"
                                            placeholder="PPPK" /></div>
                                    <div><label class="form-label">Pangkat/Gol</label><input
                                            v-model="form.Pangkat_Golongan" class="input-premium w-full" /></div>
                                    <div><label class="form-label">Sumber Gaji</label><input v-model="form.Sumber_Gaji"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">TMT PNS</label><input v-model="form.TMT_PNS"
                                            type="date" class="input-premium w-full" /></div>
                                    <div><label class="form-label">Tugas Tambahan</label><input
                                            v-model="form.Tugas_Tambahan" class="input-premium w-full" /></div>
                                    <div><label class="form-label">SK CPNS</label><input v-model="form.SK_CPNS"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">Tanggal CPNS</label><input
                                            v-model="form.Tanggal_CPNS" type="date" class="input-premium w-full" />
                                    </div>
                                    <div><label class="form-label">SK Pengangkatan</label><input
                                            v-model="form.SK_Pengangkatan" class="input-premium w-full" /></div>
                                    <div><label class="form-label">TMT Pengangkatan</label><input
                                            v-model="form.TMT_Pengangkatan" type="date" class="input-premium w-full" />
                                    </div>
                                    <div><label class="form-label">Lembaga Pengangkatan</label><input
                                            v-model="form.Lembaga_Pengangkatan" class="input-premium w-full" /></div>
                                </div>
                            </div>

                            <!-- Group 3: Alamat & Kontak -->
                            <div class="mb-6">
                                <h4 class="section-title"><font-awesome-icon icon="map-location-dot"
                                        class="mr-2" />Alamat & Kontak</h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div class="md:col-span-2"><label class="form-label">Alamat Jalan</label><input
                                            v-model="form.Alamat_Jalan" class="input-premium w-full" /></div>
                                    <div><label class="form-label">RT</label><input v-model="form.RT"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">RW</label><input v-model="form.RW"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">Dusun</label><input v-model="form.Nama_Dusun"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">Desa/Kelurahan</label><input v-model="form.Desa"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">Kecamatan</label><input v-model="form.Kecamatan"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">Kode Pos</label><input v-model.number="form.Kode_Pos"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">Telepon</label><input v-model="form.Telepon"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">HP</label><input v-model="form.HP"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">Email</label><input v-model="form.Email"
                                            class="input-premium w-full" /></div>
                                </div>
                            </div>

                            <!-- Group 4: Keuangan & Lainnya -->
                            <div class="mb-6">
                                <h4 class="section-title"><font-awesome-icon icon="credit-card" class="mr-2" />Keuangan
                                    & Lainnya</h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div><label class="form-label">NPWP</label><input v-model="form.NPWP"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">Nama Wajib Pajak</label><input
                                            v-model="form.Nama_Wajib_Pajak" class="input-premium w-full" /></div>
                                    <div><label class="form-label">Bank</label><input v-model="form.Bank"
                                            class="input-premium w-full" /></div>
                                    <div><label class="form-label">No. Rekening</label><input
                                            v-model="form.Nomor_Rekening" class="input-premium w-full" /></div>
                                    <div><label class="form-label">Rek. Atas Nama</label><input
                                            v-model="form.Rekening_Atas_Nama" class="input-premium w-full" /></div>
                                    <div><label class="form-label">Kewarganegaraan</label><input
                                            v-model="form.Kewarganegaraan" class="input-premium w-full"
                                            placeholder="ID" /></div>
                                </div>
                            </div>

                            <!-- Foto Section -->
                            <div>
                                <label class="form-label mb-2"><font-awesome-icon icon="camera"
                                        class="text-brand-gold text-[10px] mr-1.5" />Foto Guru</label>
                                <div class="flex bg-black/40 rounded-xl p-1 mb-3 border border-white/10">
                                    <button @click="fotoMode = 'url'"
                                        :class="fotoMode === 'url' ? 'tab-active' : 'tab-inactive'"
                                        class="flex-1 text-xs font-bold py-2 rounded-lg transition-all">Link
                                        URL</button>
                                    <button @click="fotoMode = 'upload'"
                                        :class="fotoMode === 'upload' ? 'tab-active' : 'tab-inactive'"
                                        class="flex-1 text-xs font-bold py-2 rounded-lg transition-all">Upload
                                        File</button>
                                </div>

                                <div v-if="fotoMode === 'url'">
                                    <div class="relative">
                                        <span
                                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10"><font-awesome-icon
                                                icon="link" class="text-sm" /></span>
                                        <input v-model="form.Foto_Guru" class="input-premium w-full"
                                            style="padding-left: 2.75rem !important;" placeholder="https://..." />
                                    </div>
                                </div>

                                <div v-if="fotoMode === 'upload'">
                                    <div v-if="uploadPreview" class="mb-3 flex justify-center relative">
                                        <img :src="uploadPreview" referrerpolicy="no-referrer" crossorigin="anonymous"
                                            class="w-24 h-32 object-cover rounded-2xl border-2 border-brand-gold/30 shadow-xl" />
                                        <button @click="removeUpload"
                                            class="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-rose-500">×</button>
                                    </div>
                                    <div v-if="!uploadPreview" class="dropzone-premium"
                                        :class="{ 'dropzone-active': isDragging }" @dragover.prevent="isDragging = true"
                                        @dragleave="isDragging = false" @drop.prevent="handleDrop"
                                        @click="$refs.fileUpload.click()">
                                        <font-awesome-icon icon="cloud-arrow-up"
                                            class="text-brand-gold text-2xl mb-2" />
                                        <p class="text-xs text-gray-400"><span
                                                class="text-brand-gold font-bold">Klik</span> atau seret foto</p>
                                        <p class="text-[10px] text-gray-600 mt-1">JPG, PNG, WEBP (maks. 5MB)</p>
                                        <input ref="fileUpload" type="file" accept="image/*" class="hidden"
                                            @change="handleFileSelect" />
                                    </div>
                                    <div v-if="uploading" class="mt-3">
                                        <div class="flex justify-between text-xs text-gray-500 mb-1"><span>{{
                                            uploadError ? 'Gagal' : 'Mengunggah...' }}</span><span>{{ uploadProgress
                                                }}%</span></div>
                                        <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                            <div :class="uploadError ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'"
                                                class="h-full rounded-full transition-all duration-300"
                                                :style="{ width: uploadProgress + '%' }"></div>
                                        </div>
                                    </div>
                                    <p v-if="uploadSuccess"
                                        class="text-xs text-emerald-400 mt-2 flex items-center gap-1"><font-awesome-icon
                                            icon="check" />Berhasil diunggah ke Google Drive</p>
                                    <p v-if="uploadError" class="text-xs text-red-400 mt-2 flex items-center gap-1">
                                        <font-awesome-icon icon="triangle-exclamation" />{{ uploadErrorMessage }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer-premium">
                            <button @click="close" class="btn-cancel-premium"><font-awesome-icon icon="times"
                                    class="mr-2" />Batal</button>
                            <button @click="handleSubmit" :disabled="saving" class="btn-save-premium">
                                <font-awesome-icon :icon="saving ? 'spinner' : 'save'"
                                    :class="{ 'animate-spin': saving }" class="mr-2" />
                                {{ saving ? 'Menyimpan...' : 'Simpan' }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUpload } from '@/composables/useUpload'

const props = defineProps<{ editData?: any }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'save', data: any): void }>()

const { uploadToDrive } = useUpload()
const visible = ref(true); const saving = ref(false)
const fotoMode = ref<'url' | 'upload'>('url'); const isDragging = ref(false)
const uploadPreview = ref<string | null>(null); const uploading = ref(false)
const uploadProgress = ref(0); const uploadSuccess = ref(false)
const uploadError = ref(false); const uploadErrorMessage = ref('')

const form = reactive({
    Nama: '', NIK: '', NIP: '', NUPTK: '', Tempat_Lahir: '', Tanggal_Lahir: '', No_KK: '',
    Agama: 'Islam', Alamat_Jalan: '', Bank: '', Desa: '', Email: '', Foto_Guru: '',
    HP: '', JK: 'L', Jenis_PTK: 'Guru', Karis_Karsu: '', Karpeg: '',
    Keahlian_Bahasa_Isyarat: 'Tidak', Keahlian_Braille: 'Tidak', Kecamatan: '',
    Kewarganegaraan: 'ID', Kode_Pos: 0, Lembaga_Pengangkatan: '', NIP_Suami_Istri: '',
    NPWP: '', NUKS: '', Nama_Dusun: '', Nama_Ibu_Kandung: '', Nama_Suami_Istri: '',
    Nama_Wajib_Pajak: '', Nomor_Rekening: '', Pangkat_Golongan: '', Pekerjaan_Suami_Istri: '',
    Pernah_Diklat_Kepengawasan: 'Tidak', RT: '', RW: '', Rekening_Atas_Nama: '',
    SK_CPNS: '', SK_Pengangkatan: '', Status_Kepegawaian: '', Status_Perkawinan: '',
    Sudah_Lisensi_Kepala_Sekolah: 'Tidak', Sumber_Gaji: '', TMT_PNS: '',
    TMT_Pengangkatan: '', Tanggal_CPNS: '', Telepon: '', Tugas_Tambahan: '',
    Bujur: 0, Lintang: 0,
})

if (props.editData) { Object.assign(form, props.editData); if (props.editData.Foto_Guru) { uploadPreview.value = props.editData.Foto_Guru; fotoMode.value = 'upload' } }

const close = () => { visible.value = false; setTimeout(() => emit('close'), 300) }
const handleDrop = (e: DragEvent) => { isDragging.value = false; const f = e.dataTransfer?.files?.[0]; if (f) processFile(f) }
const handleFileSelect = (e: Event) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) processFile(f) }

const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = () => { uploadPreview.value = reader.result as string }
    reader.readAsDataURL(file)
    uploading.value = true; uploadProgress.value = 0; uploadSuccess.value = false; uploadError.value = false
    const interval = setInterval(() => { uploadProgress.value += Math.floor(Math.random() * 10) + 5; if (uploadProgress.value > 90) uploadProgress.value = 90 }, 300)
    try {
        const link = await uploadToDrive(file)
        clearInterval(interval); uploadProgress.value = 100; uploading.value = false; uploadSuccess.value = true
        form.Foto_Guru = link
    } catch (err: any) {
        clearInterval(interval); uploadProgress.value = 100; uploading.value = false; uploadError.value = true
        uploadErrorMessage.value = err.message || 'Gagal upload'
    }
}

const removeUpload = () => { uploadPreview.value = null; uploadSuccess.value = false; uploadError.value = false; form.Foto_Guru = '' }

const handleSubmit = () => {
    if (!form.Nama) return
    saving.value = true
    emit('save', { ...form })
}
</script>

<style scoped>
.modal-panel-wide {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #13061c, #0a0015);
    border-left: 1px solid rgba(251, 191, 36, .15);
    box-shadow: -10px 0 50px rgba(0, 0, 0, .5);
    display: flex;
    flex-direction: column;
    overflow: hidden
}

@media(min-width:768px) {
    .modal-panel-wide {
        width: 70%;
        max-width: 800px;
        min-width: 550px
    }
}

.tab-active {
    background: #fbbf24;
    color: #1e0a2d
}

.tab-inactive {
    color: #9ca3af
}

.tab-inactive:hover {
    color: white
}

.dropzone-premium {
    border: 2px dashed rgba(255, 255, 255, .1);
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all .3s;
    background: rgba(30, 10, 45, .3)
}

.dropzone-premium:hover,
.dropzone-active {
    border-color: #fbbf24;
    background: rgba(251, 191, 36, .05)
}

.modal-overlay-premium {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    background: rgba(0, 0, 0, .6);
    backdrop-filter: blur(4px)
}

.modal-header-premium {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, .05);
    background: rgba(30, 10, 45, .9)
}

.modal-header-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(251, 191, 36, .1);
    border: 1px solid rgba(251, 191, 36, .2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fbbf24
}

.modal-close-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, .03);
    border: 1px solid rgba(255, 255, 255, .08);
    color: #9ca3af;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s
}

.modal-close-btn:hover {
    background: rgba(239, 68, 68, .15);
    color: #f87171
}

.modal-body-premium {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem
}

.section-title {
    color: #fbbf24;
    font-size: .7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
    margin-bottom: .75rem;
    padding-bottom: .5rem;
    border-bottom: 1px solid rgba(255, 255, 255, .05);
    display: flex;
    align-items: center
}

.form-label {
    display: flex;
    align-items: center;
    color: #fbbf24;
    font-size: .6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: .4rem
}

.input-premium {
    background: rgba(0, 0, 0, .3);
    border: 1px solid rgba(107, 33, 168, .4);
    color: white;
    border-radius: .75rem;
    padding: .55rem .75rem;
    font-size: .8rem;
    outline: none;
    transition: all .3s;
    width: 100%
}

.input-premium:focus {
    border-color: #fbbf24;
    box-shadow: 0 0 12px rgba(251, 191, 36, .2)
}

.modal-footer-premium {
    flex-shrink: 0;
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, .05);
    background: rgba(30, 10, 45, .9);
    display: flex;
    justify-content: flex-end;
    gap: .75rem
}

.btn-cancel-premium {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .6rem 1.25rem;
    border-radius: .75rem;
    border: 1px solid rgba(255, 255, 255, .1);
    background: transparent;
    color: #9ca3af;
    font-size: .75rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer
}

.btn-save-premium {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .6rem 1.5rem;
    border-radius: .75rem;
    border: none;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #1e0a2d;
    font-size: .75rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(245, 158, 11, .3)
}

.btn-save-premium:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(245, 158, 11, .5);
    transform: translateY(-1px)
}

.btn-save-premium:disabled {
    opacity: .5;
    cursor: not-allowed
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity .3s
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0
}

.slide-right-enter-active {
    transition: transform .35s cubic-bezier(.22, .61, .36, 1)
}

.slide-right-leave-active {
    transition: transform .25s cubic-bezier(.55, .06, .68, .19)
}

.slide-right-enter-from {
    transform: translateX(100%)
}

.slide-right-leave-to {
    transform: translateX(100%)
}
</style>
