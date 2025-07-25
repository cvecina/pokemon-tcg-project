import { CardService } from '~/server/services/cards.js'

export default defineEventHandler(async (event) => {
  try {
    // Obtener parámetros de query
    const query = getQuery(event)
    const page = parseInt(query.page) || 1
    const limit = Math.min(parseInt(query.limit) || 20, 100) // Máximo 100 por página
    
    // Filtros
    const filters = {
      search: query.search || '',
      supertype: query.supertype || '',
      setId: query.setId || '',
      rarity: query.rarity || '',
      type: query.type || ''
    }

    // Obtener cartas
    const result = await CardService.getCards(filters, page, limit)
    
    if (!result.success) {
      throw createError({
        statusCode: 500,
        statusMessage: result.message
      })
    }

    return {
      success: true,
      ...result
    }

  } catch (error) {
    console.error('Error en GET /api/cards:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
