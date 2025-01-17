import { test } from '@japa/runner'
import UsersController from "#controllers/users_controller";
import { HttpContext } from "@adonisjs/core/http";

test.group('UsersController (Unit)', () => {
    test('update => updates user email, etc.', async ({ assert }) => {
        const fakeRequest = {
            validateUsing: async () => ({
                email: 'new@email.com',
                username: 'newUser',
            }),
        }

        let okPayload: any
        const fakeResponse = {
            ok: (data: any) => { okPayload = data },
            unauthorized: () => {},
        }

        const user = {
            id: 999,
            email: 'old@email.com',
            username: 'oldUser',
            cpf: null,
            fullName: null,
            save: async function () {},
        }

        const ctx = {
            auth: { user },
            request: fakeRequest,
            response: fakeResponse,
        } as unknown as HttpContext

        const controller = new UsersController()
        await controller.update(ctx)

        assert.equal(user.email, 'new@email.com')
        assert.equal(user.username, 'newUser')
        assert.exists(okPayload)
        assert.equal(okPayload.user.id, 999)
        assert.equal(okPayload.user.email, 'new@email.com')
    })
})
