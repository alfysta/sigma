<template>
    <div>
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
            <div>
                <h1 class="text-3xl md:text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                    <span
                        class="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                        <font-awesome-icon icon="chalkboard" class="text-brand-gold text-lg" />
                    </span>
                    Data Kelas
                </h1>
                <p class="text-gray-400 text-sm mt-2 ml-13">Manajemen kelas dan jurusan</p>
            </div>
            <div class="flex items-center flex-wrap gap-2">
                <button class="btn-gold-premium group" @click="openModal()">
                    <span class="btn-gold-icon"><font-awesome-icon icon="plus" class="text-sm" /></span>
                    <span>Tambah Kelas</span>
                </button>
                <div class="relative">
                    <button class="btn-secondary-premium" @click.stop="showDropdown = !showDropdown">
                        <font-awesome-icon icon="ellipsis-vertical" class="text-base" />
                        <span>Aksi</span>
                        <font-awesome-icon icon="caret-down" class="text-[10px]"
                            :class="{ 'rotate-180': showDropdown }" />
                    </button>
                    <Transition name="dropdown-fade">
                        <div v-if="showDropdown" class="dropdown-premium" @click.stop>
                            <div class="dropdown-header">
                                <font-awesome-icon icon="bolt" class="text-brand-gold text-xs" />
                                <span class="text-[10px] text-gray-500 uppercase tracking-widest">Quick Actions</span>
                            </div>
                            <button @click="handleExport"><span
                                    class="dropdown-icon bg-emerald-500/10 text-emerald-400"><font-awesome-icon
                                        icon="file-export" /></span>
                                <div class="text-left">
                                    <p class="text-sm font-medium text-white">Ekspor</p>
                                    <p class="text-[10px] text-gray-500">Download .xlsx</p>
                                </div>
                            </button>
                            <button @click="handleImportClick"><span
                                    class="dropdown-icon bg-blue-500/10 text-blue-400"><font-awesome-icon
                                        icon="file-import" /></span>
                                <div class="text-left">
                                    <p class="text-sm font-medium text-white">Impor</p>
                                    <p class="text-[10px] text-gray-500">Upload .xlsx</p>
                                </div>
                            </button>
                            <button @click="handleTemplate"><span
                                    class="dropdown-icon bg-purple-500/10 text-purple-400"><font-awesome-icon
                                        icon="file-excel" /></span>
                                <div class="text-left">
                                    <p class="text-sm font-medium text-white">Template</p>
                                    <p class="text-[10px] text-gray-500">Download</p>
                                </div>
                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <!-- Filter -->
        <div class="glass-card p-4 w-full flex flex-col md:flex-row gap-4 items-center mb-4">
            <div class="relative flex-1 w-full">
                <font-awesome-icon icon="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" />
                <input v-model="searchQuery" class="input-dark w-full" style="padding-left: 2.75rem !important;"
                    placeholder="Cari nama kelas, jurusan..." />
            </div>
            <div
                class="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10 w-full md:w-auto">
                <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">Tingkat</span>
                <select v-model="filterTingkatan"
                    class="bg-transparent text-white border-0 text-sm font-bold outline-none cursor-pointer focus:ring-0">
                    <option class="bg-brand-main" value="">Semua</option>
                    <option class="bg-brand-main" value="X">X</option>
                    <option class="bg-brand-main" value="XI">XI</option>
                    <option class="bg-brand-main" value="XII">XII</option>
                </select>
            </div>
        </div>

        <!-- Stats -->
        <div v-if="stats.total > 0" class="mb-4 flex flex-wrap gap-3">
            <div class="glass-card px-4 py-2 flex items-center gap-2 text-sm">
                <font-awesome-icon icon="school" class="text-brand-gold" />
                <span class="text-gray-300">Total: <b class="text-white">{{ stats.total }}</b></span>
            </div>
            <div v-for="level in stats.levels" :key="level.label"
                class="glass-card px-4 py-2 flex items-center gap-2 text-sm">
                <font-awesome-icon icon="layer-group" class="text-brand-gold" />
                <span class="text-gray-300">Kelas {{ level.label }}: <b class="text-white">{{ level.count }}</b></span>
            </div>
        </div>

        <!-- Table -->
        <div class="glass-card overflow-hidden shadow-2xl flex flex-col">
            <div class="table-wrapper custom-scrollbar">
                <table class="w-full text-xs md:text-sm text-left">
                    <thead>
                        <tr>
                            <th class="th-premium w-12 text-center">No</th>
                            <th class="th-premium"><font-awesome-icon icon="chalkboard" class="mr-2" />Nama Kelas</th>
                            <th class="th-premium text-center"><font-awesome-icon icon="layer-group"
                                    class="mr-2" />Tingkatan</th>
                            <th class="th-premium text-center"><font-awesome-icon icon="book" class="mr-2" />Jurusan
                            </th>
                            <th class="th-premium text-center"><font-awesome-icon icon="users" class="mr-2" />Kapasitas
                            </th>
                            <th class="th-premium text-center w-24"><font-awesome-icon icon="gear" class="mr-2" />Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/[0.03]">
                        <tr v-if="isLoading">
                            <td colspan="6" class="py-20">
                                <div class="loading-premium">
                                    <div class="loading-spinner-premium">
                                        <div class="spinner-ring"></div>
                                        <div class="spinner-ring-reverse"></div>
                                        <font-awesome-icon icon="layer-group"
                                            class="text-brand-gold text-2xl z-10 animate-pulse" />
                                    </div>
                                    <p class="text-gray-400 text-sm font-medium mt-4">Memuat data kelas...</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="!paginatedKelas.length">
                            <td colspan="6" class="py-20 text-center text-gray-500">Tidak ada data kelas.</td>
                        </tr>
                        <tr v-for="(k, i) in paginatedKelas" :key="k.id" class="tr-premium group">
                            <td class="td-premium text-center text-gray-500 text-xs font-mono">{{ (currentPage - 1) *
                                itemsPerPage + i + 1 }}</td>
                            <td class="td-premium font-bold text-white">{{ k.Nama_Kelas }}</td>
                            <td class="td-premium text-center">
                                <span :class="tingkatColor(k.Tingkatan)"
                                    class="px-2 py-0.5 rounded font-bold text-xs border">
                                    {{ k.Tingkatan }}
                                </span>
                            </td>
                            <td class="td-premium text-center text-gray-300">{{ k.Jurusan || '-' }}</td>
                            <td class="td-premium text-center text-gray-300">{{ k.Kapasitas || '-' }}</td>
                            <td class="td-premium text-center">
                                <div class="action-buttons">
                                    <button class="action-btn-edit" @click="openModal(k)"><font-awesome-icon icon="pen"
                                            class="text-xs" /></button>
                                    <button class="action-btn-delete" @click="handleDelete(k)"><font-awesome-icon
                                            icon="trash-can" class="text-xs" /></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination :total="totalData" v-model:current-page="currentPage" :total-pages="totalPages" />
        </div>

        <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="handleImportFile" />

        <!-- Modal -->
        <Teleport to="body">
            <Transition name="overlay-fade">
                <div v-if="showModal" class="modal-overlay-premium" @click.self="closeModal">
                    <Transition name="slide-right">
                        <div v-if="showModal" class="modal-panel-premium">
                            <div class="modal-header-premium">
                                <div class="flex items-center gap-3">
                                    <span class="modal-header-icon"><font-awesome-icon :icon="editData ? 'pen' : 'plus'"
                                            class="text-sm" /></span>
                                    <div>
                                        <h2 class="text-lg font-bold text-white">
                                            {{ editData ? 'Edit Kelas' : 'Tambah Kelas' }}</h2>
                                        <p class="text-[10px] text-gray-500 uppercase tracking-wider">{{ editData ?
                                            'Perbarui data kelas' : 'Tambahkan kelas baru' }}</p>
                                    </div>
                                </div>
                                <button @click="closeModal" class="modal-close-btn"><font-awesome-icon icon="times"
                                        class="text-lg" /></button>
                            </div>
                            <div class="modal-body-premium">
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="chalkboard"
                                            class="text-brand-gold text-[10px] mr-1.5" />Nama Kelas</label>
                                    <input v-model="form.Nama_Kelas" class="input-premium w-full"
                                        placeholder="Contoh: X MIPA 1" />
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="form-group-premium">
                                        <label><font-awesome-icon icon="layer-group"
                                                class="text-brand-gold text-[10px] mr-1.5" />Tingkatan</label>
                                        <select v-model="form.Tingkatan" class="input-premium w-full">
                                            <option value="X">X</option>
                                            <option value="XI">XI</option>
                                            <option value="XII">XII</option>
                                        </select>
                                    </div>
                                    <div class="form-group-premium">
                                        <label><font-awesome-icon icon="book"
                                                class="text-brand-gold text-[10px] mr-1.5" />Jurusan</label>
                                        <input v-model="form.Jurusan" class="input-premium w-full"
                                            placeholder="MIPA / IPS" />
                                    </div>
                                </div>
                                <div class="form-group-premium">
                                    <label><font-awesome-icon icon="users"
                                            class="text-brand-gold text-[10px] mr-1.5" />Kapasitas</label>
                                    <input v-model.number="form.Kapasitas" type="number" class="input-premium w-full"
                                        placeholder="36" />
                                </div>
                            </div>
                            <div class="modal-footer-premium">
                                <button @click="closeModal" class="btn-cancel-premium"><font-awesome-icon icon="times"
                                        class="mr-2" />Batal</button>
                                <button @click="handleSave" :disabled="saving" class="btn-save-premium">
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useKelas } from '@/composables/useKelas'
import { useSwal } from '@/plugins/sweetalert'
import Pagination from '@/components/common/Pagination.vue'

const {
    isLoading, searchQuery, filterTingkatan, currentPage, itemsPerPage,
    paginatedKelas, totalData, totalPages, stats,
    loadKelas, saveKelas, deleteKelas, exportToExcel, downloadTemplate, importFromExcel,
} = useKelas()

const { successPremium, errorPremium, warningPremium, confirmDelete, loading, closeLoading } = useSwal()

const showDropdown = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const showModal = ref(false)
const editData = ref<any>(null)
const saving = ref(false)

const form = reactive({ Nama_Kelas: '', Tingkatan: 'X', Jurusan: '', Kapasitas: 0 })

onMounted(() => loadKelas())
watch(showDropdown, (val) => {
    if (val) setTimeout(() => document.addEventListener('click', () => showDropdown.value = false, { once: true }), 0)
})

const tingkatColor = (t: string) => {
    if (t === 'X') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    if (t === 'XI') return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    if (t === 'XII') return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
}

const openModal = (data?: any) => {
    editData.value = data || null
    if (data) {
        form.Nama_Kelas = data.Nama_Kelas || ''
        form.Tingkatan = data.Tingkatan || 'X'
        form.Jurusan = data.Jurusan || ''
        form.Kapasitas = data.Kapasitas || 0
    } else {
        form.Nama_Kelas = ''; form.Tingkatan = 'X'; form.Jurusan = ''; form.Kapasitas = 0
    }
    showModal.value = true
}

const closeModal = () => { showModal.value = false; editData.value = null }

const handleSave = async () => {
    if (!form.Nama_Kelas) { warningPremium('Data Tidak Lengkap', 'Nama Kelas wajib diisi!'); return }
    saving.value = true; loading('Menyimpan data...')
    try {
        await saveKelas({ ...form }, editData.value?.id)
        await loadKelas(); closeLoading()
        successPremium(editData.value ? 'Kelas Diperbarui!' : 'Kelas Ditambahkan!', 'Data kelas berhasil disimpan.')
        closeModal()
    } catch (err: any) { closeLoading(); errorPremium('Gagal!', err.message) }
    finally { saving.value = false }
}

const handleDelete = async (k: any) => {
    const ok = await confirmDelete()
    if (!ok) return
    loading('Menghapus...')
    try { await deleteKelas(k.id!); await loadKelas(); closeLoading(); successPremium('Terhapus!', `Kelas "${k.Nama_Kelas}" dihapus.`) }
    catch (err: any) { closeLoading(); errorPremium('Gagal!', err.message) }
}

const handleExport = () => { showDropdown.value = false; exportToExcel() }
const handleImportClick = () => { showDropdown.value = false; fileInput.value?.click() }
const handleTemplate = () => { showDropdown.value = false; downloadTemplate() }

const handleImportFile = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    loading('Mengimpor...')
    try { const c = await importFromExcel(file); await loadKelas(); closeLoading(); successPremium('Berhasil!', `${c} kelas diimpor.`) }
    catch (err: any) { closeLoading(); errorPremium('Gagal!', err.message) }
    if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
/* Copy all premium styles from UserCRUD */
.btn-gold-premium {
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #1e0a2d;
    font-weight: 700;
    border-radius: .75rem;
    padding: .6rem 1.2rem;
    font-size: .875rem;
    display: flex;
    align-items: center;
    gap: .5rem;
    border: none;
    cursor: pointer;
    transition: all .3s;
    box-shadow: 0 0 15px rgba(251, 191, 36, .3)
}

.btn-gold-premium:hover {
    box-shadow: 0 0 25px rgba(251, 191, 36, .5);
    transform: translateY(-2px)
}

.btn-gold-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(0, 0, 0, .2);
    display: flex;
    align-items: center;
    justify-content: center
}

.btn-secondary-premium {
    background: rgba(0, 0, 0, .4);
    border: 1px solid rgba(251, 191, 36, .3);
    color: #fbbf24;
    padding: .6rem 1.2rem;
    border-radius: .75rem;
    font-size: .875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: .5rem;
    cursor: pointer;
    transition: all .3s
}

.btn-secondary-premium:hover {
    background: rgba(251, 191, 36, .1);
    border-color: rgba(251, 191, 36, .5)
}

.dropdown-premium {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    width: 260px;
    background: rgba(20, 5, 35, .98);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(251, 191, 36, .2);
    border-radius: 16px;
    padding: 8px;
    z-index: 50;
    box-shadow: 0 20px 50px rgba(0, 0, 0, .5)
}

.dropdown-header {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, .05);
    margin-bottom: 4px
}

.dropdown-premium button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #d1d5db;
    cursor: pointer;
    transition: all .2s;
    text-align: left
}

.dropdown-premium button:hover {
    background: rgba(255, 255, 255, .03);
    color: #fbbf24
}

.dropdown-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0
}

.glass-card {
    background: rgba(20, 5, 35, .35);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, .05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, .3);
    border-radius: 1.5rem
}

.input-dark {
    background: rgba(0, 0, 0, .4);
    border: 1px solid rgba(107, 33, 168, .6);
    color: white;
    border-radius: .75rem;
    padding: .6rem 1rem;
    font-size: .875rem;
    outline: none;
    transition: all .3s
}

.input-dark:focus {
    border-color: #fbbf24;
    box-shadow: 0 0 12px rgba(251, 191, 36, .2)
}

.th-premium {
    padding: 1rem 1.25rem;
    font-size: .7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: #fbbf24;
    background: #3b0764;
    white-space: nowrap
}

.td-premium {
    padding: .875rem 1.25rem
}

.tr-premium {
    transition: all .2s
}

.tr-premium:hover {
    background: rgba(255, 255, 255, .02)
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: .5rem;
    opacity: 0;
    transition: opacity .3s
}

.tr-premium:hover .action-buttons {
    opacity: 1
}

.action-btn-edit {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(59, 130, 246, .15);
    color: #60a5fa;
    border: 1px solid rgba(59, 130, 246, .2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s
}

.action-btn-edit:hover {
    background: #3b82f6;
    color: white
}

.action-btn-delete {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(239, 68, 68, .15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, .2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s
}

.action-btn-delete:hover {
    background: #ef4444;
    color: white
}

.loading-premium {
    display: flex;
    flex-direction: column;
    align-items: center
}

.loading-spinner-premium {
    position: relative;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center
}

.spinner-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #fbbf24;
    animation: spin 1s linear infinite
}

.spinner-ring-reverse {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-bottom-color: #a855f7;
    animation: spin .7s linear infinite reverse
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
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
        width: 50%;
        max-width: 550px;
        min-width: 420px
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
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem
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
    transition: all .3s
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
    cursor: pointer;
    transition: all .2s
}

.btn-cancel-premium:hover {
    background: rgba(255, 255, 255, .03);
    color: white
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
    transition: all .2s;
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
    transition: opacity .3s ease
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

.dropdown-fade-enter-active {
    transition: all .2s ease-out
}

.dropdown-fade-leave-active {
    transition: all .15s ease-in
}

.dropdown-fade-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(.96)
}

.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(.98)
}

.table-wrapper {
    max-height: 60vh;
    overflow-x: auto
}
</style>
