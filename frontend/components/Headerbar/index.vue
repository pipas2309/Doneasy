<script setup lang="ts">
const props = defineProps<{ onMenuClick: () => void }>()
</script>

<template>
    <header class="bg-gray-800 text-white p-4 flex items-center justify-between">
        <!-- Logo/Imagem -->
        <img
            src="public/doneasy.png"
            alt="Doneasy"
            title="Doneasy, seu app de tarefas"
            class="max-h-12"
        />

        <!-- Título ou link para Dashboard -->
        <NuxtLink to="/dashboard" class="font-bold text-xl hover:opacity-90">
            Doneasy
        </NuxtLink>

        <!-- Botão que dispara o menu lateral -->
        <button
            @click="props.onMenuClick"
            class="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 text-2xl transition"
        >
            ☰
        </button>
    </header>
</template>
