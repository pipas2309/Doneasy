import { test } from '@japa/runner'
import User from "#models/user";
import { HttpContext } from "@adonisjs/core/http";
import AuthController from "#controllers/auth_controller";


test.group('AuthController (Unit)', () => {
    test('register user successfully', async ({ assert }) => {
        const fakeRequest = {
            validateUsing: async () => ({
                username: 'mock_user',
                password: 'MockPass#1',
                email: null,
            }),
        }

        let createdPayload: any
        const fakeResponse = {
            created: (data: any) => {
                createdPayload = data
            },
        }

        const fakeAuth = {
            use: () => ({
                login: async () => {},
            }),
        }

        // @ts-ignore
        const userCreateSpy = (User.create = async (payload: any) => {
            return {
                id: 123,
                email: payload.email,
                username: payload.username,
            }
        })

        const ctx = {
            request: fakeRequest,
            response: fakeResponse,
            auth: fakeAuth,
        } as unknown as HttpContext

        const controller = new AuthController()
        await controller.register(ctx)

        assert.equal(typeof userCreateSpy, 'function')
        assert.exists(createdPayload)
        assert.equal(createdPayload.message, 'Usuário registrado com sucesso')
        assert.equal(createdPayload.user.username, 'mock_user')
        assert.equal(createdPayload.user.id, 123)
    })

    test('login user - ok', async ({ assert }) => {
        const fakeRequest = {
            validateUsing: async () => ({
                username: 'mock_user',
                password: 'MockPass#1',
                isRememberMe: true,
            }),
        }

        let okPayload: any
        const fakeResponse = {
            ok: (data: any) => {
                okPayload = data
            },
            unauthorized: () => {},
        }

        const fakeAuth = {
            use: () => ({
                login: async (_user: any, rememberMe: boolean) => {
                    console.log('login called with rememberMe', rememberMe)
                },
            }),
        }

        // @ts-ignore
        User.findBy = async (key: string, value: string) => {
            if (key === 'username' && value === 'mock_user') {
                return {
                    id: 456,
                    username: 'mock_user',
                    email: 'mock@user.com',
                    verifyPassword: async (pass: string) => pass === 'MockPass#1',
                }
            }
            return null
        }

        const ctx = {
            request: fakeRequest,
            response: fakeResponse,
            auth: fakeAuth,
        } as unknown as HttpContext

        const controller = new AuthController()
        await controller.login(ctx)

        assert.exists(okPayload)
        assert.equal(okPayload.message, 'Login realizado')
        assert.equal(okPayload.user.id, 456)
        assert.equal(okPayload.user.username, 'mock_user')
        assert.equal(okPayload.user.email, 'mock@user.com')
    })

    test('login user - user not found', async ({ assert }) => {
        let unauthorizedCalled = false

        const fakeRequest = {
            validateUsing: async () => ({
                username: 'unknown_user',
                password: 'Anything',
            }),
        }
        const fakeResponse = {
            ok: () => {},
            unauthorized: () => {
                unauthorizedCalled = true
            },
        }
        const fakeAuth = { use: () => ({}) }

        User.findBy = async () => null

        const ctx = {
            request: fakeRequest,
            response: fakeResponse,
            auth: fakeAuth,
        } as unknown as HttpContext

        const controller = new AuthController()
        await controller.login(ctx)

        assert.isTrue(unauthorizedCalled)
    })
})
