<script setup lang="ts">

const config = useRuntimeConfig()
const router = useRouter()

const identity = ref('')
const password = ref('')
const isRememberMe = ref(false)
const errorMessage = ref('')

async function doLogin() {
    errorMessage.value = ''
    try {
        const resp = await $fetch('/login', {
            baseURL: config.public.apiBase,
            method: 'POST',
            credentials: 'include',
            body: {
                username: identity.value,
                password: password.value,
                isRememberMe: isRememberMe.value,
            },
        })
        await router.push('/dashboard')
    } catch (err: any) {
        errorMessage.value = err?.data?.message || 'Erro ao logar'
    }
}
</script>

<template>
    <img
        src="public/doneasy%20total.png"
        alt="Doneasy"
        title="Doneasy, seu app de tarefas"
        class="max-w-md mx-auto"
    >

    <div class="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
        <h1 class="text-2xl font-bold mb-4">Login</h1>

        <div v-if="errorMessage" class="text-red-500 mb-2">
            {{ errorMessage }}
        </div>

        <form @submit.prevent="doLogin" class="flex flex-col gap-4">
            <div>
                <label class="block font-medium">Username ou Email</label>
                <input v-model="identity" type="text" class="border rounded w-full p-2" />
            </div>
            <div>
                <label class="block font-medium">Password</label>
                <input v-model="password" type="password" class="border rounded w-full p-2" />
            </div>
            <div class="flex items-center gap-2 hidden">
                <input v-model="isRememberMe" type="checkbox" value="false"/>
                <span>Remember me</span>
            </div>

            <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded">
                Entrar
            </button>
        </form>

        <div class="mt-4 text-center">
            <NuxtLink
                to="/register"
                class="text-blue-600 underline"
            >
                Não tem conta? Registre-se agora
            </NuxtLink>
        </div>
        <div class="mt-2 text-center">
            <NuxtLink
                to="/explore"
                class="text-gray-600 underline"
            >
                Ou conheça nossa página sem se registrar
            </NuxtLink>
        </div>
    </div>
</template>
