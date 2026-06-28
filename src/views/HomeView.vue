<template>
    <div class="min-h-screen bg-gray-100">
        <div class="max-w-4xl mx-auto py-12 px-4">
            <h1 class="text-4xl font-bold text-indigo-600 text-center mb-4">
                <font-awesome-icon icon="graduation-cap" class="mr-3" />
                SIGMA
            </h1>
            <p class="text-center text-gray-600 mb-8 text-lg">
                Sistem Informasi Guru & Manajemen Akademik
            </p>

            <div class="flex justify-center gap-4 flex-wrap">
                <button @click="testToast"
                    class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg">
                    <font-awesome-icon icon="check" class="mr-2" />
                    Test Toast
                </button>

                <button @click="testConfirm"
                    class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium shadow-lg">
                    <font-awesome-icon icon="trash" class="mr-2" />
                    Test Confirm
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSwal } from '@/plugins/sweetalert'

const { toastSuccess, success, confirmDelete } = useSwal()

const testToast = () => {
    toastSuccess('Berhasil! Ini toast keren 🔥')
}

const testConfirm = async () => {
    const result = await confirmDelete()
    if (result) {
        success('Data berhasil dihapus!')
    }
}
</script>
