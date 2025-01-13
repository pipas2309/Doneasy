export default defineNuxtRouteMiddleware(async (to, _from) => {
    const { isLoggedIn, checkAuth } = useAuth()

    if (!isLoggedIn.value) {
        await checkAuth()
    }

    /**
     * Rotas exclusivas para usuários autenticados
     */
    const authenticatedRoutes = ['/dashboard', '/tasks', '/me']


    /**
     * Rotas proibidas usuários autenticados
     */
    const guestRoutes = ['/login', '/register']

    console.log('middleware')
    if (authenticatedRoutes.includes(to.path) && !isLoggedIn.value) {
        return navigateTo('/login')
    }

    if (guestRoutes.includes(to.path) && isLoggedIn.value) {
        return navigateTo('/dashboard')
    }
})
