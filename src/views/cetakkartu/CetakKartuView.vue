<template>
    <div>
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
            <div>
                <h1 class="text-3xl md:text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                    <span
                        class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <font-awesome-icon icon="id-card" class="text-blue-400 text-lg" />
                    </span>
                    Cetak Kartu Siswa
                </h1>
                <p class="text-gray-400 text-sm mt-2 ml-13">Manajemen cetak kartu pelajar dengan fitur pencarian dan
                    filter cepat</p>
            </div>
        </div>

        <!-- Filter Bar -->
        <div class="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div class="w-full md:w-48">
                <label class="text-brand-gold text-[10px] font-bold uppercase tracking-wider block mb-2">Filter
                    Kelas</label>
                <select v-model="filterKelas" class="input-dark w-full py-2.5 cursor-pointer">
                    <option v-for="k in kelasList" :key="k" :value="k">{{ k }}</option>
                </select>
            </div>
            <div class="w-full md:w-64">
                <label class="text-brand-gold text-[10px] font-bold uppercase tracking-wider block mb-2">Cari Nama /
                    NISN</label>
                <div class="relative">
                    <font-awesome-icon icon="search"
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input v-model="searchQuery" class="input-dark w-full" style="padding-left: 2.75rem !important;"
                        placeholder="Ketik nama atau NISN..." />
                </div>
            </div>
            <div class="flex gap-2 w-full md:w-auto md:ml-auto">
                <button @click="toggleSelectAllFiltered" class="btn-filter-action"
                    :class="isAllFilteredChecked ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white'">
                    <font-awesome-icon :icon="isAllFilteredChecked ? 'square-minus' : 'square-check'" class="mr-2" />
                    {{ isAllFilteredChecked ? 'Batal Semua' : 'Pilih Semua' }}
                </button>
                <button @click="handleCetak" :disabled="selectedCount === 0" class="btn-gold-premium group"
                    :class="{ 'opacity-50 cursor-not-allowed': selectedCount === 0 }">
                    <font-awesome-icon icon="print" class="mr-2" /> Cetak ({{ selectedCount }})
                </button>
            </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Table -->
            <div class="lg:col-span-2 flex flex-col">
                <div class="glass-card overflow-hidden flex-1">
                    <div class="table-wrapper custom-scrollbar max-h-[55vh] overflow-y-auto">
                        <table class="w-full text-xs md:text-sm text-left">
                            <thead
                                class="sticky top-0 bg-brand-main text-brand-gold font-bold uppercase tracking-wider text-[11px] z-10 shadow-md">
                                <tr>
                                    <th class="px-4 py-3.5 w-12 text-center">
                                        <input type="checkbox" :checked="isAllPageChecked"
                                            @change="toggleSelectAllPage(($event.target as HTMLInputElement).checked)"
                                            class="w-4 h-4 accent-blue-500 cursor-pointer rounded" />
                                    </th>
                                    <th class="px-3 py-3.5 text-center w-12">No</th>
                                    <th class="px-4 py-3.5">Nama Siswa</th>
                                    <th class="px-4 py-3.5 text-center w-24">Kelas</th>
                                    <th class="px-4 py-3.5 text-center w-16">L/P</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                <tr v-if="isLoading">
                                    <td colspan="5" class="py-16 text-center">
                                        <div class="flex flex-col items-center gap-3">
                                            <div class="loading-spinner-premium">
                                                <div class="spinner-ring"></div>
                                                <div class="spinner-ring-reverse"></div>
                                                <font-awesome-icon icon="database"
                                                    class="text-blue-400 text-sm z-10 animate-pulse" />
                                            </div>
                                            <p
                                                class="text-[10px] text-blue-400 font-mono tracking-widest uppercase animate-pulse">
                                                Memuat data...</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else-if="!paginatedSiswa.length">
                                    <td colspan="5" class="text-center py-16 text-gray-500 font-mono">Siswa tidak
                                        ditemukan.</td>
                                </tr>
                                <tr v-for="(s, i) in paginatedSiswa" :key="s.NISN" @click="previewSiswa = s"
                                    class="hover:bg-blue-500/5 border-b border-white/5 cursor-pointer">
                                    <td class="px-4 py-3 text-center" @click.stop>
                                        <input type="checkbox" :checked="selectedNisns.has(s.NISN)"
                                            @change="toggleRow(s.NISN)" class="w-4 h-4 accent-blue-500 rounded" />
                                    </td>
                                    <td class="px-3 py-3 text-center text-gray-500">{{ (currentPage - 1) * rowsPerPage +
                                        i + 1 }}</td>
                                    <td class="px-4 py-3 font-medium text-white uppercase">{{ s.Nama_Siswa }}</td>
                                    <td class="px-4 py-3 text-center text-brand-gold font-bold">{{ s.Kelas }}</td>
                                    <td class="px-4 py-3 text-center">
                                        <span v-if="s.Jenis_Kelamin === 'Laki-laki'"
                                            class="badge-jk-male"><font-awesome-icon icon="mars" class="mr-1" />L</span>
                                        <span v-else class="badge-jk-female"><font-awesome-icon icon="venus"
                                                class="mr-1" />P</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- Pagination -->
                <div class="flex items-center justify-between mt-4 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span class="text-xs text-gray-400">Menampilkan <b class="text-white">{{ filteredSiswa.length ?
                        (currentPage - 1) * rowsPerPage + 1 : 0 }}</b> - <b class="text-white">{{
                                Math.min(currentPage * rowsPerPage, filteredSiswa.length) }}</b> dari <b
                            class="text-blue-400">{{ filteredSiswa.length }}</b></span>
                    <div class="flex gap-1.5">
                        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                            class="pagination-btn"><font-awesome-icon icon="chevron-left" /></button>
                        <div
                            class="px-4 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-xs">
                            {{ currentPage }}/{{ totalPages }}</div>
                        <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                            :disabled="currentPage === totalPages" class="pagination-btn"><font-awesome-icon
                                icon="chevron-right" /></button>
                    </div>
                </div>
            </div>

            <!-- Preview -->
            <div class="lg:col-span-1">
                <div
                    class="glass-card p-5 sticky top-20 border border-blue-500/20 bg-gradient-to-b from-slate-900/90 to-blue-950/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <h3
                        class="text-blue-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-blue-500/20 pb-2">
                        <font-awesome-icon icon="id-card" class="animate-pulse" /> Live ID Preview
                    </h3>

                    <!-- Preview Kartu Premium -->
                    <div v-if="previewSiswa" class="flex flex-col items-center">
                        <div
                            class="relative w-[290px] h-[180px] rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 border border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.3)] overflow-hidden text-white flex flex-col justify-between animate-fadeIn">

                            <!-- Header -->
                            <div
                                class="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 p-2.5 pb-3 border-b border-blue-500/20 z-10">
                                <div
                                    class="absolute inset-0 bg-[radial-gradient(circle_at_top_left)] from-blue-400/20 via-transparent to-transparent pointer-events-none">
                                </div>
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-md">
                                        <font-awesome-icon icon="graduation-cap" class="text-amber-400 text-[10px]" />
                                    </div>
                                    <div class="leading-none flex-1">
                                        <h4 class="text-[7.5px] font-bold text-blue-300 tracking-widest uppercase">{{
                                            settings.INSTITUSI || 'PEMERINTAH PROVINSI' }}</h4>
                                        <h3
                                            class="text-[9.5px] font-black text-white tracking-wide uppercase mt-0.5 drop-shadow-sm">
                                            {{ settings.NAMA_SEKOLAH || 'SMA NEGERI 1 MOILONG' }}</h3>
                                    </div>
                                </div>
                            </div>

                            <!-- Body -->
                            <div class="flex gap-3 items-center px-3 py-1 z-10 flex-1">
                                <!-- Foto -->
                                <div
                                    class="w-[52px] h-[70px] bg-slate-900 rounded-lg border border-slate-700 p-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.3)] overflow-hidden flex-shrink-0">
                                    <img :src="previewSiswa.Foto_URL || placeholderUrl(previewSiswa.Nama_Siswa)"
                                        referrerpolicy="no-referrer" crossorigin="anonymous"
                                        class="w-full h-full object-cover rounded-[5px]"
                                        @error="($event.target as HTMLImageElement).src = placeholderUrl(previewSiswa.Nama_Siswa)" />
                                </div>

                                <!-- Info -->
                                <div class="flex-1 min-w-0 text-[9px] flex flex-col gap-0.5">
                                    <div class="font-black text-xs text-white truncate tracking-wide">{{
                                        previewSiswa.Nama_Siswa?.toUpperCase() }}</div>
                                    <div class="flex mt-0.5">
                                        <span class="w-10 text-slate-500 font-mono">NISN</span>
                                        <span class="mr-1.5 text-blue-400">:</span>
                                        <span class="font-mono font-bold text-slate-200">{{ previewSiswa.NISN }}</span>
                                    </div>
                                    <div class="flex">
                                        <span class="w-10 text-slate-500 font-mono">NIS</span>
                                        <span class="mr-1.5 text-blue-400">:</span>
                                        <span class="font-mono text-slate-200">{{ previewSiswa.NIS || '-' }}</span>
                                    </div>
                                    <div class="flex">
                                        <span class="w-10 text-slate-500 font-mono">KELAS</span>
                                        <span class="mr-1.5 text-blue-400">:</span>
                                        <span class="font-bold text-slate-200">{{ previewSiswa.Kelas }}</span>
                                    </div>
                                    <div class="flex items-start">
                                        <span class="w-10 text-slate-500 font-mono">TTL</span>
                                        <span class="mr-1.5 text-blue-400">:</span>
                                        <span class="truncate text-slate-300 pr-1">{{ previewSiswa.Tempat_Lahir || '-'
                                        }}, {{ previewSiswa.Tanggal_Lahir || '-' }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Footer dengan Wave -->
                            <div class="relative h-9 flex items-end justify-between px-3 pb-2 z-10">
                                <!-- Wave SVG -->
                                <div class="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
                                    <svg class="wave1" viewBox="0 0 1000 120" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="goldA" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stop-color="#B8860B"></stop>
                                                <stop offset="50%" stop-color="#FFF4C1"></stop>
                                                <stop offset="100%" stop-color="#B8860B"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M0,10 C250,120 750,120 1000,10 L1000,120 L0,120 Z" fill="url(#goldA)">
                                        </path>
                                    </svg>
                                    <svg class="wave2" viewBox="0 0 1000 120" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="goldB" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stop-color="#D4AF37"></stop>
                                                <stop offset="50%" stop-color="#FFF9DD"></stop>
                                                <stop offset="100%" stop-color="#D4AF37"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M0,30 C250,130 750,130 1000,30 L1000,120 L0,120 Z" fill="url(#goldB)">
                                        </path>
                                    </svg>
                                </div>

                                <span
                                    class="bg-slate-600/80 backdrop-blur-sm text-teal-400 border border-blue-500/30 px-2 py-0.5 rounded-md font-mono font-black text-[6.5px] tracking-wider uppercase shadow-sm">OFFICIAL
                                    E-CARD</span>
                                <span
                                    class="bg-slate-950/80 backdrop-blur-sm text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-sans font-black text-[6.5px] tracking-wider uppercase shadow-sm">KARTU
                                    PELAJAR</span>
                            </div>
                        </div>

                        <p class="text-center mt-3 text-[11px] text-blue-300/60 font-medium">
                            <font-awesome-icon icon="circle-info" class="mr-1" /> Tampilan pratinjau: <b>{{
                                previewSiswa.Nama_Siswa }}</b>
                        </p>
                    </div>

                    <!-- Empty State -->
                    <div v-else
                        class="flex justify-center items-center min-h-[260px] bg-black/30 rounded-xl border border-white/5 p-4">
                        <p class="text-gray-400 text-xs text-center font-mono">Klik baris siswa di tabel untuk melihat
                            pratinjau kartu.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Print Modal -->
        <Teleport to="body">
            <div v-if="showPrintModal" class="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center">
                <div class="bg-[#1e0a2d] border border-brand-gold/30 rounded-3xl p-8 max-w-lg w-full mx-4">
                    <div class="text-center">
                        <font-awesome-icon icon="print" class="text-brand-gold text-4xl mb-4" />
                        <h3 class="text-white font-bold text-xl mb-2">Mencetak {{ selectedCount }} Kartu</h3>
                        <p class="text-gray-400 text-sm mb-6">Jendela cetak akan terbuka. Gunakan <b>Ctrl+P</b> atau
                            klik tombol di bawah.</p>
                        <div class="flex gap-3 justify-center">
                            <button @click="showPrintModal = false" class="btn-cancel-premium">Batal</button>
                            <button @click="doPrint" class="btn-save-premium"><font-awesome-icon icon="print"
                                    class="mr-2" /> Cetak Sekarang</button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCetakKartu } from '@/composables/useCetakKartu'
import { useSettings } from '@/composables/useSettings'

const {
    isLoading, searchQuery, filterKelas, selectedNisns, currentPage, rowsPerPage,
    kelasList, filteredSiswa, paginatedSiswa, totalPages, selectedCount,
    isAllPageChecked, isAllFilteredChecked,
    loadSiswa, toggleSelectAllPage, toggleSelectAllFiltered, toggleRow, getSelectedSiswa,
} = useCetakKartu()

const { settings, loadSettings } = useSettings()

const previewSiswa = ref<any>(null)
const showPrintModal = ref(false)

onMounted(async () => {
    await loadSettings()
    await loadSiswa()
})


const placeholderUrl = (nama: string) => {
    const initials = (nama || '??').split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase()
    return `https://placehold.co/150x200/2563eb/ffffff?text=${initials}`
}

const handleCetak = () => {
    if (selectedCount.value === 0) return
    showPrintModal.value = true
}

const doPrint = () => {
    const selected = getSelectedSiswa()
    if (!selected.length) return

    const printWindow = window.open('', '', 'width=1200,height=800')
    if (!printWindow) return

    const logoKiri = settings.value.LOGO_INSTITUSI || ''
    const logoKanan = settings.value.LOGO_SEKOLAH || ''
    const ttdUrl = settings.value.GAMBAR_TTD_KEPSEK || ''
    const bgGaruda = 'https://lh3.googleusercontent.com/d/1UfsOEi3o1e-JH7oCEfu9iMAreCPFaw53'
    const institusi = (settings.value.INSTITUSI || 'PEMERINTAH PROVINSI SULAWESI TENGAH').toUpperCase()
    const namaSekolah = (settings.value.NAMA_SEKOLAH || 'SMA NEGERI 1 MOILONG').toUpperCase()
    const alamatSekolah = settings.value.ALAMAT_SEKOLAH || 'Jl. Siswa No.1 Sidoharjo Kec. Moilong Kab. Banggai'
    const namaKepsek = settings.value.NAMA_KEPALA_SEKOLAH || 'KEPALA SEKOLAH'
    const nipKepsek = settings.value.NIP_KEPALA_SEKOLAH || '-'

    const getInisial = (nama: string) => {
        if (!nama) return 'NA'
        const kata = nama.trim().toUpperCase().split(/\s+/)
        if (kata.length >= 2) return kata[0][0] + kata[1][0]
        return (kata[0].substring(0, 2) || 'NA').padEnd(2, 'A')
    }

    const getTanggalCetak = (tahunMasuk: string) => {
        let d = new Date(parseInt(tahunMasuk) || 2024, 6, 1)
        const daftarLibur = ['2024-07-07', '2025-06-27']
        const formatCek = (date: Date) => date.toISOString().split('T')[0]
        while (d.getDay() === 0 || d.getDay() === 6 || daftarLibur.includes(formatCek(d))) {
            d.setDate(d.getDate() + 1)
        }
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    let cardsHTML = ''

    selected.forEach((s, index) => {
        const ttl = `${s.Tempat_Lahir || ''}, ${s.Tanggal_Lahir || ''}`
        const nisn = (s.NISN || '').replace(/[^0-9]/g, '')
        const placeholderUrl = `https://placehold.co/230x285/png?text=${getInisial(s.Nama_Siswa)}`
        const fotoUrl = s.Foto_URL || placeholderUrl
        const qrId = 'qrcode_' + index

        cardsHTML += `
      <div class="kartu-set">
        <!-- KARTU DEPAN -->
        <div class="kartu-depan">
          <div class="header-biru">
            <div class="header-top">
              <img src="${logoKiri}" referrerpolicy="no-referrer" crossorigin="anonymous" class="logo">
              <div class="school">
                <div class="provinsi">${institusi}</div>
                <div class="nama-sekolah">${namaSekolah}</div>
                <div class="alamat-sekolah">${alamatSekolah}</div>
              </div>
              <img src="${logoKanan}" referrerpolicy="no-referrer" crossorigin="anonymous" class="logo">
            </div>
            <div class="white-line"></div>
            <div class="wave-wrapper" style="transform:scaleY(-1)">
              <svg class="wave1" viewBox="0 0 1000 120" preserveAspectRatio="none">
                <defs><linearGradient id="goldA${index}"><stop offset="0%" stop-color="#B8860B"/><stop offset="50%" stop-color="#FFF4C1"/><stop offset="100%" stop-color="#B8860B"/></linearGradient></defs>
                <path d="M0,10 C250,120 750,120 1000,10 L1000,120 L0,120 Z" fill="url(#goldA${index})"/>
              </svg>
              <svg class="wave2" viewBox="0 0 1000 120" preserveAspectRatio="none">
                <defs><linearGradient id="goldB${index}"><stop offset="0%" stop-color="#D4AF37"/><stop offset="50%" stop-color="#FFF9DD"/><stop offset="100%" stop-color="#D4AF37"/></linearGradient></defs>
                <path d="M0,30 C250,130 750,130 1000,30 L1000,120 L0,120 Z" fill="url(#goldB${index})"/>
              </svg>
            </div>
          </div>
          <div class="title-kartu">KARTU PELAJAR</div>
          <div class="content-kartu">
            <img src="${bgGaruda}" class="bg-garuda" referrerpolicy="no-referrer" crossorigin="anonymous"">
            <div class="left-col">
              <img src="${fotoUrl}" class="photo" onerror="this.src='${placeholderUrl}';" referrerpolicy="no-referrer" crossorigin="anonymous">
              <div class="qr-code" id="${qrId}"></div>
              <div class="barcode-nisn">${nisn}</div>
              <div class="teks-nisn">${nisn}</div>
            </div>
            <div class="right-col">
              <table class="biodata">
                <tr><td>NAMA</td><td>:</td><td class="biodata-bold">${(s.Nama_Siswa || '-').toUpperCase()}</td></tr>
                <tr><td>TEMPAT TGL. LAHIR</td><td>:</td><td>${ttl || '-'}</td></tr>
                <tr><td>NO. INDUK SISWA</td><td>:</td><td>${s.NIS || '-'}</td></tr>
                <tr><td>NISN</td><td>:</td><td>${nisn}</td></tr>
                <tr><td>JENIS KELAMIN</td><td>:</td><td>${(s.Jenis_Kelamin || '').startsWith('L') ? 'LAKI-LAKI' : 'PEREMPUAN'}</td></tr>
                <tr><td>AGAMA</td><td>:</td><td>${(s.Agama || '-').toUpperCase()}</td></tr>
                <tr><td>ALAMAT</td><td>:</td><td>${s.Alamat || '-'}</td></tr>
              </table>
              <div class="ttd-section">
                <div class="ttd-box">
                  <div class="ttd-tanggal">Moilong, ${getTanggalCetak(s.Tahun_Masuk)}</div>
                  <div class="kepsek-label">KEPALA SEKOLAH</div>
                  <img src="${ttdUrl}" class="ttd-img" referrerpolicy="no-referrer" crossorigin="anonymous" onerror="this.style.display='none'">
                  <div class="nama-kepsek">${namaKepsek}</div>
                  <div class="nip-kepsek">NIP. ${nipKepsek}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer-kartu">KARTU INI BERLAKU SELAMA MENJADI PELAJAR ${namaSekolah}</div>
        </div>

        <!-- KARTU BELAKANG -->
        <div class="kartu-depan">
          <div class="header-biru" style="height:12mm">
            <div style="transform:scaleY(-1)">
              <svg class="wave1" viewBox="0 0 1000 120" preserveAspectRatio="none" style="top:-100">
                <defs><linearGradient id="goldA2${index}"><stop offset="0%" stop-color="#B8860B"/><stop offset="50%" stop-color="#FFF4C1"/><stop offset="100%" stop-color="#B8860B"/></linearGradient></defs>
                <path d="M0,10 C250,120 750,120 1000,10 L1000,120 L0,120 Z" fill="url(#goldA2${index})"/>
              </svg>
              <svg class="wave2" viewBox="0 0 1000 120" preserveAspectRatio="none" style="top:-100">
                <defs><linearGradient id="goldB2${index}"><stop offset="0%" stop-color="#D4AF37"/><stop offset="50%" stop-color="#FFF9DD"/><stop offset="100%" stop-color="#D4AF37"/></linearGradient></defs>
                <path d="M0,30 C250,130 750,130 1000,30 L1000,120 L0,120 Z" fill="url(#goldB2${index})"/>
              </svg>
            </div>
          </div>
          <div class="title-belakang">KETENTUAN PEMEGANG KARTU</div>
          <div class="content-kartu">
            <img src="${bgGaruda}" class="bg-garuda" style="top:70;position:absolute" referrerpolicy="no-referrer" crossorigin="anonymous">
            <ol class="ketentuan-list">
              <li>Pemegang Kartu ini adalah Pelajar ${namaSekolah} yang terdaftar di Data Pokok Pendidikan (Dapodik);</li>
              <li>Setiap Pelajar wajib memiliki dan membawa kartu pelajar ke sekolah setiap hari;</li>
              <li>Kartu Pelajar berfungsi sebagai bukti identitas resmi dan tidak boleh dipindahtangankan atau dipinjamkan kepada orang lain;</li>
              <li>Penyalahgunaan Kartu Pelajar ini akan dikenakan sanksi sesuai hukum yang berlaku.</li>
            </ol>
            <div class="footer-belakang">${alamatSekolah}</div>
          </div>
          <div class="footer-kartu">KARTU INI BERLAKU SELAMA MENJADI PELAJAR ${namaSekolah}</div>
        </div>
      </div>`
    })

    // Tulis ke print window
    printWindow.document.write(`<html><head><title>Cetak Kartu Pelajar</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
    <style>
      @page{size:A4;margin:2mm}*{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif;vertical-align:middle}
      body{background:#fff;padding:0;display:flex;flex-wrap:wrap;gap:0;justify-content:center;align-content:flex-start}
      .kartu-set{display:flex;flex-direction:row;gap:8mm;page-break-inside:avoid;break-inside:avoid;margin-bottom:1mm;margin-top:2mm}
      .kartu-depan{width:85.6mm;height:54mm;background:#fff;border-radius:2mm;overflow:hidden;position:relative;box-shadow:0 1mm 3mm rgba(0,0,0,.15)}
      .header-biru{background:#083b6d;color:white;height:16mm;position:relative}
      .header-top{display:flex;align-items:center;justify-content:space-between;padding:1.5mm 2mm}
      .logo{width:8mm;height:8mm;object-fit:contain}.school{flex:1;text-align:center}
      .provinsi{font-size:2.5mm;font-weight:600;letter-spacing:.5px}
      .nama-sekolah{font-size:4.3mm;font-weight:650;line-height:.9}
      .alamat-sekolah{font-size:1.2mm;margin-top:.3mm;letter-spacing:-.11px}
      .wave-wrapper{position:absolute;left:0;bottom:-1mm;width:100%;height:8mm}
      .wave1,.wave2{position:absolute;left:0;width:100%}.wave1{bottom:15;height:14mm}.wave2{bottom:2.5mm;height:14mm}
      .white-line{width:100%;background:white;position:absolute;z-index:999;border-top:2px solid #fff;margin-top:-5px}
      .bg-garuda{position:absolute;top:39%;left:50%;transform:translate(-50%,-50%);width:95%;opacity:.23;z-index:0}
      .title-kartu{position: relative;text-align:center;margin:-3.9mm 0;color:#083b6d;font-size:3.2mm;font-weight:800;margin-bottom:.5mm;left: -2%;}
      .content-kartu{display:flex;gap:1.5mm;padding:0 2mm;position:relative;margin-top:-2}
      .left-col{width:20mm;flex-shrink:0}
      .photo{width:20mm;height:27mm;object-fit:cover;border:.5px solid #ddd;position:absolute;border-radius:4px;left:2.5%}
      .qr-code{position:absolute;transform:translate(547%,169%) scale(.85)}
      .barcode-nisn{font-family:'Libre Barcode 128',cursive!important;font-size:33px;color:#000;position:absolute;white-space:nowrap;transform:translateX(-49.5%) scaleX(.7);top:100px;left:46px}
      .teks-nisn{font-size:6px;letter-spacing:4px;color:#333;position:absolute;left:10px;top:119px}
      .right-col{flex:1}.biodata{width:100%;border-collapse:collapse;margin-top:1}
      .biodata td{padding:0;font-size:2.05mm;letter-spacing:-.1px}
      .biodata td:first-child{width:19mm}.biodata td:nth-child(2){width:1.5mm}
      .biodata-bold{font-weight:700!important}
      .ttd-section{margin-top:.5mm;text-align:right}
      .ttd-box{margin-left:auto;text-align:center;font-size:1.7mm;margin-top:-3px;line-height:1.1}
      .ttd-img{position:absolute;top:-5%;left:25%;transform:translate(30%,100%);width:34%;opacity:1;z-index:0;height:68px;object-fit:contain}
      .ttd-tanggal{font-size:1.9mm}.kepsek-label{font-size:1.8mm;font-weight:500}.nama-kepsek{margin-top:4.5mm;font-size:1.8mm;font-weight:600}.nip-kepsek{margin-top:-1.5}
      .footer-kartu{position:absolute;left:0;bottom:0;width:100%;background:#083b6d;color:white;text-align:left;padding:.6mm .6mm .6mm 12px;font-weight:600;font-size:1.2mm}
      .title-belakang{font-size:3.5mm;font-weight:800;color:#fff;margin-bottom:2mm;background:#083b6d;text-align:center;position:absolute;top:10%;transform:translate(30%,-20%)}
      .ketentuan-list{text-align:left;font-size:2.2mm;padding:4mm;line-height:1.65;position:absolute;top:-5px;font-weight:400}
      .footer-belakang{position:absolute;bottom:-38mm;left:24px;right:0;font-size:1.8mm;color:#493c3c;font-weight:700}
      @media print{body{background:white}.kartu-depan{box-shadow:none}}
    </style>
  </head><body>${cardsHTML}</body></html>`)

    printWindow.document.close()

    // Generate QR Code setelah document siap
    setTimeout(() => {
        if (printWindow.document.querySelector('.qr-code')) {
            selected.forEach((s, index) => {
                const qrContainer = printWindow.document.getElementById('qrcode_' + index)
                if (qrContainer && typeof (printWindow as any).QRCode !== 'undefined') {
                    qrContainer.innerHTML = ''
                    new (printWindow as any).QRCode(qrContainer, {
                        text: JSON.stringify({
                            nisn: (s.NISN || '').replace(/[^0-9]/g, ''),
                            nama: s.Nama_Siswa,
                            ttl: `${s.Tempat_Lahir || ''}, ${s.Tanggal_Lahir || ''}`
                        }),
                        width: 48,
                        height: 48,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: (printWindow as any).QRCode.CorrectLevel.M
                    })
                }
            })
        }

        setTimeout(() => {
            printWindow.print()
            showPrintModal.value = false
        }, 400)
    }, 600)
}
</script>

<style scoped>
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
    width: 100%
}

.btn-gold-premium {
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #1e0a2d;
    font-weight: 700;
    border-radius: .75rem;
    padding: .6rem 1.5rem;
    font-size: .875rem;
    display: flex;
    align-items: center;
    gap: .5rem;
    border: none;
    cursor: pointer;
    transition: all .3s;
    box-shadow: 0 0 15px rgba(251, 191, 36, .3)
}

.btn-gold-premium:hover:not(:disabled) {
    box-shadow: 0 0 25px rgba(251, 191, 36, .5);
    transform: translateY(-2px)
}

.btn-filter-action {
    flex: 1;
    padding: .6rem 1rem;
    border-radius: .75rem;
    font-size: .8rem;
    font-weight: 700;
    border: 1px solid;
    cursor: pointer;
    transition: all .3s;
    display: flex;
    align-items: center;
    justify-content: center
}

.pagination-btn {
    width: 34px;
    height: 34px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, .1);
    background: rgba(0, 0, 0, .3);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center
}

.pagination-btn:disabled {
    opacity: .3;
    cursor: not-allowed
}

.badge-jk-male {
    background: rgba(59, 130, 246, .1);
    color: #60a5fa;
    border: 1px solid rgba(59, 130, 246, .2);
    padding: .1rem .5rem;
    border-radius: 4px;
    font-size: .65rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center
}

.badge-jk-female {
    background: rgba(236, 72, 153, .1);
    color: #f472b6;
    border: 1px solid rgba(236, 72, 153, .2);
    padding: .1rem .5rem;
    border-radius: 4px;
    font-size: .65rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center
}

.loading-spinner-premium {
    position: relative;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center
}

.spinner-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite
}

.spinner-ring-reverse {
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-bottom-color: #60a5fa;
    animation: spin .7s linear infinite reverse
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
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

.table-wrapper {
    overflow-x: auto
}

.wave1 {
    position: absolute;
    left: 0;
    bottom: 8px;
    width: 100%;
    height: 14px;
}

.wave2 {
    position: absolute;
    left: 0;
    bottom: 2px;
    width: 100%;
    height: 14px;
}

.animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
