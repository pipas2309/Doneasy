// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_APP_API_URL || 'http://localhost:3333',
        },
    },
    css: ['~/assets/css/tailwind.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    router: {
        middlewares: ['auth.global']
    }
})
