import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { uniqueRule } from '#rules/unique'
import { cpfRule } from '#rules/cpf'

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{4,}$/
const messages = {
    'email.email': 'Informe um e-mail válido.',
    'username.minLength': 'O username deve ter pelo menos 3 caracteres.',
    'username.maxLength': 'O username deve ter no máximo 24 caracteres.',
    'newPassword.regex': 'A nova senha precisa de maiúscula, minúscula, número e especial.',
    'newPassword.minLength': 'A nova senha precisa de pelo menos 8 dígitos.',
    'newPassword.maxLength': 'A nova senha precisa, no máximo, de 32 dígitos.',
    'cpf.minLength': 'Um CPF válido tem 11 dígitos.',
    'cpf.maxLength': 'Um CPF válido tem 11 dígitos.',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const updateUserValidator = vine.compile(
    vine.object({
        email: vine
            .string()
            .email()
            .normalizeEmail()
            .optional()
            .use(uniqueRule({ table: 'users', column: 'email' })),

        username: vine
            .string()
            .minLength(3)
            .maxLength(24)
            .optional()
            .use(uniqueRule({ table: 'users', column: 'username' })),

        fullName: vine.string().maxLength(254).optional(),

        cpf: vine
            .string()
            .minLength(11)
            .maxLength(14)
            .optional()
            .use(cpfRule())
            .use(uniqueRule({ table: 'users', column: 'cpf' })),

        oldPassword: vine.string()
            .optional()
            .requiredIfExists('newPassword'),

        newPassword: vine.string()
            .minLength(8)
            .maxLength(32)
            .regex(passwordRegex)
            .optional()
            .requiredIfExists('oldPassword'),
    })
)
