<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const errorField = ref<Record<string, string>>({})

async function doRegister() {
    errorField.value = {}
    try {
        await $fetch('/register', {
            baseURL: config.public.apiBase,
            method: 'POST',
            credentials: 'include',
            body: {
                username: username.value || undefined,
                email: email.value || undefined,
                password: password.value,
            },
        })
        await router.push('/dashboard')
    } catch (err: any) {
        const errors: array = err?.data?.errors || []
        errors.forEach((error: { field: string; message: string }) => {
            errorField.value[error.field] = error.message
        })
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
        <h1 class="text-2xl font-bold mb-4">Registro</h1>

        <form @submit.prevent="doRegister" class="flex flex-col gap-4">
            <div>
                <label class="block font-medium">Username</label>
                <div v-if="errorField.username" class="text-red-500 text-sm mb-1">
                    {{ errorField.username }}
                </div>
                <input v-model="username" type="text" class="border rounded w-full p-2" />
            </div>
            <div>
                <label class="block font-medium">Email <span class="text-[#6b7280] text-sm">Opcional</span></label>
                <div v-if="errorField.email" class="text-red-500 text-sm mb-1">
                    {{ errorField.email }}
                </div>
                <input v-model="email" type="email" class="border rounded w-full p-2" />
            </div>
            <div>
                <label class="block font-medium">Password</label>
                <div v-if="errorField.password" class="text-red-500 text-sm mb-1">
                    {{ errorField.password }}
                </div>
                <input v-model="password" type="password" class="border rounded w-full p-2" />
            </div>

            <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded">
                Registrar
            </button>
        </form>

        <div class="mt-4 text-center">
            <NuxtLink
                to="/login"
                class="text-blue-600 underline"
            >
                Já é cadastrado? Entre agora!
            </NuxtLink>
        </div>
    </div>
</template>
