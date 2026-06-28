<template>
    <div class="p-4 border-t border-white/5">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <!-- Total Data -->
            <div class="text-xs text-brand-gold font-bold tracking-wider">
                <font-awesome-icon icon="database" class="mr-2" />Total: {{ total }} Data
            </div>

            <template v-if="totalPages > 1">
                <!-- ========== DESKTOP ========== -->
                <div class="hidden md:flex gap-1.5">
                    <button v-if="currentPage > 1" class="page-item"
                        @click="$emit('update:currentPage', currentPage - 1)">
                        <font-awesome-icon icon="chevron-left" class="text-xs" />
                    </button>

                    <template v-for="(page, idx) in desktopPages" :key="page">
                        <span v-if="page === '...'"
                            class="w-8 h-8 flex items-center justify-center text-gray-500 text-sm">...</span>
                        <button v-else class="page-item text-sm"
                            :class="{ 'active shadow-[0_0_10px_rgba(251,191,36,0.3)]': page === currentPage }"
                            @click="$emit('update:currentPage', page)">
                            {{ page }}
                        </button>
                    </template>

                    <button v-if="currentPage < totalPages" class="page-item"
                        @click="$emit('update:currentPage', currentPage + 1)">
                        <font-awesome-icon icon="chevron-right" class="text-xs" />
                    </button>
                </div>

                <!-- ========== MOBILE ========== -->
                <div class="flex md:hidden items-center justify-between gap-2 w-full">
                    <!-- Prev -->
                    <div v-if="currentPage > 1" class="page-item flex items-center gap-1 px-3"
                        @click="$emit('update:currentPage', currentPage - 1)">
                        <font-awesome-icon icon="arrow-left" class="text-xs" />
                        <span class="text-[10px] hidden sm:inline">Sebelumnya</span>
                    </div>
                    <div v-else class="w-8 h-8"></div>

                    <!-- Indicator -->
                    <div
                        class="flex items-center gap-1 bg-brand-main/40 rounded-full px-4 py-1.5 border border-brand-gold/20 shadow-inner">
                        <span class="text-brand-gold font-bold text-sm">{{ currentPage }}</span>
                        <span class="text-gray-500 text-sm">/</span>
                        <span class="text-gray-400 text-sm">{{ totalPages }}</span>
                    </div>

                    <!-- Next -->
                    <div v-if="currentPage < totalPages" class="page-item flex items-center gap-1 px-3"
                        @click="$emit('update:currentPage', currentPage + 1)">
                        <span class="text-[10px] hidden sm:inline">Berikutnya</span>
                        <font-awesome-icon icon="arrow-right" class="text-xs" />
                    </div>
                    <div v-else class="w-8 h-8"></div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    total: number
    currentPage: number
    totalPages: number
}>()

defineEmits<{
    (e: 'update:currentPage', page: number): void
}>()

// Desktop pages dengan ellipsis
const desktopPages = computed(() => {
    const pages: (number | string)[] = []
    const cp = props.currentPage
    const tp = props.totalPages

    const pageSet = new Set<number>()
    pageSet.add(1)
    pageSet.add(tp)
    for (let i = cp - 2; i <= cp + 2; i++) {
        if (i > 1 && i < tp) pageSet.add(i)
    }

    const sorted = [...pageSet].sort((a, b) => a - b)
    sorted.forEach((p, idx) => {
        if (idx > 0 && p - sorted[idx - 1] > 1) {
            pages.push('...')
        }
        pages.push(p)
    })

    return pages
})
</script>

<style scoped>
.page-item {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid rgba(251, 191, 36, 0.3);
    background: rgba(59, 7, 100, 0.5);
    font-size: 0.875rem;
    color: #d1d5db;
    transition: all 0.2s;
}

.page-item:hover:not(.active) {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
}

.page-item.active {
    background: #fbbf24;
    color: #1e0a2d;
    font-weight: bold;
}
</style>
