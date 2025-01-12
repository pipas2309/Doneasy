import vine from '@vinejs/vine'

export const updateTaskValidator = vine.compile(
    vine.object({
        title: vine.string().optional(),
        description: vine.string().nullable().optional(),
        priority: vine.string().nullable().optional(),
        status: vine.string().nullable().optional(),
        color: vine.string().nullable().optional(),
        estimatedEndAt: vine.string().nullable().optional(),
        startAt: vine.string().nullable().optional(),
        endAt: vine.string().nullable().optional(),
        sortOrder: vine.number().optional(),
    })
)
