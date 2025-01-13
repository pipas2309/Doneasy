<script setup lang="ts">
const props = defineProps<{ onMenuClick: () => void }>() // Recebe uma função
</script>

<template>
    <header class="bg-gray-800 text-white p-4 flex items-center justify-between">
        <img src="public/doneasy.png" alt="Doneasy" title="Doneasy, seu app de tarefas" class="max-h-12">
        <div class="font-bold text-xl">Doneasy</div>
        <!-- Botão para abrir o menu lateral -->
        <button @click="props.onMenuClick" class="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 text-2xl">
            ☰
        </button>
    </header>
</template>
