import { AuthService } from '~/server/services/auth.js'
import { CardService } from '~/server/services/cards.js'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación
    const user = await AuthService.requireAuth(event)
    
    const cardId = getRouterParam(event, 'id')
    
    if (!cardId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de carta requerido'
      })
    }

    // Eliminar carta
    const result = await CardService.deleteCard(cardId, user.id, user.role)
    
    if (!result.success) {
      throw createError({
        statusCode: result.message.includes('permisos') ? 403 : 400,
        statusMessage: result.message
      })
    }

    return {
      success: true,
      message: result.message
    }

  } catch (error) {
    console.error('Error en DELETE /api/cards/[id]:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
