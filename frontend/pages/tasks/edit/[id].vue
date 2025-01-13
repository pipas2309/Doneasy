<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const taskId = route.params.id
const task = ref<any>(null)
const errorMessage = ref('')

onMounted(async () => {
    try {
        const data = await $fetch(`/tasks/${taskId}`, {
            baseURL: apiBase,
            credentials: 'include',
        })
        task.value = data
    } catch (err: any) {
        errorMessage.value = err?.data?.message || 'Erro ao carregar task'
    }
})

async function updateTask() {
    try {
        await $fetch(`/tasks/${taskId}`, {
            baseURL: apiBase,
            method: 'PUT',
            credentials: 'include',
            body: task.value,
        })
        await router.push('/dashboard')
    } catch (err: any) {
        errorMessage.value = 'Falha ao atualizar'
    }
}

function goDashboard(task: any) {
    router.push(`/dashboard`)
}
</script>

<template>
    <div>
        <h1 class="text-xl font-bold">Editar Task</h1>
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

        <div v-if="task">
            <label>Título</label>
            <input v-model="task.title" type="text" class="border p-2 w-full" />

            <label>Descrição</label>
            <textarea v-model="task.description" class="border p-2 w-full"></textarea>

            <label>Prioridade</label>
            <select v-model="task.priority" class="border p-2 w-full">
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
            </select>

            <label>Status</label>
            <input v-model="task.status" type="text" class="border p-2 w-full" />

            <label>Estimativa de entrega</label>
            <input v-model="task.estimatedEndAt" type="date" class="border p-2 w-full" />

            <label>Data de início</label>
            <input v-model="task.startAt" type="date" class="border p-2 w-full" />

            <label>Data de término</label>
            <input v-model="task.endAt" type="date" class="border p-2 w-full" />

            <button
                class="bg-blue-500 text-white px-4 py-2 rounded mt-4 mr-5"
                @click="updateTask"
            >
                Salvar
            </button>

            <button
                class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                @click="goDashboard"
            >
                Voltar
            </button>
        </div>
    </div>
</template>
