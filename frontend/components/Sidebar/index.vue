<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()
const { isLoggedIn, logout, checkAuth } = useAuth()

const props = defineProps<{
    isOpen: boolean
    onClose: () => void
}>()

watch(
    () => props.isOpen,
    async (isOpen) => {
        if (isOpen) {
            await checkAuth()
        }
    }
)

async function doLogout() {
    await logout()
    await router.push('/login')
    props.onClose()
}
</script>

<template>
    <!-- Transição para “deslizar da direita” -->
    <transition name="slide-right" appear>
        <div
            v-if="isOpen"
            class="fixed inset-0 z-50"
        >
            <!-- Overlay para escurecer a tela -->
            <div
                class="absolute inset-0 bg-black bg-opacity-50"
                @click.self="props.onClose"
            ></div>

            <!-- A sidebar em si, alinhada à direita -->
            <aside
                class="absolute right-0 top-0 h-full w-60 bg-gray-800 text-white p-4 flex flex-col"
            >
                <!-- Cabeçalho da sidebar -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold">Menu</h2>
                    <!-- Botão de fechar (opcional) -->
                    <button
                        class="text-2xl font-semibold hover:text-gray-300 transition"
                        @click="props.onClose"
                    >
                        ✕
                    </button>
                </div>

                <!-- Navegação -->
                <nav class="flex flex-col gap-2">
                    <!-- Se logged in -->
                    <template v-if="isLoggedIn">
                        <NuxtLink
                            to="/dashboard"
                            @click="props.onClose"
                            class="hover:underline"
                        >
                            Dashboard
                        </NuxtLink>

                        <NuxtLink
                            to="/me"
                            @click="props.onClose"
                            class="hover:underline"
                        >
                            Perfil
                        </NuxtLink>

                        <button
                            @click="doLogout"
                            class="text-left hover:underline"
                        >
                            Logout
                        </button>
                    </template>

                    <!-- Se não logado -->
                    <template v-else>
                        <NuxtLink
                            to="/login"
                            @click="props.onClose"
                            class="hover:underline"
                        >
                            Entrar
                        </NuxtLink>

                        <NuxtLink
                            to="/register"
                            @click="props.onClose"
                            class="hover:underline"
                        >
                            Registrar
                        </NuxtLink>

                        <NuxtLink
                            to="/explore"
                            @click="props.onClose"
                            class="hover:underline"
                        >
                            Conhecer
                        </NuxtLink>
                    </template>
                </nav>

                <!-- Espaço extra, se quiser algo no rodapé da sidebar -->
                <div class="mt-auto text-xs text-gray-400">
                    <p>© 2025 - Doneasy</p>
                </div>
            </aside>
        </div>
    </transition>
</template>

<style scoped>
/* Transição para aparecer/desaparecer da direita */
.slide-right-enter-from {
    transform: translateX(100%);
    opacity: 0;
}
.slide-right-enter-to {
    transform: translateX(0);
    opacity: 1;
}
.slide-right-enter-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-right-leave-from {
    transform: translateX(0);
    opacity: 1;
}
.slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
.slide-right-leave-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
</style>
