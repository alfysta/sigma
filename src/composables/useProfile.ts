import { ref } from 'vue'
import { db } from '@/firebase'
import { ref as dbRef, get, query, orderByChild, equalTo } from 'firebase/database'
import { useAuthStore } from '@/stores/authStore'

export interface ProfileData {
    nama: string
    identitas: string
    kelas?: string
    ttl: string
    jk: string
    alamat: string
    foto: string
    role: string
    nuptk?: string
    statusKepegawaian?: string
    tempatLahir?: string
    tanggalLahir?: string
    email?: string
    jenisPTK?: string
    agama?: string
    hp?: string
    nisn?: string
    nip?: string
}

export function useProfile() {
    const profile = ref<ProfileData | null>(null)
    const isLoading = ref(false)
    const authStore = useAuthStore()

    const getPlaceholder = (nama?: string) => {
        if (!nama) return 'https://placehold.co/240x320/09090b/f59e0b?text=?&font=playfair'
        const initials = nama.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase()
        return `https://placehold.co/240x320/09090b/f59e0b?text=${encodeURIComponent(initials)}&font=playfair`
    }

    const loadProfile = async () => {
        const user = authStore.user
        if (!user) throw new Error('Sesi tidak valid')

        const username = user.Username || ''
        const role = user.Role || ''

        isLoading.value = true

        try {
            if (role === 'Siswa') {
                // Cari di tabel Siswa berdasarkan NISN = Username
                const siswaRef = dbRef(db, 'Tables/Siswa')
                const q = query(siswaRef, orderByChild('NISN'), equalTo(username))
                const snapshot = await get(q)

                if (snapshot.exists()) {
                    const data = snapshot.val()
                    const firstKey = Object.keys(data)[0]
                    const s = data[firstKey]

                    profile.value = {
                        nama: s.Nama_Siswa || '',
                        identitas: s.NISN || username,
                        kelas: s.Kelas || '',
                        ttl: `${s.Tempat_Lahir || '-'}, ${s.Tanggal_Lahir || '-'}`,
                        jk: s.Jenis_Kelamin || '',
                        alamat: s.Alamat || '',
                        foto: s.Foto_URL || '',
                        role: 'Siswa',
                        nisn: s.NISN || '',
                        agama: s.Agama || '',
                    }
                } else {
                    throw new Error('Data siswa tidak ditemukan')
                }
            } else {
                // Cari di tabel GTK berdasarkan NIP = Username
                const gtkRef = dbRef(db, 'Tables/GTK')
                const q = query(gtkRef, orderByChild('NIP'), equalTo(username))
                const snapshot = await get(q)

                if (snapshot.exists()) {
                    const data = snapshot.val()
                    const firstKey = Object.keys(data)[0]
                    const g = data[firstKey]

                    profile.value = {
                        nama: g.Nama || '',
                        identitas: g.NIP || username,
                        nuptk: g.NUPTK || '-',
                        statusKepegawaian: g.Status_Kepegawaian || '-',
                        ttl: `${g.Tempat_Lahir || '-'}, ${g.Tanggal_Lahir || '-'}`,
                        tempatLahir: g.Tempat_Lahir || '',
                        tanggalLahir: g.Tanggal_Lahir || '',
                        jk: g.JK === 'L' ? 'Laki-laki' : 'Perempuan',
                        alamat: g.Alamat_Jalan || '',
                        foto: g.Foto_Guru || '',
                        role: 'Guru',
                        email: g.Email || '',
                        jenisPTK: g.Jenis_PTK || '',
                        agama: g.Agama || '',
                        hp: g.HP || '',
                        nip: g.NIP || '',
                    }
                } else {
                    throw new Error('Data GTK tidak ditemukan')
                }
            }
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return {
        profile,
        isLoading,
        loadProfile,
        getPlaceholder,
    }
}
