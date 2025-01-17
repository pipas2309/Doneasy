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
        task.value = {
            ...data,
            estimatedEndAt: data.estimatedEndAt?.split('T')[0],
            startAt: data.startAt?.split('T')[0],
            endAt: data.endAt?.split('T')[0],
        }

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

function goDashboard() {
    router.push('/dashboard')
}
</script>

<template>
    <!-- Card centralizado -->
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-md shadow space-y-6">

        <!-- Título principal -->
        <h1 class="text-2xl font-bold">Editar Tarefa</h1>

        <!-- Se houver erro, mostra -->
        <p v-if="errorMessage" class="text-red-500">
            {{ errorMessage }}
        </p>

        <!-- Formulário de edição (só mostra quando a task está carregada) -->
        <div v-if="task" class="space-y-4">
            <!-- Título -->
            <div>
                <label class="block font-semibold mb-1">Título</label>
                <input
                    v-model="task.title"
                    type="text"
                    class="border rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <!-- Descrição -->
            <div>
                <label class="block font-semibold mb-1">Descrição</label>
                <textarea
                    v-model="task.description"
                    rows="3"
                    class="border rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-300"
                ></textarea>
            </div>

            <!-- Prioridade -->
            <div>
                <label class="block font-semibold mb-1">Prioridade</label>
                <select
                    v-model="task.priority"
                    class="border rounded w-full p-2 bg-white focus:outline-none focus:ring focus:ring-blue-300"
                >
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                </select>
            </div>

            <!-- Status -->
            <div>
                <label class="block font-semibold mb-1">Status</label>
                <input
                    v-model="task.status"
                    type="text"
                    class="border rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <!-- Estimativa de entrega -->
            <div>
                <label class="block font-semibold mb-1">Estimativa de entrega</label>
                <input
                    v-model="task.estimatedEndAt"
                    type="date"
                    class="border rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <!-- Datas de início e término, lado a lado em telas grandes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block font-semibold mb-1">Data de início</label>
                    <input
                        v-model="task.startAt"
                        type="date"
                        class="border rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label class="block font-semibold mb-1">Data de término</label>
                    <input
                        v-model="task.endAt"
                        type="date"
                        class="border rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
            </div>

            <!-- Botões de ação -->
            <div class="flex space-x-4 pt-2">
                <button
                    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
                    @click="updateTask"
                >
                    Salvar
                </button>
                <button
                    class="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded transition"
                    @click="goDashboard"
                >
                    Voltar
                </button>
            </div>
        </div>
    </div>
</template>
