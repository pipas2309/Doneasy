/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import UsersController from '#controllers/users_controller'
import { middleware } from '#start/kernel'
import TasksController from "#controllers/tasks_controller";

router.post('/register', AuthController.prototype.register)
router.post('/login', AuthController.prototype.login)
router.post('/logout', AuthController.prototype.logout)

router
    .group(() => {
        router.get('/me', UsersController.prototype.me)
        router.put('/me', UsersController.prototype.update)
        router.put('/me/password', UsersController.prototype.changePassword)
    })
    .use(middleware.auth())

router
    .group(() => {
        router.put('/tasks/reorder', TasksController.prototype.reorder)
        router.resource('/tasks', TasksController).apiOnly()
    })
    .use(middleware.auth())

router.get('/health-check', async () => {
    return {
        healthCheck: 'Ok',
    }
})
