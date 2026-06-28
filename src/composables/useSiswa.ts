import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { ref as dbRef, get, set, push, update, remove } from 'firebase/database'
import * as XLSX from 'xlsx'

export interface Siswa {
    id?: string
    Nama_Siswa: string
    NISN: string
    NIS: string
    Agama: string
    Alamat: string
    Jenis_Kelamin: string
    Kelas: string
    Keterangan: string
    Tahun_Ajaran: string
    Tahun_Masuk: string
    Tanggal_Lahir: string
    Tempat_Lahir: string
    Foto_URL: string
}

const DEFAULT_SISWA: Siswa = {
    Nama_Siswa: '', NISN: '', NIS: '', Agama: 'Islam', Alamat: '',
    Jenis_Kelamin: 'Laki-laki', Kelas: '', Keterangan: 'Aktif',
    Tahun_Ajaran: '', Tahun_Masuk: '', Tanggal_Lahir: '', Tempat_Lahir: '', Foto_URL: '',
}

const EXPORT_HEADERS = ['NISN', 'NIS', 'Nama_Siswa', 'Kelas', 'Jenis_Kelamin', 'Agama', 'Alamat', 'Keterangan', 'Tahun_Ajaran', 'Tahun_Masuk', 'Tempat_Lahir', 'Tanggal_Lahir', 'Foto_URL']

const TEMPLATE_ROW = ['0094275049', '1234', 'ALFIN PUTRA PRATAMA', 'X A', 'Laki-laki', 'Islam', 'Jl. Siswa No.12', 'Aktif', '2024/2025', '2024', 'Minakarya', '2008-01-15', '']

export function useSiswa() {
    const siswaList = ref<Siswa[]>([])
    const isLoading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(15)

    // ─── LOAD ────────────────────────────────
    const loadSiswa = async () => {
        isLoading.value = true
        try {
            const snapshot = await get(dbRef(db, 'Tables/Siswa'))
            if (snapshot.exists()) {
                const data = snapshot.val()
                siswaList.value = Object.entries(data).map(([id, s]: [string, any]) => ({
                    id,
                    Nama_Siswa: s.Nama_Siswa || '',
                    NISN: s.NISN || '',
                    NIS: s.NIS || '',
                    Agama: s.Agama || '',
                    Alamat: s.Alamat || '',
                    Jenis_Kelamin: s.Jenis_Kelamin || 'Laki-laki',
                    Kelas: s.Kelas || '',
                    Keterangan: s.Keterangan || '',
                    Tahun_Ajaran: s.Tahun_Ajaran || '',
                    Tahun_Masuk: s.Tahun_Masuk || '',
                    Tanggal_Lahir: s.Tanggal_Lahir || '',
                    Tempat_Lahir: s.Tempat_Lahir || '',
                    Foto_URL: s.Foto_URL || '',
                }))
            } else {
                siswaList.value = []
            }
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // ─── SAVE ────────────────────────────────
    const saveSiswa = async (formData: Siswa, editId?: string) => {
        const payload = { ...DEFAULT_SISWA, ...formData }
        if (editId) {
            await update(dbRef(db, `Tables/Siswa/${editId}`), payload)
        } else {
            const newRef = push(dbRef(db, 'Tables/Siswa'))
            await set(newRef, payload)
        }
    }

    // ─── DELETE ──────────────────────────────
    const deleteSiswa = async (id: string) => {
        await remove(dbRef(db, `Tables/Siswa/${id}`))
    }

    // ─── FILTERED & PAGINATED ────────────────
    const filteredSiswa = computed(() => {
        let result = [...siswaList.value]
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            result = result.filter(s =>
                (s.NISN || '').toLowerCase().includes(q) ||
                (s.Nama_Siswa || '').toLowerCase().includes(q) ||
                (s.Kelas || '').toLowerCase().includes(q)
            )
        }
        result.sort((a, b) => (a.Nama_Siswa || '').localeCompare(b.Nama_Siswa || '', 'id', { sensitivity: 'base' }))
        return result
    })

    const totalData = computed(() => filteredSiswa.value.length)
    const totalPages = computed(() => Math.ceil(totalData.value / itemsPerPage.value))

    const paginatedSiswa = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value
        return filteredSiswa.value.slice(start, start + itemsPerPage.value)
    })

    // ─── EXPORT ──────────────────────────────
    const exportToExcel = () => {
        const wsData = [EXPORT_HEADERS]
        siswaList.value.forEach(s => wsData.push(EXPORT_HEADERS.map(h => (s as any)[h] || '')))
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(wsData), 'Siswa')
        XLSX.writeFile(wb, 'Data_Siswa.xlsx')
    }

    // ─── TEMPLATE ────────────────────────────
    const downloadTemplate = () => {
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([EXPORT_HEADERS, TEMPLATE_ROW]), 'Template Siswa')
        XLSX.writeFile(wb, 'Template_Siswa.xlsx')
    }

    // ─── IMPORT ──────────────────────────────
    const importFromExcel = async (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target!.result as ArrayBuffer)
                    const wb = XLSX.read(data, { type: 'array' })
                    const sheet = wb.Sheets[wb.SheetNames[0]]
                    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]
                    if (json.length < 2) throw new Error('File Excel kosong')

                    const headers = json[0] as string[]
                    const rows = json.slice(1)
                    let imported = 0

                    for (const row of rows) {
                        const obj: any = {}
                        headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]).trim() : '' })

                        if (obj.Nama_Siswa) {
                            const newRef = push(dbRef(db, 'Tables/Siswa'))
                            await set(newRef, {
                                Nama_Siswa: obj.Nama_Siswa,
                                NISN: obj.NISN || '',
                                NIS: obj.NIS || '',
                                Agama: obj.Agama || 'Islam',
                                Alamat: obj.Alamat || '',
                                Jenis_Kelamin: obj.Jenis_Kelamin || 'Laki-laki',
                                Kelas: obj.Kelas || '',
                                Keterangan: obj.Keterangan || 'Aktif',
                                Tahun_Ajaran: obj.Tahun_Ajaran || '',
                                Tahun_Masuk: obj.Tahun_Masuk || '',
                                Tempat_Lahir: obj.Tempat_Lahir || '',
                                Tanggal_Lahir: obj.Tanggal_Lahir || '',
                                Foto_URL: obj.Foto_URL || '',
                            })
                            imported++
                        }
                    }
                    resolve(imported)
                } catch (err) {
                    reject(err)
                }
            }
            reader.onerror = reject
            reader.readAsArrayBuffer(file)
        })
    }

    return {
        siswaList, isLoading, searchQuery, currentPage, itemsPerPage,
        filteredSiswa, paginatedSiswa, totalData, totalPages,
        loadSiswa, saveSiswa, deleteSiswa,
        exportToExcel, downloadTemplate, importFromExcel,
    }
}
