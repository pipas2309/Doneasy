import { test } from '@japa/runner'
import Database from "@adonisjs/lucid/services/db"

let sessionCookie = ''

test.group('Auth Controller', (group) => {
    group.setup(async () => {
        await Database.beginGlobalTransaction()
    })

    group.teardown(async () => {
        await Database.rollbackGlobalTransaction()
    })

    test('it should register a user', async ({ client, assert }) => {
        const response = await client.post('/register').json({
            email: 'tester@user.com',
            username: 'testUser',
            password: 'Test123#',
        })

        response.assertStatus(201)
        assert.equal(response.body().message, 'Usuário registrado com sucesso')
        assert.property(response.body(), 'user')
    })

    test('it should not register a user with existing email', async ({ client }) => {
        const response = await client.post('/register').json({
            email: 'tester@user.com',
            username: 'newUser',
            password: 'Test123#',
        })

        response.assertStatus(422)
        response.assertBodyContains({ errors: [{ field: 'email', message: 'Este email já está em uso.' }] })
    })

    test('it should login a user', async ({ client }) => {
        const response = await client.post('/login').json({
            username: 'testUser',
            password: 'Test123#',
            isRememberMe: false,
        })

        sessionCookie = response.headers()['set-cookie']
        response.assertStatus(200)
        response.assertBodyContains({ message: 'Login realizado' })
    })

    test('it should not login a user with incorrect password', async ({ client }) => {
        const response = await client.post('/login').json({
            username: 'testUser',
            password: 'WrongPass123#',
            isRememberMe: false,
        })

        response.assertStatus(401)
        response.assertBodyContains({ message: 'Credenciais inválidas' })
    })

    test('it should logout a user', async ({ client }) => {
        const response = await client.post('/logout').headers({ Cookie: sessionCookie })

        response.assertStatus(200)
        response.assertBodyContains({ message: 'Usuário deslogado' })
    })
})
