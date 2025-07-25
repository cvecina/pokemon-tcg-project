// Script para crear un mazo de ejemplo con cartas populares
// Este archivo se puede ejecutar en la consola del navegador

// Cartas populares de ejemplo (IDs reales de la API de Pokémon TCG)
const popularCards = [
  {
    id: "base1-25", // Pikachu clásico
    name: "Pikachu",
    quantity: 2
  },
  {
    id: "base1-4", // Charizard clásico  
    name: "Charizard",
    quantity: 1
  },
  {
    id: "base1-1", // Alakazam
    name: "Alakazam", 
    quantity: 1
  },
  {
    id: "base1-17", // Beedrill
    name: "Beedrill",
    quantity: 2
  }
]

// Crear el mazo de ejemplo
const exampleDeck = {
  id: 'ejemplo-001',
  name: '⚡ Deck Clásico de Pikachu',
  description: 'Un mazo de ejemplo con cartas populares para probar la funcionalidad',
  format: 'Standard',
  isFavorite: true,
  cards: [],
  tags: ['ejemplo', 'pikachu', 'clásico'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Función para crear el mazo en localStorage
function createExampleDeck() {
  try {
    const existingDecks = JSON.parse(localStorage.getItem('pokemon-decks') || '[]')
    
    // Verificar si ya existe
    if (existingDecks.find(deck => deck.id === exampleDeck.id)) {
      console.log('El mazo de ejemplo ya existe')
      return
    }
    
    // Agregar el nuevo mazo
    existingDecks.push(exampleDeck)
    localStorage.setItem('pokemon-decks', JSON.stringify(existingDecks))
    
    console.log('✅ Mazo de ejemplo creado exitosamente!')
    console.log('Ve a /decks para verlo')
    
  } catch (error) {
    console.error('Error creando mazo de ejemplo:', error)
  }
}

// Ejecutar
createExampleDeck()

console.log(`
🚀 MAZO DE EJEMPLO CREADO!

Para verlo:
1. Ve a http://localhost:3001/decks
2. Busca el mazo "⚡ Deck Clásico de Pikachu"
3. Haz clic en él para ver los detalles
4. Haz clic en "Agregar Cartas" para buscar cartas reales de Pokémon

¡Ahora puedes buscar cartas como "Pikachu", "Charizard", "Blastoise", etc!
`)
