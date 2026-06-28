<template>
    <Teleport to="body">
        <Transition name="overlay-fade">
            <div v-if="visible" class="modal-overlay-premium" @click.self="close">
                <Transition name="slide-right">
                    <div v-if="visible" class="modal-panel-premium">

                        <!-- Header -->
                        <div class="modal-header-premium">
                            <div class="flex items-center gap-3">
                                <span class="modal-header-icon">
                                    <font-awesome-icon :icon="editData ? 'pen' : 'plus'" class="text-sm" />
                                </span>
                                <div>
                                    <h2 class="text-lg font-bold text-white">
                                        {{ editData ? 'Edit Siswa' : 'Tambah Siswa' }}</h2>
                                    <p class="text-[10px] text-gray-500 uppercase tracking-wider">
                                        {{ editData ? 'Perbarui data siswa' : 'Tambahkan siswa baru' }}
                                    </p>
                                </div>
                            </div>
                            <button @click="close" class="modal-close-btn">
                                <font-awesome-icon icon="times" class="text-lg" />
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="modal-body-premium">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="hashtag"
                                            class="text-brand-gold text-[10px] mr-1.5" />NISN</label>
                                    <input v-model="form.NISN" class="input-premium w-full" placeholder="0094275049" />
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="hashtag"
                                            class="text-brand-gold text-[10px] mr-1.5" />NIS</label>
                                    <input v-model="form.NIS" class="input-premium w-full" placeholder="1234" />
                                </div>
                                <div class="form-group-premium md:col-span-2">
                                    <label><font-awesome-icon icon="user"
                                            class="text-brand-gold text-[10px] mr-1.5" />Nama Lengkap</label>
                                    <input v-model="form.Nama_Siswa" class="input-premium w-full"
                                        placeholder="Nama lengkap siswa" />
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="school"
                                            class="text-brand-gold text-[10px] mr-1.5" />Kelas</label>
                                    <input v-model="form.Kelas" class="input-premium w-full" placeholder="X MIPA 1" />
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="venus-mars"
                                            class="text-brand-gold text-[10px] mr-1.5" />Jenis Kelamin</label>
                                    <select v-model="form.Jenis_Kelamin" class="input-premium w-full">
                                        <option>Laki-laki</option>
                                        <option>Perempuan</option>
                                    </select>
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="calendar"
                                            class="text-brand-gold text-[10px] mr-1.5" />Tahun Ajaran</label>
                                    <input v-model="form.Tahun_Ajaran" class="input-premium w-full"
                                        placeholder="2024/2025" />
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="door-open"
                                            class="text-brand-gold text-[10px] mr-1.5" />Tahun Masuk</label>
                                    <input v-model="form.Tahun_Masuk" class="input-premium w-full" placeholder="2024" />
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="map-pin"
                                            class="text-brand-gold text-[10px] mr-1.5" />Tempat Lahir</label>
                                    <input v-model="form.Tempat_Lahir" class="input-premium w-full"
                                        placeholder="Jakarta" />
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="calendar-day"
                                            class="text-brand-gold text-[10px] mr-1.5" />Tanggal Lahir</label>
                                    <input v-model="form.Tanggal_Lahir" type="date" class="input-premium w-full" />
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="star"
                                            class="text-brand-gold text-[10px] mr-1.5" />Agama</label>
                                    <select v-model="form.Agama" class="input-premium w-full">
                                        <option
                                            v-for="a in ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']"
                                            :key="a">{{ a }}</option>
                                    </select>
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="note-sticky"
                                            class="text-brand-gold text-[10px] mr-1.5" />Keterangan</label>
                                    <input v-model="form.Keterangan" class="input-premium w-full" placeholder="Aktif" />
                                </div>
                                <div class="form-group-premium md:col-span-2">
                                    <label><font-awesome-icon icon="map-location-dot"
                                            class="text-brand-gold text-[10px] mr-1.5" />Alamat</label>
                                    <textarea v-model="form.Alamat" rows="2" class="input-premium w-full"
                                        placeholder="Alamat lengkap"></textarea>
                                </div>
                            </div>

                            <!-- Foto Section -->
                            <div class="mt-6">
                                <label class="form-group-premium label block mb-3">
                                    <font-awesome-icon icon="camera" class="text-brand-gold text-[10px] mr-1.5" />Foto
                                    Siswa
                                </label>

                                <!-- Tabs -->
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

                                <!-- URL Mode -->
                                <!-- URL Mode -->
                                <div v-if="fotoMode === 'url'">
                                    <div class="relative">
                                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                                            <font-awesome-icon icon="link" class="text-sm" />
                                        </span>
                                        <input v-model="form.Foto_URL" class="input-premium w-full"
                                            style="padding-left: 2.75rem !important; padding-right: 1rem !important;"
                                            placeholder="https://..." />
                                    </div>
                                    <div v-if="form.Foto_URL" class="mt-3 flex justify-center">
                                        <img :src="form.Foto_URL" referrerpolicy="no-referrer" crossorigin="anonymous"
                                            class="w-24 h-32 object-cover rounded-2xl border-2 border-brand-gold/30 shadow-xl"
                                            @error="form.Foto_URL = ''" />
                                    </div>
                                </div>

                                <!-- Upload Mode -->
                                <div v-if="fotoMode === 'upload'">
                                    <div v-if="uploadPreview" class="mb-3 flex justify-center relative">
                                        <img :src="uploadPreview"
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
                                                class="text-brand-gold font-bold">Klik</span> atau seret foto di sini
                                        </p>
                                        <p class="text-[10px] text-gray-600 mt-1">JPG, PNG, WEBP (maks. 5MB)</p>
                                        <input ref="fileUpload" type="file" accept="image/*" class="hidden"
                                            @change="handleFileSelect" />
                                    </div>

                                    <div v-if="uploading" class="mt-3">
                                        <div class="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>{{ uploadError ? 'Gagal' : 'Mengunggah...' }}</span>
                                            <span>{{ uploadProgress }}%</span>
                                        </div>
                                        <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                            <div :class="uploadError ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'"
                                                class="h-full rounded-full transition-all duration-300"
                                                :style="{ width: uploadProgress + '%' }"></div>
                                        </div>
                                    </div>

                                    <p v-if="uploadSuccess"
                                        class="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                        <font-awesome-icon icon="check" />Berhasil diunggah ke Google Drive
                                    </p>
                                    <p v-if="uploadError" class="text-xs text-red-400 mt-2 flex items-center gap-1">
                                        <font-awesome-icon icon="triangle-exclamation" />{{ uploadErrorMessage }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="modal-footer-premium">
                            <button @click="close" class="btn-cancel-premium">
                                <font-awesome-icon icon="times" class="mr-2" />Batal
                            </button>
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

const visible = ref(true)
const saving = ref(false)
const fotoMode = ref<'url' | 'upload'>('url')
const isDragging = ref(false)
const uploadPreview = ref<string | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadSuccess = ref(false)
const uploadError = ref(false)
const uploadErrorMessage = ref('')

const form = reactive({
    Nama_Siswa: '', NISN: '', NIS: '', Agama: 'Islam', Alamat: '',
    Jenis_Kelamin: 'Laki-laki', Kelas: '', Keterangan: 'Aktif',
    Tahun_Ajaran: '', Tahun_Masuk: '', Tanggal_Lahir: '', Tempat_Lahir: '', Foto_URL: '',
})

// Init form if edit
if (props.editData) {
    const d = props.editData
    form.Nama_Siswa = d.Nama_Siswa || ''; form.NISN = d.NISN || ''; form.NIS = d.NIS || ''
    form.Agama = d.Agama || 'Islam'; form.Alamat = d.Alamat || ''
    form.Jenis_Kelamin = d.Jenis_Kelamin || 'Laki-laki'; form.Kelas = d.Kelas || ''
    form.Keterangan = d.Keterangan || 'Aktif'; form.Tahun_Ajaran = d.Tahun_Ajaran || ''
    form.Tahun_Masuk = d.Tahun_Masuk || ''; form.Tanggal_Lahir = d.Tanggal_Lahir || ''
    form.Tempat_Lahir = d.Tempat_Lahir || ''; form.Foto_URL = d.Foto_URL || ''
    if (d.Foto_URL) {
        uploadPreview.value = d.Foto_URL
        fotoMode.value = 'upload'
    }
}

const close = () => { visible.value = false; setTimeout(() => emit('close'), 300) }

const handleDrop = (e: DragEvent) => {
    isDragging.value = false
    const file = e.dataTransfer?.files?.[0]
    if (file) processFile(file)
}

const handleFileSelect = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) processFile(file)
}

const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return

    // Preview lokal
    const reader = new FileReader()
    reader.onload = () => { uploadPreview.value = reader.result as string }
    reader.readAsDataURL(file)

    // Upload ke Google Drive
    uploading.value = true
    uploadProgress.value = 0
    uploadSuccess.value = false
    uploadError.value = false

    const interval = setInterval(() => {
        uploadProgress.value += Math.floor(Math.random() * 10) + 5
        if (uploadProgress.value > 90) uploadProgress.value = 90
    }, 300)

    try {
        const driveLink = await uploadToDrive(file)

        clearInterval(interval)
        uploadProgress.value = 100
        uploading.value = false
        uploadSuccess.value = true
        form.Foto_URL = driveLink

    } catch (err: any) {
        clearInterval(interval)
        uploadProgress.value = 100
        uploading.value = false
        uploadError.value = true
        uploadErrorMessage.value = err.message || 'Gagal upload. Coba lagi.'
    }
}

const handleSubmit = () => {
    if (!form.Nama_Siswa || !form.Kelas) return
    saving.value = true
    emit('save', { ...form })
}

const removeUpload = () => {
    uploadPreview.value = null
    uploadSuccess.value = false
    uploadError.value = false
    form.Foto_URL = ''
}

</script>

<style scoped>
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

.modal-panel-premium {
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
    .modal-panel-premium {
        width: 60%;
        max-width: 650px;
        min-width: 480px
    }
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

.form-group-premium label {
    display: flex;
    align-items: center;
    color: #fbbf24;
    font-size: .65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
    margin-bottom: .5rem
}

.input-premium {
    background: rgba(0, 0, 0, .3);
    border: 1px solid rgba(107, 33, 168, .4);
    color: white;
    border-radius: .75rem;
    padding: .6rem 1rem;
    font-size: .875rem;
    outline: none;
    transition: all .3s;
    width: 100%;
    box-sizing: border-box;
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
