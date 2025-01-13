const isLoggedIn = ref(false)
const userInfo = ref<any>(null)

export function useAuth() {
    const config = useRuntimeConfig()

    async function checkAuth() {
        try {
            userInfo.value = await $fetch('/me', {
                baseURL: config.public.apiBase,
                credentials: 'include',
            })
            isLoggedIn.value = true
        } catch (err) {
            userInfo.value = null
            isLoggedIn.value = false
        }
    }

    async function logout() {
        try {
            await $fetch('/logout', {
                baseURL: config.public.apiBase,
                method: 'POST',
                credentials: 'include',
            })
            userInfo.value = null
            isLoggedIn.value = false
        } catch (e) {
            console.error('Erro ao deslogar', e)
        }
    }

    return {
        isLoggedIn,
        userInfo,
        checkAuth,
        logout,
    }
}
