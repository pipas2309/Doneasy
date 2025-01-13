<script setup lang="ts">
const props = defineProps<{ task: any }>()
const emit = defineEmits(['clicked'])

const taskColor = computed(() => {
    const baseColor = props.task.color || '#3498db'
    return `${baseColor}33`
})

function onClick() {
    emit('clicked')
}
</script>

<template>
    <div
        class="bg-white p-3 border rounded shadow cursor-pointer hover:bg-gray-100"
        @click="onClick"
        :style=" { backgroundColor: taskColor } "
    >
        <div class="font-bold text-lg">
            {{ task.title }}
        </div>
        <div v-if="task.priority" class="text-sm text-gray-700">
            Prioridade: {{ task.priority }}
        </div>
        <div v-if="task.estimatedEndAt" class="text-sm text-gray-700">
            Estimativa: {{ formatDate(task.estimatedEndAt) }}
        </div>
    </div>
</template>

<script lang="ts">
function formatDate(dateString?: string) {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
}
export default { formatDate }
</script>

<style scoped>
</style>
