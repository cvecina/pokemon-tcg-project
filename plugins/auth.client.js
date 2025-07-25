export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Solo en el cliente
  if (process.client) {
    // Inicializar autenticación desde localStorage
    authStore.initializeAuth()
    
    // Verificar el token si existe
    if (authStore.token) {
      await authStore.fetchProfile()
    }
  }
})
