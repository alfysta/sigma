import { ref } from 'vue'
import { db } from '@/firebase'
import { ref as dbRef, get, set } from 'firebase/database'

export interface Settings {
    APP_NAME: string
    INSTITUSI: string
    NAMA_SEKOLAH: string
    ALAMAT_SEKOLAH: string
    NAMA_KEPALA_SEKOLAH: string
    NIP_KEPALA_SEKOLAH: string
    NAMA_GURU: string
    NIP_GURU: string
    LOGO_INSTITUSI: string
    LOGO_SEKOLAH: string
    TAHUN_AJARAN_AKTIF: string
    DAFTAR_SEMESTER: string
    GAMBAR_TTD_KEPSEK: string
}

const defaultSettings: Settings = {
    APP_NAME: 'SIGMA',
    INSTITUSI: '',
    NAMA_SEKOLAH: '',
    ALAMAT_SEKOLAH: '',
    NAMA_KEPALA_SEKOLAH: '',
    NIP_KEPALA_SEKOLAH: '',
    NAMA_GURU: '',
    NIP_GURU: '',
    LOGO_INSTITUSI: '',
    LOGO_SEKOLAH: '',
    TAHUN_AJARAN_AKTIF: '',
    DAFTAR_SEMESTER: 'Ganjil',
    GAMBAR_TTD_KEPSEK: '',
}

export function useSettings() {
    const settings = ref<Settings>({ ...defaultSettings })
    const isLoading = ref(false)

    const loadSettings = async () => {
        isLoading.value = true
        try {
            // Path: Tables/Settings (field langsung, tanpa key)
            const snapshot = await get(dbRef(db, 'Tables/Settings'))

            if (snapshot.exists()) {
                const data = snapshot.val()
                // Data langsung berupa field-field settings
                settings.value = { ...defaultSettings, ...data }
            } else {
                settings.value = { ...defaultSettings }
            }
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const saveSettings = async (formData: Settings) => {
        // Simpan langsung ke Tables/Settings (overwrite semua field)
        await set(dbRef(db, 'Tables/Settings'), formData)
        settings.value = { ...formData }
    }

    return {
        settings,
        isLoading,
        loadSettings,
        saveSettings,
        defaultSettings,
    }
}
