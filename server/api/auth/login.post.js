import { AuthService } from '~/server/services/auth.js'

export default defineEventHandler(async (event) => {
  // Solo permitir POST
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Método no permitido'
    })
  }

  try {
    const body = await readBody(event)
    
    // Validar campos requeridos
    const { emailOrUsername, password } = body
    
    if (!emailOrUsername || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email/Username y contraseña son requeridos'
      })
    }

    // Intentar login
    const result = await AuthService.login(emailOrUsername, password)
    
    if (!result.success) {
      throw createError({
        statusCode: 401,
        statusMessage: result.message
      })
    }

    // Configurar cookie con el token
    setCookie(event, 'auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    return {
      success: true,
      message: result.message,
      user: result.user,
      token: result.token
    }

  } catch (error) {
    console.error('Error en login:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
