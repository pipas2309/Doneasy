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

router.get('/', async () => {
    return {
        healthCheck: 'Ok',
    }
})
