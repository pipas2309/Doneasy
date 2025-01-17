import { test } from '@japa/runner'
import Database from "@adonisjs/lucid/services/db"

let sessionCookie = ''

test.group('Tasks Controller', (group) => {
    group.setup(async () => {
        await Database.beginGlobalTransaction()
    })

    group.teardown(async () => {
        await Database.rollbackGlobalTransaction()
    })

    test('it should list tasks for the user', async ({ client, assert }) => {
        const registerResponse = await client.post('/register').json({
            email: 'tester@user.com',
            username: 'testUser',
            password: 'Test123#',
        })
        sessionCookie = registerResponse.headers()['set-cookie']

        const response = await client.get('/tasks').headers({ Cookie: sessionCookie })

        response.assertStatus(200)
        assert.isArray(response.body())
    })

    test('it should create a new task', async ({ client, assert }) => {
        const response = await client.post('/tasks').headers({ Cookie: sessionCookie }).json({
            title: 'My First Task',
            description: 'This is my first task',
            priority: 'High',
        })

        response.assertStatus(201)
        assert.property(response.body(), 'id')
    })

    test('it should update an existing task', async ({ client, assert }) => {
        const taskResponse = await client.post('/tasks').headers({ Cookie: sessionCookie }).json({
            title: 'My Task',
        })

        const response = await client.put(`/tasks/${taskResponse.body().id}`).headers({ Cookie: sessionCookie }).json({
            title: 'Updated Task',
            priority: 'Low',
        })

        response.assertStatus(200)
        assert.equal(response.body().title, 'Updated Task')
        assert.equal(response.body().priority, 'Low')
    })

    test('it should delete a task', async ({ client }) => {
        const taskResponse = await client.post('/tasks').headers({ Cookie: sessionCookie }).json({
            title: 'Task to delete',
        })

        const response = await client.delete(`/tasks/${taskResponse.body().id}`).headers({ Cookie: sessionCookie })

        response.assertStatus(200)
        response.assertBodyContains({ message: 'Task deletada' })
    })

    test('it should reorder tasks', async ({ client }) => {
        const task1 = await client.post('/tasks').headers({ Cookie: sessionCookie }).json({
            title: 'Task 1',
            sortOrder: 1,
        })
        const task2 = await client.post('/tasks').headers({ Cookie: sessionCookie }).json({
            title: 'Task 2',
            sortOrder: 2,
        })

        const response = await client.put('/tasks/reorder').headers({ Cookie: sessionCookie }).json({
            tasks: [
                { id: task1.body().id, sortOrder: 2 },
                { id: task2.body().id, sortOrder: 1 },
            ],
        })

        response.assertStatus(200)
        response.assertBodyContains({ message: 'Tarefas reordenadas com sucesso' })
    })

    test('it should not access tasks without authentication', async ({ client }) => {
        const response = await client.get('/tasks')

        response.assertStatus(401)
        response.assertBodyContains({ errors: [{ message: "Unauthorized access" }] })
    })
})
