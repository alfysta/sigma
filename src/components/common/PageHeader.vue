<template>
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-white">{{ title }}</h1>
            <p class="text-gray-400 text-sm mt-2">{{ desc }}</p>
        </div>
        <div class="flex items-center flex-wrap gap-2">
            <!-- Primary Button -->
            <button v-if="primaryBtnId" :id="primaryBtnId"
                class="btn-gold px-6 py-2.5 text-sm shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center gap-2 hover:scale-105 transition-transform"
                @click="$emit('primary-click')">
                <font-awesome-icon :icon="primaryBtnIcon" class="text-lg" />
                {{ primaryBtnText }}
            </button>

            <!-- Secondary Actions Dropdown -->
            <div v-if="secondaryActions.length" class="relative inline-block">
                <button
                    class="bg-black/60 border border-brand-gold/40 text-brand-gold px-4 py-2.5 text-sm rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.15)] flex items-center gap-2 hover:bg-brand-gold hover:text-black hover:scale-105 transition-all"
                    @click.stop="showDropdown = !showDropdown">
                    <font-awesome-icon icon="ellipsis-vertical" class="text-lg" /> Aksi
                    <font-awesome-icon icon="caret-down" class="text-xs" />
                </button>
                <div v-if="showDropdown"
                    class="absolute right-0 top-full mt-2 w-48 bg-[#1e0a2d]/95 border border-brand-gold/30 rounded-xl shadow-2xl backdrop-blur-xl z-50"
                    @click.stop>
                    <button v-for="action in secondaryActions" :key="action.id"
                        class="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-all flex items-center gap-2"
                        @click="$emit('secondary-click', action.id); showDropdown = false">
                        <font-awesome-icon :icon="action.icon" class="w-5" /> {{ action.text }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
    title: string
    desc: string
    primaryBtnId?: string
    primaryBtnIcon?: string
    primaryBtnText?: string
    secondaryActions?: { id: string; icon: string; text: string }[]
}>()

defineEmits<{
    (e: 'primary-click'): void
    (e: 'secondary-click', id: string): void
}>()

const showDropdown = ref(false)
</script>
