import { AuthService } from '~/server/services/auth.js'
import { CardService } from '~/server/services/cards.js'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación
    const user = await AuthService.requireAuth(event)
    
    const body = await readBody(event)
    
    // Validar campos requeridos
    if (!body.name || !body.supertype) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nombre y supertipo son requeridos'
      })
    }

    // Crear carta
    const result = await CardService.createCard(body, user.id)
    
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: result.message
      })
    }

    return {
      success: true,
      card: result.card,
      message: result.message
    }

  } catch (error) {
    console.error('Error en POST /api/cards:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
