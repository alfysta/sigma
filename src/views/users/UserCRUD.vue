<template>
    <div>
        <!-- ========== HEADER PREMIUM ========== -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
            <div>
                <h1 class="text-3xl md:text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                    <span
                        class="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                        <font-awesome-icon icon="users-gear" class="text-brand-gold text-lg" />
                    </span>
                    Manajemen User
                </h1>
                <p class="text-gray-400 text-sm mt-2 ml-13">Kelola akun pengguna aplikasi dengan mudah</p>
            </div>
            <div class="flex items-center flex-wrap gap-2">
                <button class="btn-gold-premium group" @click="openUserModal()">
                    <span class="btn-gold-icon">
                        <font-awesome-icon icon="plus" class="text-sm" />
                    </span>
                    <span>Tambah User</span>
                    <font-awesome-icon icon="chevron-right"
                        class="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </button>

                <!-- Dropdown Aksi -->
                <div class="relative">
                    <button class="btn-secondary-premium" @click.stop="showDropdown = !showDropdown">
                        <font-awesome-icon icon="ellipsis-vertical" class="text-base" />
                        <span>Aksi</span>
                        <font-awesome-icon icon="caret-down" class="text-[10px] transition-transform duration-300"
                            :class="{ 'rotate-180': showDropdown }" />
                    </button>

                    <Transition name="dropdown-fade">
                        <div v-if="showDropdown" class="dropdown-premium" @click.stop>
                            <div class="dropdown-header">
                                <font-awesome-icon icon="bolt" class="text-brand-gold text-xs" />
                                <span class="text-[10px] text-gray-500 uppercase tracking-widest">Actions Menu</span>
                            </div>
                            <button @click="handleExport">
                                <span class="dropdown-icon bg-emerald-500/10 text-emerald-400">
                                    <font-awesome-icon icon="file-export" />
                                </span>
                                <div class="text-left">
                                    <p class="text-sm font-medium text-white">Ekspor Data</p>
                                    <p class="text-[10px] text-gray-500">Download .xlsx</p>
                                </div>
                            </button>

                            <button @click="handleImportClick">
                                <span class="dropdown-icon bg-blue-500/10 text-blue-400">
                                    <font-awesome-icon icon="file-import" />
                                </span>
                                <div class="text-left">
                                    <p class="text-sm font-medium text-white">Impor Data</p>
                                    <p class="text-[10px] text-gray-500">Upload .xlsx</p>
                                </div>
                            </button>

                            <button @click="handleDownloadTemplate">
                                <span class="dropdown-icon bg-purple-500/10 text-purple-400">
                                    <font-awesome-icon icon="file-excel" />
                                </span>
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

        <!-- ========== FILTER PREMIUM ========== -->
        <div class="filter-premium mb-4">
            <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <font-awesome-icon icon="search" class="text-brand-gold text-sm" />
                </span>
                <input v-model="searchQuery" class="input-premium w-full"
                    style="padding-left: 2.75rem !important; padding-right: 2.5rem !important;"
                    placeholder="Cari username, nama lengkap, atau role..." />
                <span v-if="searchQuery" @click="searchQuery = ''"
                    class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-red-400 transition-colors z-10">
                    <font-awesome-icon icon="times" class="text-xs" />
                </span>
            </div>
            <div class="filter-limit">
                <font-awesome-icon icon="list" class="text-gray-500 text-xs" />
                <select v-model.number="itemsPerPage" class="select-premium">
                    <option :value="15">15 baris</option>
                    <option :value="30">30 baris</option>
                    <option :value="50">50 baris</option>
                    <option :value="100">100 baris</option>
                </select>
            </div>
        </div>

        <!-- ========== TABLE PREMIUM ========== -->
        <div class="table-card-premium">
            <div class="table-wrapper custom-scrollbar">
                <table class="w-full text-xs md:text-sm text-left">
                    <thead>
                        <tr>
                            <th class="th-premium w-12 text-center">No</th>
                            <th class="th-premium">
                                <font-awesome-icon icon="user" class="mr-2 text-brand-gold/60" />Username
                            </th>
                            <th class="th-premium text-center">
                                <font-awesome-icon icon="user-gear" class="mr-2 text-brand-gold/60" />Role
                            </th>
                            <th class="th-premium text-center">
                                <font-awesome-icon icon="circle-check" class="mr-2 text-brand-gold/60" />Status
                            </th>
                            <th class="th-premium">
                                <font-awesome-icon icon="id-card" class="mr-2 text-brand-gold/60" />Nama Lengkap
                            </th>
                            <th class="th-premium text-center w-24">
                                <font-awesome-icon icon="gear" class="mr-2 text-brand-gold/60" />Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/[0.03]">
                        <!-- Loading -->
                        <tr v-if="isLoading">
                            <td colspan="6" class="py-20">
                                <div class="loading-premium">
                                    <div class="loading-spinner-premium">
                                        <div class="spinner-ring"></div>
                                        <div class="spinner-ring-reverse"></div>
                                        <font-awesome-icon icon="users-gear"
                                            class="text-brand-gold text-2xl z-10 animate-pulse" />
                                    </div>
                                    <p class="text-gray-400 text-sm font-medium mt-4">Memuat data User...</p>
                                </div>
                            </td>
                        </tr>

                        <!-- Empty -->
                        <tr v-else-if="!paginatedUsers.length">
                            <td colspan="6" class="py-20">
                                <div class="empty-premium">
                                    <div class="empty-icon-circle">
                                        <font-awesome-icon icon="users-slash" class="text-4xl text-gray-600" />
                                    </div>
                                    <p class="text-gray-400 text-sm font-medium mt-4">Tidak ada data user</p>
                                    <p class="text-gray-600 text-xs mt-1">Klik "Tambah User" untuk menambahkan</p>
                                </div>
                            </td>
                        </tr>

                        <!-- Data Rows -->
                        <tr v-for="(user, index) in paginatedUsers" :key="user.id" class="tr-premium group">
                            <td class="td-premium text-center">
                                <span class="text-gray-500 text-xs font-mono">{{ (currentPage - 1) * itemsPerPage +
                                    index + 1 }}</span>
                            </td>
                            <td class="td-premium">
                                <div class="flex items-center gap-3">
                                    <div class="user-avatar-mini">
                                        <span>{{ getUserInitials(user.Nama_Lengkap) }}</span>
                                    </div>
                                    <span class="font-bold text-white">{{ user.Username || '-' }}</span>
                                </div>
                            </td>
                            <td class="td-premium text-center">
                                <span :class="user.Role === 'Guru' ? 'badge-role-guru' : 'badge-role-siswa'">
                                    <font-awesome-icon
                                        :icon="user.Role === 'Guru' ? 'chalkboard-user' : 'user-graduate'"
                                        class="text-[10px] mr-1" />
                                    {{ user.Role }}
                                </span>
                            </td>
                            <td class="td-premium text-center">
                                <span
                                    :class="user.Status === 'Aktif' ? 'badge-status-active' : 'badge-status-inactive'">
                                    <font-awesome-icon :icon="user.Status === 'Aktif' ? 'circle-check' : 'circle-xmark'"
                                        class="text-[10px] mr-1" />
                                    {{ user.Status }}
                                </span>
                            </td>
                            <td class="td-premium text-gray-300">{{ user.Nama_Lengkap || '-' }}</td>
                            <td class="td-premium text-center">
                                <div class="action-buttons">
                                    <button class="action-btn-edit" @click="openUserModal(user)" title="Edit">
                                        <font-awesome-icon icon="pen" class="text-xs" />
                                    </button>
                                    <button class="action-btn-delete" @click="handleDelete(user)" title="Hapus">
                                        <font-awesome-icon icon="trash-can" class="text-xs" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Pagination :total="totalData" v-model:current-page="currentPage" :total-pages="totalPages" />
        </div>

        <!-- Hidden File Input -->
        <input ref="fileInput" type="file" accept=".xlsx, .xls" class="hidden" @change="handleImportFile" />

        <!-- ========== MODAL SLIDE PREMIUM ========== -->
        <Teleport to="body">
            <Transition name="overlay-fade">
                <div v-if="showModal" class="modal-overlay-premium" @click.self="closeModal">
                    <Transition name="slide-right">
                        <div v-if="showModal" class="modal-panel-premium">
                            <!-- Modal Header -->
                            <div class="modal-header-premium">
                                <div class="flex items-center gap-3">
                                    <span class="modal-header-icon">
                                        <font-awesome-icon :icon="editData ? 'pen' : 'plus'" class="text-sm" />
                                    </span>
                                    <div>
                                        <h2 class="text-lg font-bold text-white">
                                            {{ editData ? 'Edit User' : 'Tambah User' }}</h2>

                                        <p class="text-[10px] text-gray-500 uppercase tracking-wider">
                                            {{ editData ? 'Perbarui data pengguna' : 'Tambahkan pengguna baru' }}
                                        </p>
                                    </div>
                                </div>
                                <button @click="closeModal" class="modal-close-btn">
                                    <font-awesome-icon icon="times" class="text-lg" />
                                </button>
                            </div>

                            <!-- Modal Body -->
                            <div class="modal-body-premium">
                                <!-- Username -->
                                <div class="form-group-premium">
                                    <label>
                                        <font-awesome-icon icon="user" class="text-brand-gold text-[10px] mr-1.5" />
                                        Username
                                    </label>
                                    <input v-model="form.Username" class="input-premium w-full" :readonly="!!editData"
                                        :class="{ 'opacity-60': !!editData }" placeholder="Masukkan username" />
                                    <p v-if="editData" class="text-[10px] text-gray-500 mt-1">
                                        <font-awesome-icon icon="lock" class="mr-1" />Username tidak dapat diubah
                                    </p>
                                </div>

                                <!-- Password -->
                                <div class="form-group-premium">
                                    <label>
                                        <font-awesome-icon icon="key" class="text-brand-gold text-[10px] mr-1.5" />
                                        Password {{ editData ? '(opsional)' : '' }}
                                    </label>
                                    <div class="relative">
                                        <input v-model="form.Password" :type="showPassword ? 'text' : 'password'"
                                            class="input-premium w-full pr-12"
                                            :placeholder="editData ? '•••••••• (kosongkan jika tidak diubah)' : 'Masukkan password'" />
                                        <button @click="showPassword = !showPassword"
                                            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-gold transition-colors">
                                            <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'"
                                                class="text-sm" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Role & Status -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="form-group-premium">
                                        <label>
                                            <font-awesome-icon icon="user-gear"
                                                class="text-brand-gold text-[10px] mr-1.5" />
                                            Role
                                        </label>
                                        <select v-model="form.Role" class="input-premium w-full">
                                            <option value="Guru">👨‍🏫 Guru</option>
                                            <option value="Siswa">🎓 Siswa</option>
                                        </select>
                                    </div>
                                    <div class="form-group-premium">
                                        <label>
                                            <font-awesome-icon icon="circle-check"
                                                class="text-brand-gold text-[10px] mr-1.5" />
                                            Status
                                        </label>
                                        <select v-model="form.Status" class="input-premium w-full">
                                            <option value="Aktif">🟢 Aktif</option>
                                            <option value="Nonaktif">🔴 Nonaktif</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Nama Lengkap -->
                                <div class="form-group-premium">
                                    <label>
                                        <font-awesome-icon icon="id-card" class="text-brand-gold text-[10px] mr-1.5" />
                                        Nama Lengkap
                                    </label>
                                    <input v-model="form.Nama_Lengkap" class="input-premium w-full"
                                        placeholder="Masukkan nama lengkap" />
                                </div>
                            </div>

                            <!-- Modal Footer -->
                            <div class="modal-footer-premium">
                                <button @click="closeModal" class="btn-cancel-premium">
                                    <font-awesome-icon icon="times" class="mr-2" />
                                    Batal
                                </button>
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
import { ref, onMounted, watch } from 'vue'
import { useUser } from '@/composables/useUser'
import { useSwal } from '@/plugins/sweetalert'
import Pagination from '@/components/common/Pagination.vue'

const {
    isLoading, searchQuery, currentPage, itemsPerPage,
    paginatedUsers, totalData, totalPages,
    loadUsers, saveUser, deleteUser, exportToExcel, downloadTemplate, importFromExcel,
} = useUser()

const { successPremium, errorPremium, warningPremium, confirmDelete, loading, closeLoading } = useSwal()

const showDropdown = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Modal
const showModal = ref(false)
const editData = ref<any>(null)
const saving = ref(false)
const showPassword = ref(false)
const form = ref({
    Username: '',
    Password: '',
    Role: 'Guru' as 'Guru' | 'Siswa',
    Status: 'Aktif' as 'Aktif' | 'Nonaktif',
    Nama_Lengkap: '',
})

onMounted(() => loadUsers())

watch(showDropdown, (val) => {
    if (val) setTimeout(() => document.addEventListener('click', () => showDropdown.value = false, { once: true }), 0)
})

const getUserInitials = (name: string) => {
    if (!name) return '??'
    return name.split(' ').filter(w => w).map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const openUserModal = (user?: any) => {
    editData.value = user || null
    showPassword.value = false
    if (user) {
        form.value = {
            Username: user.Username || '',
            Password: '',
            Role: user.Role || 'Guru',
            Status: user.Status || 'Aktif',
            Nama_Lengkap: user.Nama_Lengkap || '',
        }
    } else {
        form.value = { Username: '', Password: '', Role: 'Guru', Status: 'Aktif', Nama_Lengkap: '' }
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editData.value = null
}

const handleSave = async () => {
    // Validasi
    if (!form.value.Username) {
        warningPremium('Data Tidak Lengkap', 'Username wajib diisi!')
        return
    }
    if (!editData.value && !form.value.Password) {
        warningPremium('Data Tidak Lengkap', 'Password wajib diisi untuk user baru!')
        return
    }

    saving.value = true
    loading('Menyimpan data...')

    try {
        await saveUser(form.value, editData.value?.id)
        await loadUsers()
        closeLoading()
        successPremium(
            editData.value ? 'User Diperbarui!' : 'User Ditambahkan!',
            editData.value ? 'Data pengguna berhasil diperbarui.' : 'Pengguna baru berhasil ditambahkan ke sistem.'
        )
        closeModal()
    } catch (err: any) {
        closeLoading()
        errorPremium('Gagal Menyimpan!', err.message || 'Terjadi kesalahan pada server.')
    } finally {
        saving.value = false
    }
}

const handleDelete = async (user: any) => {
    const confirmed = await confirmDelete()
    if (!confirmed) return

    loading('Menghapus user...')
    try {
        await deleteUser(user.id!)
        await loadUsers()
        closeLoading()
        successPremium('Terhapus!', `User "${user.Username}" berhasil dihapus dari sistem.`)
    } catch (err: any) {
        closeLoading()
        errorPremium('Gagal Menghapus!', err.message || 'Terjadi kesalahan pada server.')
    }
}

const handleImportFile = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    loading('Mengimpor data...')
    try {
        const count = await importFromExcel(file)
        await loadUsers()
        closeLoading()
        successPremium('Impor Berhasil!', `${count} user berhasil diimpor ke sistem.`)
    } catch (err: any) {
        closeLoading()
        errorPremium('Gagal Impor!', err.message || 'Terjadi kesalahan saat membaca file.')
    }

    // Reset file input
    if (fileInput.value) fileInput.value.value = ''
}

const handleExport = () => {
    showDropdown.value = false
    exportToExcel()
}

const handleImportClick = () => {
    showDropdown.value = false
    fileInput.value?.click()
}

const handleDownloadTemplate = () => {
    showDropdown.value = false
    downloadTemplate()
}
</script>

<style scoped>
/* ═══════════════════════════════════════════
   BUTTON PREMIUM
   ═══════════════════════════════════════════ */
.btn-gold-premium {
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #1e0a2d;
    font-weight: 700;
    border-radius: 0.75rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
}

.btn-gold-premium:hover {
    box-shadow: 0 0 25px rgba(251, 191, 36, 0.5);
    transform: translateY(-2px);
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

.btn-secondary-premium {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(251, 191, 36, 0.3);
    color: #fbbf24;
    padding: 0.6rem 1.2rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-secondary-premium:hover {
    background: rgba(251, 191, 36, 0.1);
    border-color: rgba(251, 191, 36, 0.5);
}

/* ═══════════════════════════════════════════
   DROPDOWN PREMIUM
   ═══════════════════════════════════════════ */
.dropdown-premium {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    width: 260px;
    background: rgba(20, 5, 35, 0.98);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(251, 191, 36, 0.2);
    border-radius: 16px;
    padding: 8px;
    z-index: 50;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.dropdown-header {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 4px;
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
    transition: all 0.2s;
    text-align: left;
}

.dropdown-premium button:hover {
    background: rgba(255, 255, 255, 0.03);
    color: #fbbf24;
}

.dropdown-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* ═══════════════════════════════════════════
   FILTER PREMIUM
   ═══════════════════════════════════════════ */
.filter-premium {
    display: flex;
    gap: 1rem;
    align-items: center;
    background: rgba(20, 5, 35, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 0.75rem 1rem;
}

.filter-limit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.3);
    padding: 0.4rem 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
}

.select-premium {
    background: transparent;
    color: white;
    border: none;
    font-size: 0.8rem;
    font-weight: 600;
    outline: none;
    cursor: pointer;
}

.input-premium {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(107, 33, 168, 0.4);
    color: white;
    border-radius: 0.75rem;
    padding: 0.6rem 1rem;
    font-size: 0.875rem;
    transition: all 0.3s;
    outline: none;
}

.input-premium:focus {
    border-color: #fbbf24;
    box-shadow: 0 0 12px rgba(251, 191, 36, 0.2);
}

/* ═══════════════════════════════════════════
   TABLE PREMIUM
   ═══════════════════════════════════════════ */
.table-card-premium {
    background: rgba(20, 5, 35, 0.3);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border-radius: 1.5rem;
    overflow: hidden;
}

.th-premium {
    padding: 1rem 1.25rem;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #fbbf24;
    background: #3b0764;
    white-space: nowrap;
}

.td-premium {
    padding: 0.875rem 1.25rem;
}

.tr-premium {
    transition: all 0.2s;
}

.tr-premium:hover {
    background: rgba(255, 255, 255, 0.02);
}

/* Avatar mini */
.user-avatar-mini {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #1e0a2d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.7rem;
    flex-shrink: 0;
}

/* Badges */
.badge-role-guru {
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    border: 1px solid rgba(59, 130, 246, 0.2);
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
}

.badge-role-siswa {
    background: rgba(168, 85, 247, 0.15);
    color: #c084fc;
    border: 1px solid rgba(168, 85, 247, 0.2);
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
}

.badge-status-active {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.2);
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
}

.badge-status-inactive {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.2);
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
}

/* Action buttons */
.action-buttons {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s;
}

.tr-premium:hover .action-buttons {
    opacity: 1;
}

.action-btn-edit {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    border: 1px solid rgba(59, 130, 246, 0.2);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn-edit:hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.action-btn-delete {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.2);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn-delete:hover {
    background: #ef4444;
    color: white;
    border-color: #ef4444;
}

/* Loading premium */
.loading-premium {
    display: flex;
    flex-direction: column;
    align-items: center;
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

/* Empty state */
.empty-premium {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.empty-icon-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.02);
    border: 2px dashed rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ═══════════════════════════════════════════
   MODAL PREMIUM
   ═══════════════════════════════════════════ */
.modal-overlay-premium {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
}

.modal-panel-premium {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #13061c 0%, #0a0015 100%);
    border-left: 1px solid rgba(251, 191, 36, 0.15);
    box-shadow: -10px 0 50px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

@media (min-width: 768px) {
    .modal-panel-premium {
        width: 50%;
        max-width: 550px;
        min-width: 420px;
    }
}

/* Modal Header */
.modal-header-premium {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(30, 10, 45, 0.9);
}

.modal-header-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fbbf24;
}

.modal-close-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #9ca3af;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.modal-close-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border-color: rgba(239, 68, 68, 0.3);
}

/* Modal Body */
.modal-body-premium {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-group-premium label {
    display: flex;
    align-items: center;
    color: #fbbf24;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
}

/* Modal Footer */
.modal-footer-premium {
    flex-shrink: 0;
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(30, 10, 45, 0.9);
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

.btn-cancel-premium {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: #9ca3af;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel-premium:hover {
    background: rgba(255, 255, 255, 0.03);
    color: white;
}

.btn-save-premium {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.5rem;
    border-radius: 0.75rem;
    border: none;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #1e0a2d;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.btn-save-premium:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
    transform: translateY(-1px);
}

.btn-save-premium:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ═══════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════ */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0;
}

/* Slide from RIGHT to LEFT */
.slide-right-enter-active {
    transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.slide-right-leave-active {
    transition: transform 0.25s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.slide-right-enter-from {
    transform: translateX(100%);
}

.slide-right-leave-to {
    transform: translateX(100%);
}

/* Dropdown fade */
.dropdown-fade-enter-active {
    transition: all 0.2s ease-out;
}

.dropdown-fade-leave-active {
    transition: all 0.15s ease-in;
}

.dropdown-fade-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
}

.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
}

/* Table wrapper */
.table-wrapper {
    max-height: 60vh;
    overflow-x: auto;
}
</style>
