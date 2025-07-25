import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CardService {
  
  // Crear nueva carta
  static async createCard(cardData, userId) {
    try {
      const card = await prisma.card.create({
        data: {
          ...cardData,
          createdById: userId,
          // Convertir arrays/objetos a JSON strings
          types: cardData.types ? JSON.stringify(cardData.types) : null,
          attacks: cardData.attacks ? JSON.stringify(cardData.attacks) : null,
          weaknesses: cardData.weaknesses ? JSON.stringify(cardData.weaknesses) : null,
          resistances: cardData.resistances ? JSON.stringify(cardData.resistances) : null,
          retreatCost: cardData.retreatCost ? JSON.stringify(cardData.retreatCost) : null,
          prices: cardData.prices ? JSON.stringify(cardData.prices) : null,
          rules: cardData.rules ? JSON.stringify(cardData.rules) : null,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true
            }
          }
        }
      })

      return {
        success: true,
        card: this.formatCard(card),
        message: 'Carta creada exitosamente'
      }
    } catch (error) {
      console.error('Error creando carta:', error)
      return {
        success: false,
        message: error.message || 'Error creando carta'
      }
    }
  }

  // Obtener todas las cartas con filtros
  static async getCards(filters = {}, page = 1, limit = 20) {
    try {
      const where = {}
      
      // Filtros de búsqueda
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { setName: { contains: filters.search, mode: 'insensitive' } },
          { artist: { contains: filters.search, mode: 'insensitive' } }
        ]
      }

      if (filters.supertype) {
        where.supertype = filters.supertype
      }

      if (filters.setId) {
        where.setId = filters.setId
      }

      if (filters.rarity) {
        where.rarity = filters.rarity
      }

      // Filtro por tipos (JSON)
      if (filters.type) {
        where.types = { contains: filters.type }
      }

      const skip = (page - 1) * limit

      const [cards, total] = await Promise.all([
        prisma.card.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }),
        prisma.card.count({ where })
      ])

      return {
        success: true,
        cards: cards.map(card => this.formatCard(card)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Error obteniendo cartas:', error)
      return {
        success: false,
        message: 'Error obteniendo cartas'
      }
    }
  }

  // Obtener carta por ID
  static async getCardById(cardId) {
    try {
      const card = await prisma.card.findUnique({
        where: { id: cardId },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true
            }
          }
        }
      })

      if (!card) {
        return {
          success: false,
          message: 'Carta no encontrada'
        }
      }

      return {
        success: true,
        card: this.formatCard(card)
      }
    } catch (error) {
      console.error('Error obteniendo carta:', error)
      return {
        success: false,
        message: 'Error obteniendo carta'
      }
    }
  }

  // Actualizar carta
  static async updateCard(cardId, cardData, userId, userRole) {
    try {
      // Verificar si la carta existe
      const existingCard = await prisma.card.findUnique({
        where: { id: cardId }
      })

      if (!existingCard) {
        return {
          success: false,
          message: 'Carta no encontrada'
        }
      }

      // Verificar permisos (solo el creador o admin/moderator)
      if (existingCard.createdById !== userId && !['ADMIN', 'MODERATOR'].includes(userRole)) {
        return {
          success: false,
          message: 'No tienes permisos para editar esta carta'
        }
      }

      const updatedCard = await prisma.card.update({
        where: { id: cardId },
        data: {
          ...cardData,
          // Convertir arrays/objetos a JSON strings
          types: cardData.types ? JSON.stringify(cardData.types) : undefined,
          attacks: cardData.attacks ? JSON.stringify(cardData.attacks) : undefined,
          weaknesses: cardData.weaknesses ? JSON.stringify(cardData.weaknesses) : undefined,
          resistances: cardData.resistances ? JSON.stringify(cardData.resistances) : undefined,
          retreatCost: cardData.retreatCost ? JSON.stringify(cardData.retreatCost) : undefined,
          prices: cardData.prices ? JSON.stringify(cardData.prices) : undefined,
          rules: cardData.rules ? JSON.stringify(cardData.rules) : undefined,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true
            }
          }
        }
      })

      return {
        success: true,
        card: this.formatCard(updatedCard),
        message: 'Carta actualizada exitosamente'
      }
    } catch (error) {
      console.error('Error actualizando carta:', error)
      return {
        success: false,
        message: 'Error actualizando carta'
      }
    }
  }

  // Eliminar carta
  static async deleteCard(cardId, userId, userRole) {
    try {
      // Verificar si la carta existe
      const existingCard = await prisma.card.findUnique({
        where: { id: cardId }
      })

      if (!existingCard) {
        return {
          success: false,
          message: 'Carta no encontrada'
        }
      }

      // Verificar permisos (solo el creador o admin/moderator)
      if (existingCard.createdById !== userId && !['ADMIN', 'MODERATOR'].includes(userRole)) {
        return {
          success: false,
          message: 'No tienes permisos para eliminar esta carta'
        }
      }

      await prisma.card.delete({
        where: { id: cardId }
      })

      return {
        success: true,
        message: 'Carta eliminada exitosamente'
      }
    } catch (error) {
      console.error('Error eliminando carta:', error)
      return {
        success: false,
        message: 'Error eliminando carta'
      }
    }
  }

  // Obtener estadísticas
  static async getStats() {
    try {
      const [totalCards, cardsByType, cardsBySet, cardsByRarity] = await Promise.all([
        // Total de cartas
        prisma.card.count(),
        
        // Cartas por supertipo
        prisma.card.groupBy({
          by: ['supertype'],
          _count: true
        }),
        
        // Cartas por set (top 10)
        prisma.card.groupBy({
          by: ['setName'],
          _count: true,
          orderBy: { _count: { _all: 'desc' } },
          take: 10
        }),
        
        // Cartas por rareza
        prisma.card.groupBy({
          by: ['rarity'],
          _count: true,
          orderBy: { _count: { _all: 'desc' } }
        })
      ])

      return {
        success: true,
        stats: {
          totalCards,
          cardsByType,
          cardsBySet,
          cardsByRarity
        }
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return {
        success: false,
        message: 'Error obteniendo estadísticas'
      }
    }
  }

  // Formatear carta para respuesta
  static formatCard(card) {
    return {
      ...card,
      // Convertir JSON strings de vuelta a objetos/arrays
      types: card.types ? JSON.parse(card.types) : null,
      attacks: card.attacks ? JSON.parse(card.attacks) : null,
      weaknesses: card.weaknesses ? JSON.parse(card.weaknesses) : null,
      resistances: card.resistances ? JSON.parse(card.resistances) : null,
      retreatCost: card.retreatCost ? JSON.parse(card.retreatCost) : null,
      prices: card.prices ? JSON.parse(card.prices) : null,
      rules: card.rules ? JSON.parse(card.rules) : null,
    }
  }

  // Importar cartas desde datos existentes
  static async importCards(cardsData, userId) {
    try {
      const imported = []
      const errors = []

      for (const cardData of cardsData) {
        try {
          // Verificar si la carta ya existe
          const existingCard = await prisma.card.findFirst({
            where: {
              name: cardData.name,
              setId: cardData.setId,
              number: cardData.number
            }
          })

          if (existingCard) {
            errors.push(`Carta ya existe: ${cardData.name} (${cardData.setId}-${cardData.number})`)
            continue
          }

          const result = await this.createCard(cardData, userId)
          if (result.success) {
            imported.push(result.card)
          } else {
            errors.push(`Error importando ${cardData.name}: ${result.message}`)
          }
        } catch (error) {
          errors.push(`Error importando ${cardData.name}: ${error.message}`)
        }
      }

      return {
        success: true,
        imported: imported.length,
        errors,
        message: `Importadas ${imported.length} cartas. ${errors.length} errores.`
      }
    } catch (error) {
      console.error('Error en importación masiva:', error)
      return {
        success: false,
        message: 'Error en importación masiva'
      }
    }
  }
}

export default CardService
