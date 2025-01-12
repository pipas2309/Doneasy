import type { HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '#validators/update_user'

export default class UsersController {
    /**
     * Atualiza dados do user (email, username, cpf, fullName etc.)
     */
    public async update({ auth, request, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Não autenticado' })
        }

        const payload = await request.validateUsing(updateUserValidator)

        // Ajusta campos no model
        user.email = payload.email ?? user.email
        user.username = payload.username ?? user.username
        user.cpf = payload.cpf?.replace(/\D/g, '') ?? user.cpf
        user.fullName = payload.fullName ?? user.fullName
        // Salva
        await user.save()

        return response.ok({
            message: 'Perfil atualizado',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                cpf: user.cpf,
            },
        })
    }
    /**
     * Exemplo de endpoint para exibir dados do user logado
     */
    public async me({ auth, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Não autenticado' })
        }
        return response.ok({
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            cpf: user.cpf,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
    }

    /**
     * Trocando senha: exige oldPassword, newPassword
     */
    public async changePassword({ auth, request, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Não autenticado' })
        }

        const { oldPassword, newPassword } = await request.validateUsing(updateUserValidator)
        // Verifica se oldPassword confere
        const matches = await user.verifyPassword(oldPassword)
        if (!matches) {
            return response.unauthorized({ message: 'Senha antiga inválida' })
        }

        user.password = newPassword
        await user.save()

        return response.ok({ message: 'Senha alterada com sucesso' })
    }
}
