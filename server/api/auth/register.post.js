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
    
    console.log('Body recibido en register:', body)
    
    // Validar campos requeridos
    const { email, username, password, confirmPassword } = body
    
    if (!email || !username || !password || !confirmPassword) {
      console.log('Campos faltantes:', { email: !!email, username: !!username, password: !!password, confirmPassword: !!confirmPassword })
      throw createError({
        statusCode: 400,
        statusMessage: 'Todos los campos son requeridos'
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de email inválido'
      })
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Las contraseñas no coinciden'
      })
    }

    // Validar username
    if (username.length < 3) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El username debe tener al menos 3 caracteres'
      })
    }

        // Registrar usuario usando el servicio
    console.log('Llamando AuthService.register con:', { email, username, password: '***' })
    const result = await AuthService.register(email, username, password)
    
    console.log('Resultado del AuthService:', result)
    
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
    console.error('Error en registro:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
