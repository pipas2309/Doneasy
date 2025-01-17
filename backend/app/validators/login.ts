import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
    'username.required': 'O campo de usuário é obrigatório.',
    'password.required': 'O campo da senha é obrigatório.',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const loginValidator = vine.compile(
    vine.object({
        username: vine.string().optional().requiredIfMissing('email'),
        email: vine.string().email().normalizeEmail().optional().requiredIfMissing('username'),
        isRememberMe: vine.boolean(),
        password: vine.string(),
    })
)
