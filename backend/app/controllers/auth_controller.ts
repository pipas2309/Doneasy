import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'

/**
 * Controller para lidar com registro, login, logout etc.
 */
export default class AuthController {
    /**
     * Registra um usuário
     */
    public async register({ request, response, auth }: HttpContext) {
        // 1. Valida payload (username/email, password, cpf etc.)
        const payload = await request.validateUsing(registerValidator)

        // 2. Cria usuário
        const user = await User.create(payload)

        // 3. (Opcional) já loga
        await auth.use('web').login(user)

        return response.created({
            message: 'Usuário registrado com sucesso',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        })
    }

    /**
     * Faz login
     */
    public async login({ request, response, auth }: HttpContext) {
        // Exemplo usando "username" e "password" no validator
        const { username, email, password, isRememberMe } = await request.validateUsing(loginValidator)

        // Busca user via username (ou email, se for esse seu caso)
        const user = await User.findBy('username', username || email)
        if (!user) {
            return response.unauthorized({ message: 'Credenciais inválidas' })
        }

        // Verifica senha (graças ao mixin withAuthFinder)
        const passwordOk = await user.verifyPassword(password)
        if (!passwordOk) {
            return response.unauthorized({ message: 'Credenciais inválidas' })
        }

        // Faz login
        await auth.use('web').login(user, isRememberMe)
        // Se quiser "remember me": await auth.use('web').login(user, true)

        return response.ok({
            message: 'Login realizado',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        })
    }

    /**
     * Faz logout (apaga sessão)
     */
    public async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout()

        return response.ok({
            message: 'Usuário deslogado',
        })
    }
}
