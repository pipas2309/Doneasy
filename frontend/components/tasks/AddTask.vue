<script setup lang="ts">
import { ref } from 'vue'
const taskTitle = ref('')
const taskDescription = ref('')
const priority = ref('')
const estimate = ref('')
const emit = defineEmits(['close', 'save'])
const availableColors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#34495e']
const selectedColor = ref(availableColors[0]) // Cor padrão

function selectColor(color: string) {
    selectedColor.value = color
}

function saveTask() {
    if (!taskTitle.value.trim()) return
    const newTask = {
        title: taskTitle.value,
        description: taskDescription.value,
        priority: priority.value,
        color: selectedColor.value,
        estimate: estimate.value,
        sortOrder: 0,
    }
    emit('save', newTask)
    resetForm()
}

function resetForm() {
    taskTitle.value = ''
    taskDescription.value = ''
    priority.value = ''
    estimate.value = ''
}

</script>

<template>
    <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow-md max-w-md w-full">
            <h2 class="text-xl font-bold mb-4">Adicionar Nova Tarefa</h2>

            <form @submit.prevent="saveTask" class="space-y-4">
                <div>
                    <label class="block font-medium">Título</label>
                    <input
                        v-model="taskTitle"
                        type="text"
                        class="border w-full p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label class="block font-medium">Descrição</label>
                    <textarea
                        v-model="taskDescription"
                        class="border w-full p-2 rounded"
                    ></textarea>
                </div>

                <div>
                    <label class="block font-medium">Prioridade</label>
                    <select v-model="priority" class="border w-full p-2 rounded">
                        <option value="Alta">Alta</option>
                        <option value="Média">Média</option>
                        <option value="Baixa">Baixa</option>
                    </select>
                </div>

                <label class="block mb-2 font-bold">Escolha a cor</label>
                <div class="flex gap-2 mb-4">
                    <div
                        v-for="color in availableColors"
                        :key="color"
                        :style="{ backgroundColor: color }"
                        class="w-8 h-8 rounded-full cursor-pointer border-2"
                        :class="{ 'border-black': selectedColor === color, 'border-transparent': selectedColor !== color }"
                        @click="selectColor(color)"
                    ></div>
                </div>

                <div>
                    <label class="block font-medium">Estimativa de Término</label>
                    <input
                        v-model="estimate"
                        type="date"
                        class="border w-full p-2 rounded"
                    />
                </div>

                <div class="flex justify-end gap-2">
                    <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="$emit('close')">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.modal {
    /* Estilo do modal */
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: auto;
}
.input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
