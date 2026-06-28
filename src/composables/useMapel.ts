import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { ref as dbRef, get, set, push, update, remove } from 'firebase/database'
import * as XLSX from 'xlsx'

export interface Mapel {
    id?: string
    NAMA_MAPEL: string
    KODE_MAPEL: string
    IS_MAPEL_BERAT: string
    IS_PENJAS: string
}

export function useMapel() {
    const mapelList = ref<Mapel[]>([])
    const isLoading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(15)

    const loadMapel = async () => {
        isLoading.value = true
        try {
            const snapshot = await get(dbRef(db, 'Tables/Mapel'))
            if (snapshot.exists()) {
                const data = snapshot.val()
                mapelList.value = Object.entries(data).map(([id, m]: [string, any]) => ({
                    id,
                    NAMA_MAPEL: m.NAMA_MAPEL || '',
                    KODE_MAPEL: m.KODE_MAPEL || '',
                    IS_MAPEL_BERAT: m.IS_MAPEL_BERAT || 'Tidak',
                    IS_PENJAS: m.IS_PENJAS || 'Tidak',
                }))
            } else {
                mapelList.value = []
            }
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const saveMapel = async (formData: Mapel, editId?: string) => {
        const data = {
            NAMA_MAPEL: formData.NAMA_MAPEL,
            KODE_MAPEL: formData.KODE_MAPEL,
            IS_MAPEL_BERAT: formData.IS_MAPEL_BERAT || 'Tidak',
            IS_PENJAS: formData.IS_PENJAS || 'Tidak',
        }

        if (editId) {
            await update(dbRef(db, `Tables/Mapel/${editId}`), data)
        } else {
            const newRef = push(dbRef(db, 'Tables/Mapel'))
            await set(newRef, data)
        }
    }

    const deleteMapel = async (id: string) => {
        await remove(dbRef(db, `Tables/Mapel/${id}`))
    }

    const filteredMapel = computed(() => {
        let result = [...mapelList.value]

        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            result = result.filter(m =>
                (m.NAMA_MAPEL || '').toLowerCase().includes(q) ||
                (m.KODE_MAPEL || '').toLowerCase().includes(q)
            )
        }

        result.sort((a, b) => (a.NAMA_MAPEL || '').localeCompare(b.NAMA_MAPEL || '', 'id', { sensitivity: 'base' }))

        return result
    })

    const totalData = computed(() => filteredMapel.value.length)
    const totalPages = computed(() => Math.ceil(totalData.value / itemsPerPage.value))

    const paginatedMapel = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value
        return filteredMapel.value.slice(start, start + itemsPerPage.value)
    })

    const exportToExcel = () => {
        const headers = ['NAMA_MAPEL', 'KODE_MAPEL', 'IS_MAPEL_BERAT', 'IS_PENJAS']
        const wsData = [headers]
        mapelList.value.forEach(m => wsData.push([m.NAMA_MAPEL, m.KODE_MAPEL, m.IS_MAPEL_BERAT, m.IS_PENJAS]))
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(wsData), 'Mapel')
        XLSX.writeFile(wb, 'Data_Mapel.xlsx')
    }

    const downloadTemplate = () => {
        const headers = ['NAMA_MAPEL', 'KODE_MAPEL', 'IS_MAPEL_BERAT', 'IS_PENJAS']
        const example = ['Matematika', 'MTK', 'Tidak', 'Tidak']
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers, example]), 'Template Mapel')
        XLSX.writeFile(wb, 'Template_Mapel.xlsx')
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
                        if (obj.NAMA_MAPEL) {
                            const newRef = push(dbRef(db, 'Tables/Mapel'))
                            await set(newRef, {
                                NAMA_MAPEL: obj.NAMA_MAPEL,
                                KODE_MAPEL: obj.KODE_MAPEL || '',
                                IS_MAPEL_BERAT: obj.IS_MAPEL_BERAT || 'Tidak',
                                IS_PENJAS: obj.IS_PENJAS || 'Tidak',
                            })
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
        mapelList, isLoading, searchQuery, currentPage, itemsPerPage,
        filteredMapel, paginatedMapel, totalData, totalPages,
        loadMapel, saveMapel, deleteMapel,
        exportToExcel, downloadTemplate, importFromExcel,
    }
}
