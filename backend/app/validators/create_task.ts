import vine from '@vinejs/vine'

export const createTaskValidator = vine.compile(
    vine.object({
        title: vine.string(),
        description: vine.string().optional(),
        priority: vine.string().optional(),
        status: vine.string().optional(),
        color: vine.string().optional(),
        estimatedEndAt: vine.string().optional(),
        startAt: vine.string().optional(),
        endAt: vine.string().optional(),
        sortOrder: vine.number().optional(),
    })
)
