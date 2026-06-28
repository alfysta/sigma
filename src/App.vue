<template>
  <div v-if="showSplash" class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0015]">
    <div class="text-center">
      <div class="w-16 h-1 bg-gradient-to-r from-brand-gold to-transparent mx-auto mb-4 rounded-full"></div>
      <p class="text-gray-400 text-sm">MEMUAT...</p>
    </div>
  </div>

  <router-view v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showSplash = ref(true)

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false
  }, 1500)
})
</script>
