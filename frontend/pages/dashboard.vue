<script setup lang="ts">
import TaskList from '~/components/tasks/TaskList.vue'
import AddTask from '~/components/tasks/AddTask.vue'

const router = useRouter()

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const userName = ref('')
const tasks = ref<any[]>([])
const errorMessage = ref('')
const showDetailModal = ref(false)
const selectedTask = ref<any>(null)
const showAddTaskModal = ref(false)
const showColorPicker = ref(false)
const showDeleteModal = ref(false)

const availableColors = [
    { name: 'blue', hex: '#3498db' },
    { name: 'green', hex: '#2ecc71' },
    { name: 'red', hex: '#e74c3c' },
    { name: 'yellow', hex: '#f1c40f' },
    { name: 'purple', hex: '#9b59b6' },
    { name: 'darkBlue', hex: '#34495e' },
]

function toggleColorPicker() {
    showColorPicker.value = !showColorPicker.value
}

onMounted(async () => {
    await loadUser()
    await loadTasks()
})

async function loadUser() {
    try {
        const user = await $fetch('/me', {
            baseURL: apiBase,
            credentials: 'include',
        })
        userName.value = user.username || user.email || 'Usuário'
    } catch (err: any) {
        console.error('Erro ao carregar user:', err)
    }
}

async function loadTasks() {
    errorMessage.value = ''
    try {
        tasks.value = await $fetch('/tasks', {
            baseURL: apiBase,
            credentials: 'include',
        })
    } catch (err: any) {
        errorMessage.value = err?.data?.message || 'Falha ao carregar tasks'
        console.error('Erro loadTasks:', err)
    }
}

async function doReorder(newOrder: any[]) {
    try {
        const body = {
            tasks: newOrder.map((t, index) => ({
                id: t.id,
                sortOrder: index + 1,
            })),
        }
        await $fetch('/tasks/reorder', {
            baseURL: apiBase,
            method: 'PUT',
            credentials: 'include',
            body,
        })
        await loadTasks()
    } catch (err: any) {
        errorMessage.value = 'Falha ao reordenar'
        console.error('Erro reorder:', err)
    }
}

function onTaskClicked(task: any) {
    selectedTask.value = task
    showDetailModal.value = true
}

function closeDetail() {
    showDetailModal.value = false
    selectedTask.value = null
    showColorPicker.value = false
}

function goEditTask(task: any) {
    router.push(`/tasks/edit/${task.id}`)
}

function formatDate(dateString?: string) {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
}

function openAddTaskModal() {
    showAddTaskModal.value = true
}

function confirmDeleteTask() {
    showDeleteModal.value = true
}

function closeDeleteModal() {
    showDeleteModal.value = false
}

async function deleteTask() {
    if (!selectedTask.value) return
    try {
        await $fetch(`/tasks/${selectedTask.value.id}`, {
            baseURL: apiBase,
            method: 'DELETE',
            credentials: 'include',
        })
        showDeleteModal.value = false
        closeDetail()
        await loadTasks()
    } catch (err) {
        console.error('Erro ao excluir task:', err)
    }
}

async function handleNewTask(task: any) {
    await $fetch('/tasks', {
        baseURL: apiBase,
        method: 'POST',
        credentials: 'include',
        body: task,
    })
    await loadTasks()
    showAddTaskModal.value = false
}

async function changeTaskColor(color: string) {
    if (!selectedTask.value) return
    try {
        await $fetch(`/tasks/${selectedTask.value.id}`, {
            baseURL: apiBase,
            method: 'PUT',
            credentials: 'include',
            body: { color: color },
        })
        selectedTask.value.color = color
        await loadTasks()
        showColorPicker.value = false
    } catch (err) {
        console.error('Erro ao alterar cor:', err)
    }
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">
            Tarefas de {{ userName }}
        </h1>

        <header class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">Dashboard</h1>
            <button
                class="bg-blue-500 text-white px-4 py-2 rounded"
                @click="openAddTaskModal"
            >
                + Adicionar Tarefa
            </button>
        </header>

        <p v-if="errorMessage" class="text-red-500 mb-2">
            {{ errorMessage }}
        </p>

        <TaskList :tasks="tasks" :doReorder="doReorder" @taskClicked="onTaskClicked" />

        <!-- Modal de detalhes da tarefa-->
        <div
            v-if="showDetailModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            @click.self="closeDetail"
        >
            <div class="bg-white p-6 rounded shadow w-full max-w-md">
                <!-- Bloco com título e seletor de cor -->
                <div class="flex justify-between items-center">

                    <h2 class="text-xl font-bold mb-2">{{ selectedTask?.title }}</h2>
                    <!-- Botão para abrir o seletor de cores -->
                    <div class="relative">
                        <div
                            :style="{ backgroundColor: selectedTask?.color }"
                            class="w-6 h-6 rounded-full border cursor-pointer"
                            @click="toggleColorPicker"
                        ></div>

                        <!-- Mini modal de cores -->
                        <div
                            v-if="showColorPicker"
                            class="absolute top-8 right-0 bg-white p-2 rounded shadow flex gap-2"
                        >
                            <div
                                v-for="color in availableColors"
                                :key="color.name"
                                :style="{ backgroundColor: color.hex }"
                                class="w-6 h-6 rounded-full cursor-pointer border"
                                @click="changeTaskColor(color.hex)"
                            ></div>
                        </div>
                    </div>
                </div>

                <p class="text-sm text-gray-700 mb-4">{{ selectedTask?.description }}</p>

                <div class="text-xs text-gray-500 mb-2">
                    <span v-if="selectedTask?.priority">Prioridade: {{ selectedTask.priority }} |</span>
                    <span v-if="selectedTask?.status"> Status: {{ selectedTask.status }} |</span>
                    <span v-if="selectedTask?.estimatedEndAt"> Estimativa: {{ formatDate(selectedTask.estimatedEndAt) }}</span>
                </div>

                <div class="mt-4 flex gap-2">
                    <button
                        class="bg-blue-500 text-white py-2 px-4 rounded mr-5"
                        @click="goEditTask(selectedTask)"
                    >
                        Editar
                    </button>
                    <button
                        class="bg-gray-300 text-gray-700 py-2 px-4 rounded"
                        @click="closeDetail"
                    >
                        Fechar
                    </button>
                    <button
                        class="ml-auto bg-red-500 text-white py-2 px-4 rounded flex items-center"
                        @click="confirmDeleteTask"
                    >
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>

            <!-- Modal de confirmação de exclusão-->
            <div
                v-if="showDeleteModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                @click.self="closeDeleteModal"
            >
                <div class="bg-white p-6 rounded shadow w-full max-w-sm">
                    <h2 class="text-lg font-bold mb-4">Confirmar Exclusão</h2>
                    <p>Você tem certeza que deseja excluir esta tarefa?</p>

                    <div class="mt-4 flex justify-end gap-2">
                        <button
                            class="bg-gray-300 text-gray-700 py-2 px-4 rounded"
                            @click="closeDeleteModal"
                        >
                            Cancelar
                        </button>
                        <button
                            class="bg-red-500 text-white py-2 px-4 rounded"
                            @click="deleteTask"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <AddTask
            v-if="showAddTaskModal"
            @close="showAddTaskModal = false"
            @save="handleNewTask"
        />
    </div>
</template>

