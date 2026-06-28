<template>
    <div>
        <h1 class="text-3xl md:text-4xl font-black text-white drop-shadow-lg">Dashboard</h1>
        <p class="text-brand-gold mt-1 text-sm font-medium">
            Selamat datang, {{ authStore.userName }}
        </p>
        <p class="text-gray-400 text-xs mt-2">
            Role: {{ authStore.user?.Role || 'User' }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
</script>
