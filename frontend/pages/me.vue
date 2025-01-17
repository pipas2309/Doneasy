<script setup lang="ts">
const router = useRouter()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const originalEmail = ref('')
const email = ref('')
const originalUsername = ref('')
const username = ref('')
const fullName = ref('')
const cpf = ref('')

const oldPassword = ref('')
const newPassword = ref('')

const errorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
    try {
        const user = await $fetch('/me', {
            baseURL: apiBase,
            credentials: 'include'
        })
        email.value = user.email ?? ''
        originalEmail.value = user.email ?? ''
        username.value = user.username ?? ''
        originalUsername.value = user.username ?? ''
        fullName.value = user.fullName ?? ''
        cpf.value = user.cpf ?? ''
    } catch (err: any) {
        errorMessage.value = err?.data?.message || 'Erro ao carregar perfil'
    }
})

async function updateProfile() {
    errorMessage.value = ''
    successMessage.value = ''
    try {
        const body: any = {}

        if (fullName.value === '' && originalEmail.value !== '') {
            body.fullName = null
        } else if (fullName.value !== '') {
            body.fullName = fullName.value
        }

        if (cpf.value === '') {
            body.cpf = null
        } else {
            body.cpf = cpf.value
        }

        if (email.value === '') {
            body.email = null
        } else if (email.value !== originalEmail.value) {
            body.email = email.value
        }

        if (username.value === '') {
            body.username = null
        } else if (username.value !== originalUsername.value) {
            body.username = username.value
        }

        await $fetch('/me', {
            baseURL: apiBase,
            method: 'PUT',
            credentials: 'include',
            body,
        })
        successMessage.value = 'Perfil atualizado com sucesso!'
    } catch (err: any) {
        errorMessage.value = err?.data?.errors[0].message || 'Falha ao atualizar perfil'
    }
}

async function changePassword() {
    errorMessage.value = ''
    successMessage.value = ''
    if (!oldPassword.value || !newPassword.value) {
        errorMessage.value = 'Preencha as senhas'
        return
    }
    try {
        await $fetch('/me/password', {
            baseURL: apiBase,
            method: 'PUT',
            credentials: 'include',
            body: {
                oldPassword: oldPassword.value,
                newPassword: newPassword.value,
            },
        })
        successMessage.value = 'Senha alterada com sucesso'
        oldPassword.value = ''
        newPassword.value = ''
    } catch (err: any) {
        errorMessage.value = err?.data.errors[0].message || 'Falha ao alterar senha'
    }
}
</script>

<template>
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-md shadow space-y-8">
        <div>
            <h1 class="text-2xl font-bold mb-2">Meu Perfil</h1>

            <div v-if="errorMessage" class="text-red-500 mb-2">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="text-green-500 mb-2">
                {{ successMessage }}
            </div>

            <form @submit.prevent="updateProfile" class="space-y-4">
                <div>
                    <label class="block font-semibold">Email</label>
                    <input
                        v-model="email"
                        type="text"
                        class="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label class="block font-semibold">Username</label>
                    <input
                        v-model="username"
                        type="text"
                        class="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label class="block font-semibold">Full Name</label>
                    <input
                        v-model="fullName"
                        type="text"
                        class="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label class="block font-semibold">CPF</label>
                    <input
                        v-model="cpf"
                        type="text"
                        class="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <button
                    type="submit"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                    Atualizar Perfil
                </button>
            </form>
        </div>

        <div>
            <h2 class="text-xl font-bold mb-2">Trocar Senha</h2>
            <div class="space-y-4">
                <div>
                    <label class="block font-semibold">Senha Antiga</label>
                    <input
                        v-model="oldPassword"
                        type="password"
                        class="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label class="block font-semibold">Nova Senha</label>
                    <input
                        v-model="newPassword"
                        type="password"
                        class="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <button
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                    @click="changePassword"
                >
                    Alterar Senha
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    layout: 'dashboard',
}
</script>
