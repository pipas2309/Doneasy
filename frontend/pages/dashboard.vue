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
    <!-- Envólucro geral -->
    <div>
        <!-- Título ou cabeçalho da página -->
        <header class="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 class="text-3xl font-bold">Dashboard</h1>
            <button
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
                @click="openAddTaskModal"
            >
                + Adicionar Tarefa
            </button>
        </header>

        <!-- Mensagem de erro -->
        <p v-if="errorMessage" class="text-red-500 mb-4">
            {{ errorMessage }}
        </p>

        <!-- Lista de tarefas -->
        <TaskList
            :tasks="tasks"
            :doReorder="doReorder"
            @taskClicked="onTaskClicked"
        />

        <!-- Modal de detalhes -->
        <transition name="fade">
            <div
                v-if="showDetailModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                @click.self="closeDetail"
            >
                <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
                    <!-- Título e ícone de cor -->
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">{{ selectedTask?.title }}</h2>

                        <!-- Botão cor -->
                        <div class="relative">
                            <div
                                :style="{ backgroundColor: selectedTask?.color }"
                                class="w-6 h-6 rounded-full border cursor-pointer"
                                @click="toggleColorPicker"
                            ></div>

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

                    <!-- Descrição da task -->
                    <p class="text-sm text-gray-700 mb-4">
                        {{ selectedTask?.description }}
                    </p>

                    <!-- Infos adicionais -->
                    <div class="text-xs text-gray-600 mb-4 space-x-2">
                        <span v-if="selectedTask?.priority">Prioridade: {{ selectedTask.priority }}</span>
                        <span v-if="selectedTask?.status">| Status: {{ selectedTask.status }}</span>
                        <span v-if="selectedTask?.estimatedEndAt">| Estimativa: {{ formatDate(selectedTask.estimatedEndAt) }}</span>
                    </div>

                    <!-- Ações -->
                    <div class="flex items-center gap-2">
                        <button
                            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
                            @click="goEditTask(selectedTask)"
                        >
                            Editar
                        </button>
                        <button
                            class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded transition"
                            @click="closeDetail"
                        >
                            Fechar
                        </button>
                        <button
                            class="ml-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center transition"
                            @click="confirmDeleteTask"
                        >
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Modal de confirmação de delete -->
        <transition name="fade">
            <div
                v-if="showDeleteModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                @click.self="closeDeleteModal"
            >
                <div class="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <h2 class="text-lg font-bold mb-4">Confirmar Exclusão</h2>
                    <p>Você tem certeza que deseja excluir esta tarefa?</p>
                    <div class="mt-4 flex justify-end gap-2">
                        <button
                            class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded transition"
                            @click="closeDeleteModal"
                        >
                            Cancelar
                        </button>
                        <button
                            class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
                            @click="deleteTask"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Modal de adicionar task -->
        <AddTask
            v-if="showAddTaskModal"
            @close="showAddTaskModal = false"
            @save="handleNewTask"
        />
    </div>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
</style>


