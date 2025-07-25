export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isModerator = computed(() => ['ADMIN', 'MODERATOR'].includes(user.value?.role))

  // Acciones
  async function login(emailOrUsername, password) {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          emailOrUsername,
          password
        }
      })

      if (response.success) {
        user.value = response.user
        token.value = response.token
        
        console.log('Login exitoso, guardando en localStorage:', response.user.username)
        
        // Guardar en localStorage para persistencia
        if (import.meta.client) {
          localStorage.setItem('auth-user', JSON.stringify(response.user))
          localStorage.setItem('auth-token', response.token)
          console.log('Datos guardados en localStorage')
        }

        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        message: error.statusMessage || error.data?.message || error.message || 'Error de conexión'
      }
    }
  }

  async function register(email, username, password, confirmPassword) {
    try {
      console.log('Enviando registro:', { email, username, password: '***' })
      
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          email,
          username,
          password,
          confirmPassword
        }
      })

      console.log('Respuesta del servidor:', response)

      if (response.success) {
        user.value = response.user
        token.value = response.token
        
        // Guardar en localStorage para persistencia
        if (import.meta.client) {
          localStorage.setItem('auth-user', JSON.stringify(response.user))
          localStorage.setItem('auth-token', response.token)
        }

        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (error) {
      console.error('Error completo en registro:', error)
      console.error('Error data:', error.data)
      console.error('Error status:', error.statusCode)
      console.error('Error message:', error.statusMessage)
      
      return {
        success: false,
        message: error.statusMessage || error.data?.message || error.message || 'Error de conexión'
      }
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      // Limpiar estado independientemente del resultado
      user.value = null
      token.value = null
      
      if (import.meta.client) {
        localStorage.removeItem('auth-user')
        localStorage.removeItem('auth-token')
      }
    }
  }

  async function fetchProfile() {
    try {
      if (!token.value) return false

      const response = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      if (response.success) {
        user.value = response.user
        return true
      }

      return false
    } catch (error) {
      console.error('Error obteniendo perfil:', error)
      // Si el token es inválido, hacer logout
      await logout()
      return false
    }
  }

  function initializeAuth() {
    if (import.meta.client) {
      const savedUser = localStorage.getItem('auth-user')
      const savedToken = localStorage.getItem('auth-token')
      
      console.log('Inicializando auth desde localStorage:', { 
        hasUser: !!savedUser, 
        hasToken: !!savedToken 
      })
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser)
          user.value = parsedUser
          token.value = savedToken
          
          console.log('Usuario restaurado:', parsedUser.username)
          
          // Verificar que el token siga siendo válido
          // No await aquí para no bloquear la inicialización
          fetchProfile().catch(err => {
            console.warn('Token expirado o inválido:', err)
          })
        } catch (error) {
          console.error('Error inicializando auth:', error)
          logout()
        }
      }
    }
  }

  // Middleware de autenticación
  function requireAuth() {
    if (!isAuthenticated.value) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
      })
    }
    return user.value
  }

  function requireRole(role) {
    const currentUser = requireAuth()
    
    if (currentUser.role !== role && currentUser.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Permisos insuficientes'
      })
    }
    
    return currentUser
  }

  return {
    // Estado
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isAdmin,
    isModerator,
    
    // Acciones
    login,
    register,
    logout,
    fetchProfile,
    initializeAuth,
    requireAuth,
    requireRole
  }
})
