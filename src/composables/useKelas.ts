import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { ref as dbRef, get, set, push, update, remove } from 'firebase/database'
import * as XLSX from 'xlsx'

export interface Kelas {
    id?: string
    Nama_Kelas: string
    Tingkatan: string
    Jurusan: string
    Kapasitas: number
}

export function useKelas() {
    const kelasList = ref<Kelas[]>([])
    const isLoading = ref(false)
    const searchQuery = ref('')
    const filterTingkatan = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(15)

    const loadKelas = async () => {
        isLoading.value = true
        try {
            const snapshot = await get(dbRef(db, 'Tables/Kelas'))
            if (snapshot.exists()) {
                const data = snapshot.val()
                kelasList.value = Object.entries(data).map(([id, k]: [string, any]) => ({
                    id,
                    Nama_Kelas: k.Nama_Kelas || '',
                    Tingkatan: k.Tingkatan || '',
                    Jurusan: k.Jurusan || '',
                    Kapasitas: Number(k.Kapasitas) || 0,
                }))
            } else {
                kelasList.value = []
            }
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const saveKelas = async (formData: Kelas, editId?: string) => {
        const data = {
            Nama_Kelas: formData.Nama_Kelas,
            Tingkatan: formData.Tingkatan,
            Jurusan: formData.Jurusan,
            Kapasitas: Number(formData.Kapasitas) || 0,
        }

        if (editId) {
            await update(dbRef(db, `Tables/Kelas/${editId}`), data)
        } else {
            const newRef = push(dbRef(db, 'Tables/Kelas'))
            await set(newRef, data)
        }
    }

    const deleteKelas = async (id: string) => {
        await remove(dbRef(db, `Tables/Kelas/${id}`))
    }

    // Filtered & sorted
    const filteredKelas = computed(() => {
        let result = [...kelasList.value]

        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            result = result.filter(k =>
                (k.Nama_Kelas || '').toLowerCase().includes(q) ||
                (k.Tingkatan || '').toLowerCase().includes(q) ||
                (k.Jurusan || '').toLowerCase().includes(q)
            )
        }

        if (filterTingkatan.value) {
            result = result.filter(k => k.Tingkatan === filterTingkatan.value)
        }

        result.sort((a, b) => {
            const ta = a.Tingkatan || ''
            const tb = b.Tingkatan || ''
            if (ta !== tb) return ta.localeCompare(tb)
            return (a.Nama_Kelas || '').localeCompare(b.Nama_Kelas || '')
        })

        return result
    })

    const totalData = computed(() => filteredKelas.value.length)
    const totalPages = computed(() => Math.ceil(totalData.value / itemsPerPage.value))

    const paginatedKelas = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value
        return filteredKelas.value.slice(start, start + itemsPerPage.value)
    })

    // Stats
    const stats = computed(() => {
        const levels = ['X', 'XI', 'XII']
        return {
            total: kelasList.value.length,
            filtered: filteredKelas.value.length,
            levels: levels.map(l => ({
                label: l,
                count: kelasList.value.filter(k => k.Tingkatan === l).length,
            })),
        }
    })

    // Export Excel
    const exportToExcel = () => {
        const headers = ['Nama_Kelas', 'Tingkatan', 'Jurusan', 'Kapasitas']
        const wsData = [headers]
        kelasList.value.forEach(k => {
            wsData.push([k.Nama_Kelas, k.Tingkatan, k.Jurusan, k.Kapasitas])
        })

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, 'Kelas')
        XLSX.writeFile(wb, 'Data_Kelas.xlsx')
    }

    const downloadTemplate = () => {
        const headers = ['Nama_Kelas', 'Tingkatan', 'Jurusan', 'Kapasitas']
        const example = ['X MIPA 1', 'X', 'MIPA', '36']
        const wsData = [headers, example]

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, 'Template Kelas')
        XLSX.writeFile(wb, 'Template_Kelas.xlsx')
    }

    const importFromExcel = async (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async (event) => {
                try {
                    const data = new Uint8Array(event.target!.result as ArrayBuffer)
                    const workbook = XLSX.read(data, { type: 'array' })
                    const sheet = workbook.Sheets[workbook.SheetNames[0]]
                    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

                    if (jsonData.length < 2) throw new Error('File kosong')

                    const headers = jsonData[0] as string[]
                    const rows = jsonData.slice(1)

                    let imported = 0
                    for (const row of rows) {
                        const obj: any = {}
                        headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]) : '' })

                        if (obj.Nama_Kelas) {
                            const newRef = push(dbRef(db, 'Tables/Kelas'))
                            await set(newRef, {
                                Nama_Kelas: obj.Nama_Kelas,
                                Tingkatan: obj.Tingkatan || 'X',
                                Jurusan: obj.Jurusan || '',
                                Kapasitas: Number(obj.Kapasitas) || 0,
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
        kelasList,
        isLoading,
        searchQuery,
        filterTingkatan,
        currentPage,
        itemsPerPage,
        filteredKelas,
        paginatedKelas,
        totalData,
        totalPages,
        stats,
        loadKelas,
        saveKelas,
        deleteKelas,
        exportToExcel,
        downloadTemplate,
        importFromExcel,
    }
}
