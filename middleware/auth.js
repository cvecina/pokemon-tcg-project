export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Si no está autenticado, redirigir a login
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth')
  }
})
