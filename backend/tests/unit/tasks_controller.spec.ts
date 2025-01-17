import { test } from '@japa/runner'
import Task from "#models/task";
import { HttpContext } from "@adonisjs/core/http";
import TasksController from "#controllers/tasks_controller";


test.group('TasksController (Unit)', () => {
    test('index => returns tasks sorted by sort_order', async ({ assert }) => {
        const fakeAuth = { user: { id: 999 } }
        let okPayload: any
        const fakeResponse = { ok: (data: any) => { okPayload = data } }

        const queryWhereSpy = {
            orderBy: async () => {
                return [
                    { id: 1, sortOrder: 10 },
                    { id: 2, sortOrder: 20 },
                ]
            },
        }
        const querySpy = {
            where: () => queryWhereSpy,
        }

        Task.query = () => querySpy as any

        const ctx = {
            auth: fakeAuth,
            response: fakeResponse,
        } as unknown as HttpContext

        const controller = new TasksController()
        await controller.index(ctx)

        assert.exists(okPayload)
        assert.equal(okPayload.length, 2)
        assert.equal(okPayload[0].id, 1)
    })

    test('index => unauthorized if no user', async ({ assert }) => {
        const fakeAuth = { user: null }
        let unauthorizedCalled = false
        const fakeResponse = {
            unauthorized: () => {
                unauthorizedCalled = true
            },
        }

        const ctx = {
            auth: fakeAuth,
            response: fakeResponse,
        } as unknown as HttpContext

        const controller = new TasksController()
        await controller.index(ctx)

        assert.isTrue(unauthorizedCalled)
    })

    test('store => creates a new task for user', async ({ assert }) => {
        const fakeRequest = {
            validateUsing: async () => ({
                title: 'Mock Title',
                sortOrder: 5,
            }),
        }
        let createdPayload: any
        const fakeResponse = {
            created: (data: any) => { createdPayload = data },
            unauthorized: () => {},
        }

        const fakeAuth = { user: { id: 777 } }

        Task.create = async (payload: any) => {
            return { ...payload, id: 123 }
        }

        const ctx = {
            request: fakeRequest,
            response: fakeResponse,
            auth: fakeAuth,
        } as unknown as HttpContext

        const controller = new TasksController()
        await controller.store(ctx)

        assert.exists(createdPayload)
        assert.equal(createdPayload.id, 123)
        assert.equal(createdPayload.title, 'Mock Title')
        assert.equal(createdPayload.sortOrder, 5)
    })
})
