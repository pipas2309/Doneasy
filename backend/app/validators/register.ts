import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { uniqueRule } from '#rules/unique'
import { cpfRule } from '#rules/cpf'

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{4,}$/

export const registerValidator = vine.compile(
    vine.object({
        email: vine
            .string()
            .email()
            .normalizeEmail()
            .optional()
            .requiredIfMissing('username')
            .use(uniqueRule({ table: 'users', column: 'email' })),

        username: vine
            .string()
            .minLength(3)
            .maxLength(24)
            .optional()
            .requiredIfMissing('email')
            .use(uniqueRule({ table: 'users', column: 'username' })),

        password: vine.string().minLength(8).maxLength(32).regex(passwordRegex),

        cpf: vine
            .string()
            .minLength(11)
            .maxLength(14)
            .optional()
            .use(cpfRule())
            .use(uniqueRule({ table: 'users', column: 'cpf' })),

        fullName: vine.string().maxLength(254).optional(),
    })
)

const messages = {
    'email.email': 'Informe um e-mail válido.',
    'username.minLength': 'O username deve ter pelo menos 3 dígitos.',
    'username.maxLength': 'O username deve ter no máximo 24 dígitos.',
    'password.regex':
        'A senha deve ao menos uma letra maiúscula, minúscula, número e caractere especial ($ * & @ #).',
    'password.minLength': 'A senha deve ter pelo menos 8 dígitos.',
    'password.maxLength': 'A senha deve ter no máximo 32 dígitos.',
    'cpf.minLength': 'O CPF fornecido é inválido.',
    'cpf.maxLength': 'O CPF fornecido é inválido.',
    'fullName.maxLength': 'Calma lá, Dom Pedro. Abrevie seu nome para caber em 254 caracteres!',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)
