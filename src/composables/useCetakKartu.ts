import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { ref as dbRef, get } from 'firebase/database'

export interface SiswaKartu {
    id?: string
    Nama_Siswa: string
    NISN: string
    NIS: string
    Kelas: string
    Jenis_Kelamin: string
    Tempat_Lahir: string
    Tanggal_Lahir: string
    Agama: string
    Alamat: string
    Foto_URL: string
    Tahun_Masuk: string
}

export function useCetakKartu() {
    const allSiswa = ref<SiswaKartu[]>([])
    const isLoading = ref(false)
    const searchQuery = ref('')
    const filterKelas = ref('Semua')
    const selectedNisns = ref<Set<string>>(new Set())
    const currentPage = ref(1)
    const rowsPerPage = 8

    const loadSiswa = async () => {
        isLoading.value = true
        try {
            const snapshot = await get(dbRef(db, 'Tables/Siswa'))
            if (snapshot.exists()) {
                const data = snapshot.val()
                allSiswa.value = Object.values(data) as SiswaKartu[]
            } else {
                allSiswa.value = []
            }
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const kelasList = computed(() => {
        const kelas = new Set(allSiswa.value.map(s => s.Kelas).filter(Boolean))
        return ['Semua', ...Array.from(kelas).sort()]
    })

    const filteredSiswa = computed(() => {
        let result = allSiswa.value
        if (filterKelas.value !== 'Semua') {
            result = result.filter(s => s.Kelas === filterKelas.value)
        }
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            result = result.filter(s =>
                (s.Nama_Siswa || '').toLowerCase().includes(q) ||
                (s.NISN || '').includes(q) ||
                (s.NIS || '').includes(q)
            )
        }
        return result
    })

    const totalPages = computed(() => Math.ceil(filteredSiswa.value.length / rowsPerPage) || 1)

    const paginatedSiswa = computed(() => {
        const start = (currentPage.value - 1) * rowsPerPage
        return filteredSiswa.value.slice(start, start + rowsPerPage)
    })

    const selectedCount = computed(() => selectedNisns.value.size)

    const isAllPageChecked = computed(() =>
        paginatedSiswa.value.length > 0 && paginatedSiswa.value.every(s => selectedNisns.value.has(s.NISN))
    )

    const isAllFilteredChecked = computed(() =>
        filteredSiswa.value.length > 0 && filteredSiswa.value.every(s => selectedNisns.value.has(s.NISN))
    )

    const toggleSelectAllPage = (checked: boolean) => {
        paginatedSiswa.value.forEach(s => {
            if (checked) selectedNisns.value.add(s.NISN)
            else selectedNisns.value.delete(s.NISN)
        })
        selectedNisns.value = new Set(selectedNisns.value) // Trigger reactivity
    }

    const toggleSelectAllFiltered = () => {
        const allChecked = isAllFilteredChecked.value
        filteredSiswa.value.forEach(s => {
            if (allChecked) selectedNisns.value.delete(s.NISN)
            else selectedNisns.value.add(s.NISN)
        })
        selectedNisns.value = new Set(selectedNisns.value)
    }

    const toggleRow = (nisn: string) => {
        if (selectedNisns.value.has(nisn)) selectedNisns.value.delete(nisn)
        else selectedNisns.value.add(nisn)
        selectedNisns.value = new Set(selectedNisns.value)
    }

    const getSelectedSiswa = () => {
        return allSiswa.value.filter(s => selectedNisns.value.has(s.NISN))
    }

    return {
        allSiswa, isLoading, searchQuery, filterKelas, selectedNisns,
        currentPage, rowsPerPage, kelasList, filteredSiswa,
        paginatedSiswa, totalPages, selectedCount,
        isAllPageChecked, isAllFilteredChecked,
        loadSiswa, toggleSelectAllPage, toggleSelectAllFiltered, toggleRow,
        getSelectedSiswa,
    }
}
