import { initializeApp } from 'firebase/app'
import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database'
import CryptoJS from 'crypto-js'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)

// Fungsi hash password (SHA256 + Salt)
const hashPassword = (password: string, salt: string): string => {
    return CryptoJS.SHA256(password + salt).toString()
}

export const loginWithRTDB = async (username: string, password: string) => {
    const usersRef = ref(db, 'Tables/Users')

    // Cari user berdasarkan Username
    const usernameQuery = query(usersRef, orderByChild('Username'), equalTo(username))
    const snapshot = await get(usernameQuery)

    if (!snapshot.exists()) {
        throw new Error('Username tidak ditemukan')
    }

    // Ambil data user pertama yang cocok
    const users = snapshot.val()
    const userId = Object.keys(users)[0]
    const user = users[userId]

    // Verifikasi password dengan hash
    let isPasswordValid = false

    if (user.Salt && user.Salt !== '') {
        // Hash input password dengan salt yang sama
        const hashedInput = hashPassword(password, user.Salt)
        console.log('🔐 Debug hash:', {
            input: password,
            salt: user.Salt,
            hashedInput,
            storedHash: user.Password,
            match: hashedInput === user.Password
        })
        isPasswordValid = hashedInput === user.Password
    } else {
        // Fallback plain text (development only)
        isPasswordValid = user.Password === password
    }

    if (!isPasswordValid) {
        throw new Error('Password salah')
    }

    // Cek status aktif
    if (user.Status !== 'Aktif') {
        throw new Error('Akun tidak aktif. Hubungi administrator.')
    }

    // Return user data (tanpa password & salt)
    const { Password, Salt, ...userData } = user
    return {
        ...userData,
        id: userId,
    }
}
