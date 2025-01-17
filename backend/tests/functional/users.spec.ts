import { test } from '@japa/runner'
import Database from "@adonisjs/lucid/services/db";

let sessionCookie = ''

test.group('Users Controller', (group) => {
    group.setup(async () => {
        await Database.beginGlobalTransaction()
    })

    group.teardown(async () => {
        await Database.rollbackGlobalTransaction()
    })

    test('setup: register & login user', async ({ client }) => {
        await client.post('/register').json({
            email: 'tester@user.com',
            username: 'testUser',
            password: 'Test123#',
        })

        const loginResp = await client.post('/login').json({
            username: 'testUser',
            password: 'Test123#',
            isRememberMe: false,
        })

        sessionCookie = loginResp.headers()['set-cookie']

        loginResp.assertStatus(200)
    })

    test('it should show me (profile) info', async ({ client, assert }) => {
        const resp = await client.get('/me').headers({ Cookie: sessionCookie }).dump()
        resp.assertStatus(200)
        assert.equal(resp.body().username, 'testUser')
        assert.equal(resp.body().email, 'tester@user.com')
    })

    test('it should fail to get profile info without authentication', async ({ client }) => {
        const resp = await client.get('/me')
        resp.assertStatus(401)
        resp.assertBodyContains({ errors: [{message: "Unauthorized access"}] })
    })

    test('it should update user info', async ({ client, assert }) => {
        const resp = await client
            .put('/me')
            .headers({ Cookie: sessionCookie })
            .json({
                email: 'updated@user.com',
                username: 'updatedUser',
                cpf: '123.456.789-09',
                fullName: 'Updated User',
            })

        resp.assertStatus(200)
        assert.equal(resp.body().user.username, 'updatedUser')
        assert.equal(resp.body().user.email, 'updated@user.com')
        assert.equal(resp.body().user.cpf, '12345678909')
        assert.equal(resp.body().user.fullName, 'Updated User')
    })

    test('it should fail to update user info with invalid CPF', async ({ client }) => {
        const fewDigits = await client
            .put('/me')
            .headers({ Cookie: sessionCookie })
            .json({
                cpf: '12345678',
            })
        const wrongCPF = await client
            .put('/me')
            .headers({ Cookie: sessionCookie })
            .json({
                cpf: '11223344555',
            })

        fewDigits.assertStatus(422)
        wrongCPF.assertStatus(422)
        fewDigits.assertBodyContains({ errors: [{ field: 'cpf', message: 'Um CPF válido tem 11 dígitos.' }] })
        wrongCPF.assertBodyContains({ errors: [{ field: 'cpf', message: 'O CPF fornecido é inválido.' }] })
    })

    test('it should fail to update user info with already used email', async ({ client }) => {
        await client.post('/register').json({
            email: 'existing@user.com',
            username: 'existingUser',
            password: 'Test123#',
        })

        const resp = await client
            .put('/me')
            .headers({ Cookie: sessionCookie })
            .json({
                email: 'existing@user.com',
            })

        resp.assertStatus(422)
        resp.assertBodyContains({ errors: [{ field: 'email', message: 'Este email já está em uso.' }] })
    })

    test('it should change password with oldPassword + newPassword', async ({ client }) => {
        const resp = await client
            .put('/me/password')
            .headers({ Cookie: sessionCookie })
            .json({
                oldPassword: 'Test123#',
                newPassword: 'NewPass123#',
            })

        resp.assertStatus(200)
        resp.assertBodyContains({ message: 'Senha alterada com sucesso' })
    })

    test('it should fail changing password with wrong oldPassword', async ({ client }) => {
        const resp = await client
            .put('/me/password')
            .headers({ Cookie: sessionCookie })
            .json({
                oldPassword: 'WrongPass123#',
                newPassword: 'NewPass123#',
            })

        resp.assertStatus(401)
        resp.assertBodyContains({ message: 'Senha antiga inválida' })
    })

    test('it should fail changing password with invalid newPassword format', async ({ client }) => {
        const shortPass = await client
            .put('/me/password')
            .headers({ Cookie: sessionCookie })
            .json({
                oldPassword: 'Test123#',
                newPassword: 'short',
            })
        const bigPass = await client
            .put('/me/password')
            .headers({ Cookie: sessionCookie })
            .json({
                oldPassword: 'Test123#',
                newPassword: 'shortOrMaybeNot!ButIMLong-windedMan#Gratitude',
            })
        const wrongPass = await client
            .put('/me/password')
            .headers({ Cookie: sessionCookie })
            .json({
                oldPassword: 'Test123#',
                newPassword: 'newpass123',
            })

        shortPass.assertStatus(422)
        bigPass.assertStatus(422)
        wrongPass.assertStatus(422)
        shortPass.assertBodyContains({ errors: [{ field: 'newPassword', message: 'A nova senha precisa de pelo menos 8 dígitos.' }] })
        bigPass.assertBodyContains({ errors: [{ field: 'newPassword', message: 'A nova senha precisa, no máximo, de 32 dígitos.' }] })
        wrongPass.assertBodyContains({ errors: [{ field: 'newPassword', message: 'A nova senha precisa de maiúscula, minúscula, número e especial.' }] })
    })

    test('it should fail changing password without authentication', async ({ client }) => {
        const resp = await client.put('/me/password').json({
            oldPassword: 'Test123#',
            newPassword: 'NewPass123!',
        })

        resp.assertStatus(401)
        resp.assertBodyContains({ errors: [{ message: 'Unauthorized access' }] })
    })
})
