<template>
    <Headerbar :on-menu-click="toggleSidebar" />
    <div class="flex h-screen">

        <Sidebar :is-open="isSidebarOpen" :on-close="closeSidebar"/>

        <main class="flex-1 p-4 bg-gray-50 overflow-y-auto">
            <slot />
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
