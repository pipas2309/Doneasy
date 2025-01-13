<script setup lang="ts">

const config = useRuntimeConfig()
const router = useRouter()
const { isLoggedIn, logout, checkAuth } = useAuth()
const props = defineProps<{ isOpen: boolean, onClose: () => void }>()

watch(() => props.isOpen, async (isOpen) => {
    if (isOpen) {
        await checkAuth()
    }
})

async function doLogout() {
    await logout()
    await router.push('/login')
    props.onClose()
}
</script>

<template>
    <transition name="slide-x" appear>
        <div
            v-if="isOpen"
            class="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
            @click.self="onClose"
        >
            <aside class="bg-gray-800 text-white w-64 p-4">
                <h2 class="text-xl font-bold mb-4">Menu</h2>

                <nav class="flex flex-col gap-2">
                    <!-- Se logged in -->
                    <template v-if="isLoggedIn">
                        <NuxtLink to="/dashboard" @click.self="onClose" class="text-left hover:underline">Dashboard</NuxtLink>
                        <NuxtLink to="/me" @click.self="onClose" class="text-left hover:underline">Perfil</NuxtLink>
                        <button @click="doLogout" @click.self="onClose" class="text-left hover:underline">Logout</button>
                    </template>

                    <!-- Se não logado -->
                    <template v-else>
                        <NuxtLink to="/login" @click.self="onClose" class="text-left hover:underline">Entrar</NuxtLink>
                        <NuxtLink to="/register" @click.self="onClose" class="text-left hover:underline">Registrar</NuxtLink>
                        <NuxtLink to="/explore" @click.self="onClose" class="text-left hover:underline">Conhecer</NuxtLink>
                    </template>
                </nav>
            </aside>
        </div>
    </transition>
</template>

<style scoped>
.slide-x-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}
.slide-x-enter-to {
    transform: translateX(0);
    opacity: 1;
}
.slide-x-enter-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-x-leave-from {
    transform: translateX(0);
    opacity: 1;
}
.slide-x-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}
.slide-x-leave-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
</style>
