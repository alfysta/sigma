import { ref, reactive, computed } from 'vue'
import { db } from '@/firebase'
import { ref as dbRef, get, set, push, update, remove, query, orderByChild, equalTo } from 'firebase/database'
import CryptoJS from 'crypto-js'
import * as XLSX from 'xlsx'

export interface User {
    id?: string
    Username: string
    Password?: string
    Salt?: string
    Role: 'Guru' | 'Siswa'
    Status: 'Aktif' | 'Nonaktif'
    Nama_Lengkap: string
}

export function useUser() {
    const users = ref<User[]>([])
    const isLoading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(15)

    // Generate random salt
    const generateSalt = (): string => {
        return CryptoJS.lib.WordArray.random(8).toString()
    }

    // Hash password dengan salt
    const hashPassword = (password: string, salt: string): string => {
        return CryptoJS.SHA256(password + salt).toString()
    }

    // Load users dari Firebase
    const loadUsers = async () => {
        isLoading.value = true
        try {
            const snapshot = await get(dbRef(db, 'Tables/Users'))
            if (snapshot.exists()) {
                const data = snapshot.val()
                users.value = Object.entries(data).map(([id, user]: [string, any]) => ({
                    id,
                    ...user,
                }))
            } else {
                users.value = []
            }
        } catch (error) {
            console.error('Gagal load users:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // Save user (create/update)
    const saveUser = async (formData: User, editId?: string) => {
        const { Username, Password, Role, Status, Nama_Lengkap } = formData

        // Validasi
        if (!Username) throw new Error('Username wajib diisi')
        if (!editId && !Password) throw new Error('Password wajib diisi')

        const userData: any = {
            Username,
            Role,
            Status,
            Nama_Lengkap,
        }

        // Hash password jika diisi
        if (Password && Password.trim() !== '') {
            const salt = generateSalt()
            userData.Salt = salt
            userData.Password = hashPassword(Password, salt)
        }

        if (editId) {
            // Update
            const userRef = dbRef(db, `Tables/Users/${editId}`)
            if (!Password || Password.trim() === '') {
                // Jangan overwrite password kalau kosong
                const snap = await get(userRef)
                const existing = snap.val()
                userData.Password = existing.Password
                userData.Salt = existing.Salt
            }
            await update(userRef, userData)
        } else {
            // Create
            const newRef = push(dbRef(db, 'Tables/Users'))
            await set(newRef, userData)
        }
    }

    // Delete user
    const deleteUser = async (id: string) => {
        await remove(dbRef(db, `Tables/Users/${id}`))
    }

    // Filtered & paginated users
    const filteredUsers = computed(() => {
        let result = [...users.value]

        // Search
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            result = result.filter(u =>
                (u.Username || '').toLowerCase().includes(q) ||
                (u.Nama_Lengkap || '').toLowerCase().includes(q) ||
                (u.Role || '').toLowerCase().includes(q)
            )
        }

        // Sort by Username
        result.sort((a, b) => (a.Username || '').localeCompare(b.Username || '', 'id', { sensitivity: 'base' }))

        return result
    })

    const totalData = computed(() => filteredUsers.value.length)
    const totalPages = computed(() => Math.ceil(totalData.value / itemsPerPage.value))

    const paginatedUsers = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value
        return filteredUsers.value.slice(start, start + itemsPerPage.value)
    })

    // Export to Excel
    const exportToExcel = () => {
        const headers = ['Username', 'Role', 'Status', 'Nama_Lengkap']
        const wsData = [headers]
        users.value.forEach(u => {
            wsData.push([u.Username || '', u.Role || '', u.Status || '', u.Nama_Lengkap || ''])
        })

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, 'Users')

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([wbout], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Data_Users.xlsx'
        a.click()
        URL.revokeObjectURL(url)
    }

    // Download template
    const downloadTemplate = () => {
        const headers = ['Username', 'Password', 'Role', 'Status', 'Nama_Lengkap']
        const exampleRow = ['guru1', '123456', 'Guru', 'Aktif', 'Budi Santoso']
        const wsData = [headers, exampleRow]

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, 'Template User')

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([wbout], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Template_Data_User.xlsx'
        a.click()
        URL.revokeObjectURL(url)
    }

    // Import from Excel
    const importFromExcel = async (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async (event) => {
                try {
                    const data = new Uint8Array(event.target!.result as ArrayBuffer)
                    const workbook = XLSX.read(data, { type: 'array' })
                    const firstSheet = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheet]
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                    if (jsonData.length < 2) {
                        throw new Error('File Excel kosong')
                    }

                    const headers = jsonData[0] as string[]
                    const rows = jsonData.slice(1) as any[][]

                    let imported = 0
                    for (const row of rows) {
                        const obj: any = {}
                        headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]) : '' })

                        if (obj.Username) {
                            const salt = generateSalt()
                            const userData = {
                                Username: obj.Username,
                                Password: hashPassword(obj.Password || '123456', salt),
                                Salt: salt,
                                Role: obj.Role || 'Guru',
                                Status: obj.Status || 'Aktif',
                                Nama_Lengkap: obj.Nama_Lengkap || '',
                            }
                            const newRef = push(dbRef(db, 'Tables/Users'))
                            await set(newRef, userData)
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
        users,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        filteredUsers,
        paginatedUsers,
        totalData,
        totalPages,
        loadUsers,
        saveUser,
        deleteUser,
        exportToExcel,
        downloadTemplate,
        importFromExcel,
        hashPassword,
        generateSalt,
    }
}
