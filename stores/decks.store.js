import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useDecksStore = defineStore('decks', {
  state: () => ({
    decks: []
  }),
  
  getters: {
    getAllDecks: (state) => state.decks,
    getDeckById: (state) => (id) => state.decks.find(deck => deck.id === id),
    getFavoriteDecks: (state) => state.decks.filter(deck => deck.isFavorite),
    getDecksByFormat: (state) => (format) => state.decks.filter(deck => deck.format === format),
    getTotalCards: (state) => (deckId) => {
      const deck = state.decks.find(d => d.id === deckId)
      return deck ? deck.cards.reduce((total, card) => total + card.quantity, 0) : 0
    },
    getCardsByType: (state) => (deckId, type) => {
      const deck = state.decks.find(d => d.id === deckId)
      if (!deck) return []
      return deck.cards.filter(card => card.supertype === type)
    }
  },
  
  actions: {
    // Cargar mazos desde localStorage
    loadDecks() {
      if (process.client) {
        const savedDecks = localStorage.getItem('pokemon-decks')
        if (savedDecks) {
          this.decks = JSON.parse(savedDecks)
        }
      }
    },
    
    // Guardar mazos en localStorage
    saveDecks() {
      if (process.client) {
        localStorage.setItem('pokemon-decks', JSON.stringify(this.decks))
      }
    },
    
    // Crear nuevo mazo
    createDeck(deckData) {
      const newDeck = {
        id: uuidv4(),
        name: deckData.name || 'Nuevo Mazo',
        description: deckData.description || '',
        format: deckData.format || 'Standard',
        cards: [],
        isFavorite: false,
        tags: deckData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: deckData.theme || 'default'
      }
      this.decks.push(newDeck)
      this.saveDecks()
      return newDeck
    },
    
    // Actualizar mazo
    updateDeck(id, updatedData) {
      const index = this.decks.findIndex(deck => deck.id === id)
      if (index !== -1) {
        this.decks[index] = { 
          ...this.decks[index], 
          ...updatedData,
          updatedAt: new Date().toISOString()
        }
        this.saveDecks()
      }
    },
    
    // Eliminar mazo
    deleteDeck(id) {
      this.decks = this.decks.filter(deck => deck.id !== id)
      this.saveDecks()
    },
    
    // Duplicar mazo
    duplicateDeck(id) {
      const originalDeck = this.decks.find(deck => deck.id === id)
      if (originalDeck) {
        const duplicatedDeck = {
          ...originalDeck,
          id: uuidv4(),
          name: `${originalDeck.name} (Copia)`,
          isFavorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.decks.push(duplicatedDeck)
        this.saveDecks()
        return duplicatedDeck
      }
    },
    
    // Toggle favorito
    toggleFavorite(id) {
      const deck = this.decks.find(deck => deck.id === id)
      if (deck) {
        deck.isFavorite = !deck.isFavorite
        deck.updatedAt = new Date().toISOString()
        this.saveDecks()
      }
    },
    
    // Agregar carta al mazo
    addCardToDeck(deckId, card, quantity = 1) {
      const deck = this.decks.find(d => d.id === deckId)
      if (!deck) return
      
      const existingCard = deck.cards.find(c => c.id === card.id)
      if (existingCard) {
        existingCard.quantity = Math.min(existingCard.quantity + quantity, 4)
      } else {
        deck.cards.push({
          ...card,
          quantity: Math.min(quantity, 4)
        })
      }
      
      deck.updatedAt = new Date().toISOString()
      this.saveDecks()
    },
    
    // Quitar carta del mazo
    removeCardFromDeck(deckId, cardId, quantity = 1) {
      const deck = this.decks.find(d => d.id === deckId)
      if (!deck) return
      
      const cardIndex = deck.cards.findIndex(c => c.id === cardId)
      if (cardIndex !== -1) {
        deck.cards[cardIndex].quantity -= quantity
        if (deck.cards[cardIndex].quantity <= 0) {
          deck.cards.splice(cardIndex, 1)
        }
      }
      
      deck.updatedAt = new Date().toISOString()
      this.saveDecks()
    },
    
    // Actualizar cantidad de carta
    updateCardQuantity(deckId, cardId, newQuantity) {
      const deck = this.decks.find(d => d.id === deckId)
      if (!deck) return
      
      const card = deck.cards.find(c => c.id === cardId)
      if (card) {
        card.quantity = Math.max(0, Math.min(newQuantity, 4))
        if (card.quantity === 0) {
          deck.cards = deck.cards.filter(c => c.id !== cardId)
        }
      }
      
      deck.updatedAt = new Date().toISOString()
      this.saveDecks()
    }
  }
})
