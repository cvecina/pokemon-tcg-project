export default defineEventHandler(async (event) => {
  // Solo permitir POST
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Método no permitido'
    })
  }

  try {
    // Eliminar cookie
    deleteCookie(event, 'auth-token')

    return {
      success: true,
      message: 'Logout exitoso'
    }

  } catch (error) {
    console.error('Error en logout:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
