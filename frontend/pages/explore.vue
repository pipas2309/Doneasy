<script setup lang="ts">
import TaskList from '~/components/tasks/TaskList.vue'
import AddTask from '~/components/tasks/AddTask.vue'

// Dados mockados para exibição
const user = ref({
    id: 7,
    email: 'Dora@exploradora.com',
    username: 'Dora',
    fullName: 'Dora Marcodes Curios Exploradora',
    cpf: '123.456.789-00',
    createdAt: '2025-01-12T21:18:59.776+00:00',
    updatedAt: '2025-01-12T21:18:59.776+00:00',
})
const tasks = ref([
    {
        id: 1,
        userId: 0,
        title: 'Planejar viagem de férias',
        description: 'Escolher destinos, comprar passagens e reservar hotel.',
        priority: 'Alta',
        status: 'Em andamento',
        color: '#3498db',
        estimatedEndAt: '2025-02-01T00:00:00.000+00:00',
        startAt: '2025-01-01T00:00:00.000+00:00',
        endAt: null,
        sortOrder: 1,
        createdAt: '2025-01-10T10:00:00.000+00:00',
        updatedAt: '2025-01-10T10:00:00.000+00:00',
    },
    {
        id: 2,
        userId: 0,
        title: 'Organizar armário',
        description: 'Separar roupas para doação e reorganizar os itens.',
        priority: 'Média',
        status: 'Pendente',
        color: '#2ecc71',
        estimatedEndAt: '2025-01-15T00:00:00.000+00:00',
        startAt: null,
        endAt: null,
        sortOrder: 2,
        createdAt: '2025-01-09T08:30:00.000+00:00',
        updatedAt: '2025-01-09T08:30:00.000+00:00',
    },
    {
        id: 3,
        userId: 0,
        title: 'Estudar JavaScript',
        description: 'Completar o curso de fundamentos de JavaScript.',
        priority: 'Alta',
        status: 'Concluído',
        color: '#9b59b6',
        estimatedEndAt: '2025-01-20T00:00:00.000+00:00',
        startAt: '2025-01-05T00:00:00.000+00:00',
        endAt: '2025-01-10T00:00:00.000+00:00',
        sortOrder: 3,
        createdAt: '2025-01-08T09:15:00.000+00:00',
        updatedAt: '2025-01-10T00:00:00.000+00:00',
    },
])
const showAddTaskModal = ref(false)

async function doReorder(newOrder: any[]) {
    tasks.value = newOrder.map((task, index) => ({ ...task, sortOrder: index + 1 }))
}

const showDetailModal = ref(false)
const selectedTask = ref<any>(null)

function onTaskClicked(task: any) {
    selectedTask.value = task
    showDetailModal.value = true
}

function closeDetail() {
    showDetailModal.value = false
    selectedTask.value = null
}

function openAddTaskModal() {
    showAddTaskModal.value = true
}

function handleNewTask(task: any) {
    tasks.value.push(task)
    showAddTaskModal.value = false
}
</script>

<template>
    <div>
        <header class="flex justify-between items-center mb-4">
            <h1 class="text-3xl font-bold mb-6 text-center">Bem-vindo ao Doneasy, {{ user.username }}!</h1>
            <button
                class="bg-blue-500 text-white px-4 py-2 rounded"
                @click="openAddTaskModal"
            >
                + Adicionar Tarefa
            </button>
        </header>

        <TaskList :tasks="tasks" :doReorder="doReorder" @taskClicked="onTaskClicked"/>

        <div
            v-if="showDetailModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            @click.self="closeDetail"
        >
            <div class="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 class="text-xl font-bold mb-2">{{ selectedTask?.title }}</h2>
                <p class="text-sm text-gray-700 mb-4">{{ selectedTask?.description }}</p>
                <div class="text-xs text-gray-500 mb-2">
                    <span v-if="selectedTask?.priority">Prioridade: {{ selectedTask.priority }} |</span>
                    <span v-if="selectedTask?.status">Status: {{ selectedTask.status }} |</span>
                    <span v-if="selectedTask?.estimatedEndAt">
            Estimativa: {{ new Date(selectedTask.estimatedEndAt).toLocaleDateString() }}
          </span>
                </div>

                <button
                    class="bg-gray-500 text-white py-2 px-4 rounded mt-4 mr-10"
                    @click="closeDetail"
                    disabled
                >
                    Editar
                </button>
                <button
                    class="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                    @click="closeDetail"
                >
                    Fechar
                </button>

            </div>
        </div>
        <div class="mt-8 text-center">
            <p class="text-sm text-gray-500">
                Quer gerenciar suas tarefas? <a href="/register" class="text-blue-500 underline">Registre-se agora!</a>
            </p>
        </div>

        <AddTask
            v-if="showAddTaskModal"
            @close="showAddTaskModal = false"
            @save="handleNewTask"
        />
    </div>
</template>

<style scoped>
h1 {
    color: #2c3e50;
}

p {
    color: #34495e;
}
</style>
