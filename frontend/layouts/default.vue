<template>
    <!-- Barra de topo -->
    <Headerbar :on-menu-click="toggleSidebar" />

    <!-- Estrutura geral -->
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <Sidebar :is-open="isSidebarOpen" :on-close="closeSidebar" />

        <!-- Conteúdo principal -->
        <main class="flex-1 bg-gray-50 overflow-y-auto">
            <!-- Container centralizado -->
            <div class="max-w-7xl mx-auto p-4">
                <!-- Aqui entra o conteúdo que cada página injeta -->
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false)
const { checkAuth } = useAuth()

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
    isSidebarOpen.value = false
}

onMounted(() => {
    checkAuth()
})
</script>
