import { AuthService } from '~/server/services/auth.js'

export default defineEventHandler(async (event) => {
  // Solo permitir GET
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Método no permitido'
    })
  }

  try {
    // Verificar autenticación
    const user = await AuthService.requireAuth(event)
    
    // Obtener perfil completo
    const profile = await AuthService.getUserProfile(user.id)
    
    if (!profile.success) {
      throw createError({
        statusCode: 404,
        statusMessage: profile.message
      })
    }

    return {
      success: true,
      user: profile.user
    }

  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
