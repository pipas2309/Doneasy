<script setup lang="ts">
import draggable from 'vuedraggable'
import TaskItem from './TaskItem.vue'

const props = defineProps<{
    tasks: Array<any>,
    doReorder: (newOrder: Array<any>) => Promise<void>
}>()

const localTasks = ref([...props.tasks])
const emit = defineEmits(['taskClicked'])

watch(
    () => props.tasks,
    (newVal) => {
        localTasks.value = [...newVal]
    }
)

async function onUpdate() {
    const newOrder = localTasks.value.map((t, index) => ({
        ...t,
        sortOrder: index + 1,
    }))
    await props.doReorder(newOrder)
}

function handleTaskClick(task: any) {
    console.log(task)
    emit('taskClicked', task)
}
</script>

<template>
    <draggable
        v-model="localTasks"
        @update="onUpdate"
        item-key="id"
        class="space-y-2"
    >
        <template #item="{ element }">
            <TaskItem :task="element" @clicked="handleTaskClick(element)"/>
        </template>
    </draggable>
</template>

<style scoped>
</style>
