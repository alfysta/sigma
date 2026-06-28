<template>
    <div class="flex h-screen overflow-hidden bg-[#0a0015]">
        <!-- Sidebar -->
        <AppSidebar ref="sidebarRef" />

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- Header -->
            <AppHeader @toggle-sidebar="sidebarRef?.toggle()" />

            <!-- Page Content (Router View untuk semua halaman dalam dashboard) -->
            <main class="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const sidebarRef = ref<InstanceType<typeof AppSidebar> | null>(null)
</script>
