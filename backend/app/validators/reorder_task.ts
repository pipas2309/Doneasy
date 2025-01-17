import vine, {SimpleMessagesProvider} from '@vinejs/vine'

const messages = {
    'array': 'Envie no formato de um array de objetos: \'tasks: [{id:#, sortOrder:#}]\'',
    'id.number': 'O id da tarefa é obrigatório.',
    'sortOrder.number': 'A posição da tarefa é obrigatório.',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const reorderTaskValidator = vine.compile(
    vine.object({
        tasks: vine.array(
            vine.object({
                id: vine.number(),
                sortOrder: vine.number(),
            })
        )
    })
)
