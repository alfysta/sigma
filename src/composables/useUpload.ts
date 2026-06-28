const GAS_URL = import.meta.env.VITE_GAS_UPLOAD_URL || ''

export function useUpload() {
    const uploadToDrive = async (file: File, fileName?: string): Promise<string> => {
        if (!GAS_URL) throw new Error('URL GAS belum dikonfigurasi')

        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = async () => {
                try {
                    const base64 = (reader.result as string).split(',')[1]
                    const mimeType = file.type || 'image/jpeg'
                    const name = fileName || `foto_siswa_${Date.now()}.${file.name.split('.').pop() || 'jpg'}`

                    // Kirim sebagai form data (bukan JSON) untuk bypass CORS
                    const formData = new URLSearchParams()
                    formData.append('base64', base64)
                    formData.append('mimeType', mimeType)
                    formData.append('fileName', name)

                    const response = await fetch(GAS_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formData.toString(),
                    })

                    const text = await response.text()

                    let result
                    try {
                        result = JSON.parse(text)
                    } catch {
                        throw new Error('Response error: ' + text.substring(0, 100))
                    }

                    if (result.success) {
                        resolve(result.directLink)
                    } else {
                        reject(new Error(result.error || 'Upload gagal'))
                    }
                } catch (err: any) {
                    reject(err)
                }
            }

            reader.onerror = () => reject(new Error('Gagal membaca file'))
            reader.readAsDataURL(file)
        })
    }

    return { uploadToDrive }
}
