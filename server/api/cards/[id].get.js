import { CardService } from '~/server/services/cards.js'

export default defineEventHandler(async (event) => {
  try {
    const cardId = getRouterParam(event, 'id')
    
    if (!cardId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de carta requerido'
      })
    }

    // Obtener carta
    const result = await CardService.getCardById(cardId)
    
    if (!result.success) {
      throw createError({
        statusCode: 404,
        statusMessage: result.message
      })
    }

    return {
      success: true,
      card: result.card
    }

  } catch (error) {
    console.error('Error en GET /api/cards/[id]:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
