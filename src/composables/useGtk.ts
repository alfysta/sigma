import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { ref as dbRef, get, set, push, update, remove } from 'firebase/database'
import * as XLSX from 'xlsx'

export interface Gtk {
    id?: string
    Nama: string; NIK: string; NIP: string; NUPTK: string
    Tempat_Lahir: string; Tanggal_Lahir: string; No_KK: string
    Agama: string; Alamat_Jalan: string; Bank: string
    Bujur: number; Desa: string; Email: string; Foto_Guru: string
    HP: string; JK: string; Jenis_PTK: string; Karis_Karsu: string
    Karpeg: string; Keahlian_Bahasa_Isyarat: string; Keahlian_Braille: string
    Kecamatan: string; Kewarganegaraan: string; Kode_Pos: number
    Lembaga_Pengangkatan: string; Lintang: number; NIP_Suami_Istri: string
    NPWP: string; NUKS: string; Nama_Dusun: string; Nama_Ibu_Kandung: string
    Nama_Suami_Istri: string; Nama_Wajib_Pajak: string; Nomor_Rekening: string
    Pangkat_Golongan: string; Pekerjaan_Suami_Istri: string
    Pernah_Diklat_Kepengawasan: string; RT: string; RW: string
    Rekening_Atas_Nama: string; SK_CPNS: string; SK_Pengangkatan: string
    Status_Kepegawaian: string; Status_Perkawinan: string
    Sudah_Lisensi_Kepala_Sekolah: string; Sumber_Gaji: string
    TMT_PNS: string; TMT_Pengangkatan: string; Tanggal_CPNS: string
    Telepon: string; Tugas_Tambahan: string
}

const DEFAULT_GTK: Gtk = {
    Nama: '', NIK: '', NIP: '', NUPTK: '', Tempat_Lahir: '', Tanggal_Lahir: '', No_KK: '',
    Agama: 'Islam', Alamat_Jalan: '', Bank: '', Bujur: 0, Desa: '', Email: '', Foto_Guru: '',
    HP: '', JK: 'L', Jenis_PTK: 'Guru', Karis_Karsu: '', Karpeg: '',
    Keahlian_Bahasa_Isyarat: 'Tidak', Keahlian_Braille: 'Tidak', Kecamatan: '',
    Kewarganegaraan: 'ID', Kode_Pos: 0, Lembaga_Pengangkatan: '', Lintang: 0,
    NIP_Suami_Istri: '', NPWP: '', NUKS: '', Nama_Dusun: '', Nama_Ibu_Kandung: '',
    Nama_Suami_Istri: '', Nama_Wajib_Pajak: '', Nomor_Rekening: '', Pangkat_Golongan: '',
    Pekerjaan_Suami_Istri: '', Pernah_Diklat_Kepengawasan: 'Tidak', RT: '', RW: '',
    Rekening_Atas_Nama: '', SK_CPNS: '', SK_Pengangkatan: '', Status_Kepegawaian: '',
    Status_Perkawinan: '', Sudah_Lisensi_Kepala_Sekolah: 'Tidak', Sumber_Gaji: '',
    TMT_PNS: '', TMT_Pengangkatan: '', Tanggal_CPNS: '', Telepon: '', Tugas_Tambahan: '',
}

export const GTK_TABLE_HEADERS = ['Nama', 'NIP', 'NUPTK', 'Jenis_PTK', 'JK', 'Agama', 'Status_Kepegawaian', 'HP']

export function useGtk() {
    const gtkList = ref<Gtk[]>([])
    const isLoading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(15)

    const loadGtk = async () => {
        isLoading.value = true
        try {
            const snapshot = await get(dbRef(db, 'Tables/GTK'))
            if (snapshot.exists()) {
                const data = snapshot.val()
                gtkList.value = Object.entries(data).map(([id, g]: [string, any]) => ({ id, ...DEFAULT_GTK, ...g }))
            } else {
                gtkList.value = []
            }
        } catch (error) { throw error } finally { isLoading.value = false }
    }

    const saveGtk = async (formData: Gtk, editId?: string) => {
        const payload = { ...DEFAULT_GTK, ...formData }
        if (editId) await update(dbRef(db, `Tables/GTK/${editId}`), payload)
        else { const newRef = push(dbRef(db, 'Tables/GTK')); await set(newRef, payload) }
    }

    const deleteGtk = async (id: string) => { await remove(dbRef(db, `Tables/GTK/${id}`)) }

    const filteredGtk = computed(() => {
        let result = [...gtkList.value]
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            result = result.filter(g => (g.Nama || '').toLowerCase().includes(q) || (g.NIP || '').includes(q) || (g.NUPTK || '').includes(q))
        }
        result.sort((a, b) => (a.Nama || '').localeCompare(b.Nama || '', 'id', { sensitivity: 'base' }))
        return result
    })

    const totalData = computed(() => filteredGtk.value.length)
    const totalPages = computed(() => Math.ceil(totalData.value / itemsPerPage.value))
    const paginatedGtk = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value
        return filteredGtk.value.slice(start, start + itemsPerPage.value)
    })

    const exportToExcel = () => {
        const headers = Object.keys(DEFAULT_GTK)
        const wsData = [headers]
        gtkList.value.forEach(g => wsData.push(headers.map(h => (g as any)[h] || '')))
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, 'GTK')
        XLSX.writeFile(wb, 'Data_GTK.xlsx')
    }

    const downloadTemplate = () => {
        const headers = Object.keys(DEFAULT_GTK)
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet([headers])
        XLSX.utils.book_append_sheet(wb, ws, 'Template GTK')
        XLSX.writeFile(wb, 'Template_GTK.xlsx')
    }

    const importFromExcel = async (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    const wb = XLSX.read(new Uint8Array(e.target!.result as ArrayBuffer), { type: 'array' })
                    const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 }) as any[][]
                    if (json.length < 2) throw new Error('File kosong')
                    const headers = json[0] as string[]
                    let imported = 0
                    for (const row of json.slice(1)) {
                        const obj: any = {}
                        headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]).trim() : '' })
                        if (obj.Nama) {
                            const newRef = push(dbRef(db, 'Tables/GTK'))
                            await set(newRef, { ...DEFAULT_GTK, ...obj })
                            imported++
                        }
                    }
                    resolve(imported)
                } catch (err) { reject(err) }
            }
            reader.onerror = reject
            reader.readAsArrayBuffer(file)
        })
    }

    return {
        gtkList, isLoading, searchQuery, currentPage, itemsPerPage,
        filteredGtk, paginatedGtk, totalData, totalPages,
        loadGtk, saveGtk, deleteGtk,
        exportToExcel, downloadTemplate, importFromExcel,
    }
}
