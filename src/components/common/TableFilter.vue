<template>
    <div class="glass-card p-4 w-full flex gap-4 items-center">
        <div class="relative flex-1">
            <font-awesome-icon icon="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" />
            <input :id="inputId" :value="modelValue"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" class="input-dark w-full"
                style="padding-left: 2.75rem !important;" placeholder="Pencarian data..." />
        </div>
        <div class="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">Baris</span>
            <select :id="selectId" :value="limit"
                @change="$emit('update:limit', Number(($event.target as HTMLSelectElement).value))"
                class="bg-transparent text-white border-0 text-sm font-bold outline-none cursor-pointer focus:ring-0">
                <option class="bg-brand-main" :value="15">15</option>
                <option class="bg-brand-main" :value="30">30</option>
                <option class="bg-brand-main" :value="50">50</option>
                <option class="bg-brand-main" :value="100">100</option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string
    limit: number
    inputId?: string
    selectId?: string
}>()

defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'update:limit', value: number): void
}>()
</script>

<style scoped>
/* ═══════════════════════════════════════════
   PERSIS KODE LAMA
   ═══════════════════════════════════════════ */
.glass-card {
    background: rgba(20, 5, 35, 0.55);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(251, 191, 36, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    border-radius: 1.5rem;
}

.input-dark {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(107, 33, 168, 0.6);
    color: white;
    border-radius: 0.75rem;
    padding: 0.6rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.3s;
}

.input-dark:focus {
    border-color: #fbbf24;
    box-shadow: 0 0 12px rgba(251, 191, 36, 0.3);
}

.input-dark::placeholder {
    color: rgba(255, 255, 255, 0.35);
}

.text-brand-gold {
    color: #fbbf24;
}

.bg-brand-main {
    background-color: #3b0764;
}
</style>
