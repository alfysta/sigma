<template>
    <div>
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
            <div>
                <h1 class="text-3xl md:text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                    <span
                        class="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                        <font-awesome-icon icon="person-chalkboard" class="text-brand-gold text-lg" />
                    </span>
                    Data GTK
                </h1>
                <p class="text-gray-400 text-sm mt-2 ml-13">Manajemen data Guru & Tenaga Kependidikan</p>
            </div>
            <div class="flex items-center flex-wrap gap-2">
                <button class="btn-gold-premium group" @click="openModal()">
                    <span class="btn-gold-icon"><font-awesome-icon icon="plus" class="text-sm" /></span>
                    <span>Tambah GTK</span>
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
        <div class="glass-card p-4 w-full flex gap-4 items-center mb-4">
            <div class="relative flex-1">
                <font-awesome-icon icon="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" />
                <input v-model="searchQuery" class="input-dark w-full" style="padding-left: 2.75rem !important;"
                    placeholder="Cari Nama, NIP, NUPTK..." />
            </div>
            <div class="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">Baris</span>
                <select v-model.number="itemsPerPage"
                    class="bg-transparent text-white border-0 text-sm font-bold outline-none cursor-pointer">
                    <option class="bg-brand-main" :value="15">15</option>
                    <option class="bg-brand-main" :value="30">30</option>
                    <option class="bg-brand-main" :value="50">50</option>
                    <option class="bg-brand-main" :value="100">100</option>
                </select>
            </div>
        </div>

        <!-- Table -->
        <div class="glass-card overflow-hidden shadow-2xl flex flex-col">
            <div class="table-wrapper custom-scrollbar">
                <table class="w-full text-xs md:text-sm text-left">
                    <thead>
                        <tr>
                            <th class="th-premium w-12 text-center">No</th>
                            <th class="th-premium"><font-awesome-icon icon="user" class="mr-2" />Nama / NIP</th>
                            <th class="th-premium text-center"><font-awesome-icon icon="briefcase" class="mr-2" />Jenis
                                PTK</th>
                            <th class="th-premium text-center"><font-awesome-icon icon="venus-mars" class="mr-2" />L/P
                            </th>
                            <th class="th-premium text-center"><font-awesome-icon icon="star" class="mr-2" />Agama</th>
                            <th class="th-premium text-center"><font-awesome-icon icon="id-card" class="mr-2" />Status
                            </th>
                            <th class="th-premium"><font-awesome-icon icon="phone" class="mr-2" />Kontak</th>
                            <th class="th-premium text-center w-28"><font-awesome-icon icon="gear" class="mr-2" />Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/[0.03]">
                        <tr v-if="isLoading">
                            <td colspan="8" class="py-20">
                                <div class="loading-premium">
                                    <div class="loading-spinner-premium">
                                        <div class="spinner-ring"></div>
                                        <div class="spinner-ring-reverse"></div>
                                        <font-awesome-icon icon="person-chalkboard"
                                            class="text-brand-gold text-2xl z-10 animate-pulse" />
                                    </div>
                                    <p class="text-gray-400 text-sm font-medium mt-4">Memuat data GTK...</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="!paginatedGtk.length">
                            <td colspan="8" class="py-20 text-center text-gray-500">Tidak ada data GTK.</td>
                        </tr>
                        <tr v-for="(g, i) in paginatedGtk" :key="g.id" class="tr-premium group">
                            <td class="td-premium text-center text-gray-500 text-xs font-mono">{{ (currentPage - 1) *
                                itemsPerPage + i + 1 }}</td>
                            <td class="td-premium">
                                <div class="font-bold text-white uppercase">{{ g.Nama || '-' }}</div>
                                <div class="font-mono text-[10px] text-brand-gold/60 mt-0.5">NIP. {{ g.NIP || g.NUPTK ||
                                    '-' }}</div>
                            </td>
                            <td class="td-premium text-center text-gray-300">{{ g.Jenis_PTK || '-' }}</td>
                            <td class="td-premium text-center">
                                <font-awesome-icon v-if="g.JK === 'L'" icon="mars" class="text-blue-400" />
                                <font-awesome-icon v-else icon="venus" class="text-pink-400" />
                            </td>
                            <td class="td-premium text-center text-gray-300 text-xs">{{ g.Agama || '-' }}</td>
                            <td class="td-premium text-center text-gray-300 text-xs">{{ g.Status_Kepegawaian || '-' }}
                            </td>
                            <td class="td-premium text-gray-400 text-xs truncate max-w-[120px]">{{ g.HP || g.Telepon ||
                                '-' }}</td>
                            <td class="td-premium text-center">
                                <div class="action-buttons">
                                    <button class="action-btn-detail" @click="showDetail(g)"><font-awesome-icon
                                            icon="eye" class="text-xs" /></button>
                                    <button class="action-btn-edit" @click="openModal(g)"><font-awesome-icon icon="pen"
                                            class="text-xs" /></button>
                                    <button class="action-btn-delete" @click="handleDelete(g)"><font-awesome-icon
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

        <!-- Detail Modal -->
        <GtkDetailModal v-if="detailData" :gtk="detailData" @close="detailData = null" />

        <!-- Form Modal -->
        <GtkModal v-if="showModal" :edit-data="editData" @close="closeModal" @save="handleSave" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useGtk } from '@/composables/useGtk'
import { useSwal } from '@/plugins/sweetalert'
import Pagination from '@/components/common/Pagination.vue'
import GtkDetailModal from './GtkDetailModal.vue'
import GtkModal from './GtkModal.vue'

const { isLoading, searchQuery, currentPage, itemsPerPage, paginatedGtk, totalData, totalPages, loadGtk, saveGtk, deleteGtk, exportToExcel, downloadTemplate, importFromExcel } = useGtk()
const { successPremium, errorPremium, confirmDelete, loading, closeLoading } = useSwal()

const showDropdown = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const showModal = ref(false)
const editData = ref<any>(null)
const detailData = ref<any>(null)

onMounted(() => loadGtk())
watch(showDropdown, (val) => { if (val) setTimeout(() => document.addEventListener('click', () => showDropdown.value = false, { once: true }), 0) })

const openModal = (data?: any) => { editData.value = data || null; showModal.value = true }
const closeModal = () => { showModal.value = false; editData.value = null }
const showDetail = (g: any) => { detailData.value = g }

const handleSave = async (formData: any) => {
    loading('Menyimpan...')
    try { await saveGtk(formData, editData.value?.id); await loadGtk(); closeLoading(); successPremium(editData.value ? 'GTK Diperbarui!' : 'GTK Ditambahkan!', 'Data berhasil disimpan.'); closeModal() }
    catch (err: any) { closeLoading(); errorPremium('Gagal!', err.message) }
}

const handleDelete = async (g: any) => {
    if (!await confirmDelete()) return
    loading('Menghapus...')
    try { await deleteGtk(g.id!); await loadGtk(); closeLoading(); successPremium('Terhapus!', `"${g.Nama}" dihapus.`) }
    catch (err: any) { closeLoading(); errorPremium('Gagal!', err.message) }
}

const handleExport = () => { showDropdown.value = false; exportToExcel() }
const handleImportClick = () => { showDropdown.value = false; fileInput.value?.click() }
const handleTemplate = () => { showDropdown.value = false; downloadTemplate() }
const handleImportFile = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
    loading('Mengimpor...')
    try { const c = await importFromExcel(file); await loadGtk(); closeLoading(); successPremium('Berhasil!', `${c} GTK diimpor.`) }
    catch (err: any) { closeLoading(); errorPremium('Gagal!', err.message) }
    if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
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
    border-bottom: 1px solid rgba(255, 255, 255, .05)
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
    gap: .4rem;
    opacity: 0;
    transition: opacity .3s
}

.tr-premium:hover .action-buttons {
    opacity: 1
}

.action-btn-edit {
    width: 30px;
    height: 30px;
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
    width: 30px;
    height: 30px;
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

.action-btn-detail {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(168, 85, 247, .15);
    color: #c084fc;
    border: 1px solid rgba(168, 85, 247, .2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s
}

.action-btn-detail:hover {
    background: #a855f7;
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
