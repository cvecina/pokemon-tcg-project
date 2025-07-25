import { AuthService } from '~/server/services/auth.js'
import { CardService } from '~/server/services/cards.js'
import { CompleteTCGDatabase } from '~/utils/completeTCGDatabase.js'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación y permisos de admin/moderator
    const user = await AuthService.requireRole(event, 'MODERATOR')
    
    // Obtener cartas desde la base de datos mock
    const tcgDB = new CompleteTCGDatabase()
    const mockCards = tcgDB.cards

    // Convertir formato mock a formato de base de datos
    const cardsToImport = mockCards.map(mockCard => ({
      id: mockCard.id,
      name: mockCard.name,
      supertype: mockCard.supertype,
      subtypes: mockCard.subtypes?.join(', ') || null,
      hp: mockCard.hp || null,
      types: mockCard.types || null,
      evolvesFrom: mockCard.evolvesFrom || null,
      attacks: mockCard.attacks || null,
      weaknesses: mockCard.weaknesses || null,
      resistances: mockCard.resistances || null,
      retreatCost: mockCard.retreatCost || null,
      convertedRetreatCost: mockCard.convertedRetreatCost || null,
      setId: mockCard.set?.id || null,
      setName: mockCard.set?.name || null,
      setSeries: mockCard.set?.series || null,
      setTotal: mockCard.set?.total || null,
      setReleaseDate: mockCard.set?.releaseDate || null,
      number: mockCard.number || null,
      artist: mockCard.artist || null,
      rarity: mockCard.rarity || null,
      imageSmall: mockCard.images?.small || null,
      imageLarge: mockCard.images?.large || null,
      prices: mockCard.tcgplayer?.prices || null,
      rules: mockCard.rules || null
    }))

    // Importar en lotes para evitar sobrecargar la base de datos
    const batchSize = 10
    const batches = []
    
    for (let i = 0; i < cardsToImport.length; i += batchSize) {
      batches.push(cardsToImport.slice(i, i + batchSize))
    }

    let totalImported = 0
    let totalErrors = 0
    const errors = []

    // Procesar cada lote
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`Procesando lote ${i + 1}/${batches.length} (${batch.length} cartas)`)
      
      const result = await CardService.importCards(batch, user.id)
      
      if (result.success) {
        totalImported += result.imported
        totalErrors += result.errors.length
        errors.push(...result.errors)
      }
      
      // Pausa pequeña entre lotes
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return {
      success: true,
      message: `Importación completada. ${totalImported} cartas importadas.`,
      stats: {
        totalProcessed: cardsToImport.length,
        imported: totalImported,
        errors: totalErrors,
        errorDetails: errors.slice(0, 10) // Mostrar solo los primeros 10 errores
      }
    }

  } catch (error) {
    console.error('Error en importación:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor durante la importación'
    })
  }
})
