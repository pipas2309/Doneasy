import { HttpContext } from "@adonisjs/core/http";
import { createTaskValidator } from "#validators/create_task";
import Task from "#models/task";
import { updateTaskValidator } from "#validators/update_task";
import { reorderTaskValidator } from "#validators/reorder_task";
import { DateTime } from "luxon";

export default class TasksController {
    /**
     * Listar tarefas do user logado
     */
    public async index({ auth, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Não autenticado' })
        }

        const tasks = await Task.query()
            .where('user_id', user.id)
            .orderBy('sort_order', 'asc')

        return response.ok(tasks)
    }

    /**
     * Criar nova task
     */
    public async store({ auth, request, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Não autenticado' })
        }

        const payload = await request.validateUsing(createTaskValidator)

        const task = await Task.create({
            userId: user.id,
            title: payload.title,
            description: payload.description || null,
            priority: payload.priority || null,
            status: payload.status || null,
            color: payload.color || null,
            sortOrder: payload.sortOrder ?? 0,
        })

        return response.created(task)
    }

    /**
     * Mostrar detalhes de uma task
     */
    public async show({ auth, params, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Não autenticado' })
        }

        const task = await Task.query()
            .where('id', params.id)
            .andWhere('user_id', user.id)
            .firstOrFail()

        return response.ok(task)
    }

    /**
     * Atualizar task
     */
    public async update({ auth, params, request, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Não autenticado' })
        }

        const task = await Task.query()
            .where('id', params.id)
            .where('user_id', user.id)
            .firstOrFail()

        const payload = await request.validateUsing(updateTaskValidator)

        if (payload.title !== undefined) task.title = payload.title
        if (payload.description !== undefined) task.description = payload.description
        if (payload.priority !== undefined) task.priority = payload.priority
        if (payload.status !== undefined) task.status = payload.status
        if (payload.color !== undefined) task.color = payload.color
        if (payload.sortOrder !== undefined) task.sortOrder = payload.sortOrder
        if (payload.estimatedEndAt !== undefined) {
          task.estimatedEndAt = payload.estimatedEndAt ? DateTime.fromISO(payload.estimatedEndAt) : null
        }
        if (payload.startAt !== undefined) {
            task.startAt = payload.startAt ? DateTime.fromISO(payload.startAt) : null
        }
        if (payload.endAt !== undefined) {
            task.endAt = payload.endAt ? DateTime.fromISO(payload.endAt) : null
        }

        await task.save()

        return response.ok(task)
    }

    /**
     * Deletar task
     */
    public async destroy({ auth, params, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Não autenticado' })
        }

        const task = await Task.query()
            .where('id', params.id)
            .where('user_id', user.id)
            .firstOrFail()

        await task.delete()
        return response.ok({ message: 'Task deletada' })
    }

    /**
     * Reordenar tasks
     * Array de { id, sortOrder }
     */
    public async reorder({ auth, request, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Não autenticado' })
        }

        const { tasks } = await request.validateUsing(reorderTaskValidator) // array

        // Atualiza sortOrder de cada task (apenas as que pertencem ao user)
        for (const t of tasks) {
            const task = await Task.query()
                .where('id', t.id)
                .where('user_id', user.id)
                .first()
            if (task) {
                task.sortOrder = t.sortOrder
                await task.save()
            }
        }

        return response.ok({ message: 'Tarefas reordenadas com sucesso' })
    }
}
