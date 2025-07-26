<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="loading loading-spinner loading-lg text-white"></div>
    </div>

    <!-- Deck no encontrado -->
    <div v-else-if="!deck" class="text-center py-20">
      <div class="text-6xl mb-4">❌</div>
      <h2 class="text-2xl font-bold text-white mb-4">Mazo no encontrado</h2>
      <NuxtLink to="/decks" class="text-yellow-300 hover:text-yellow-400">
        ← Volver a mis mazos
      </NuxtLink>
    </div>

    <!-- Contenido del mazo -->
    <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Botón volver -->
      <div class="mb-6">
        <button 
          @click="$router.back()"
          class="text-white hover:text-yellow-300 transition-colors flex items-center space-x-2"
        >
          <span>←</span>
          <span>Volver</span>
        </button>
      </div>
      
      <!-- Header del mazo -->
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div class="flex-1">
            <div class="flex items-center space-x-4 mb-2">
              <h1 class="text-3xl font-bold text-white">{{ deck.name }}</h1>
              <button 
                @click="toggleFavorite"
                class="text-2xl transition-colors"
              >
                {{ deck.isFavorite ? '⭐' : '☆' }}
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-4 mb-4">
              <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ deck.format }}
              </span>
              <span 
                :class="deck.isLegal ? 'bg-green-600' : 'bg-red-600'"
                class="text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ deck.isLegal ? '✓ Legal' : '✗ Ilegal' }}
              </span>
              <span class="text-white/70 text-sm">
                Actualizado {{ formatDate(deck.updatedAt) }}
              </span>
            </div>
            <p v-if="deck.description" class="text-white/80">{{ deck.description }}</p>
          </div>

          <!-- Acciones -->
          <div class="flex flex-wrap gap-3">
            <button 
              @click="editDeck"
              class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>✏️</span>
              <span>Editar</span>
            </button>
            <button 
              @click="duplicateDeck"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>📋</span>
              <span>Duplicar</span>
            </button>
            <button 
              @click="exportDeck"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>📤</span>
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas del mazo -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-white">{{ deck.totalCards }}</div>
          <div class="text-white/70 text-sm">Total de Cartas</div>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-white">{{ deck.uniqueCards }}</div>
          <div class="text-white/70 text-sm">Cartas Únicas</div>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-white">{{ pokemonCount }}</div>
          <div class="text-white/70 text-sm">Pokémon</div>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-white">{{ trainerCount }}</div>
          <div class="text-white/70 text-sm">Entrenadores</div>
        </div>
      </div>

      <!-- Tipos dominantes -->
      <div v-if="deck.dominantTypes?.length" class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">Tipos Dominantes</h3>
        <div class="flex flex-wrap gap-3">
          <div 
            v-for="type in deck.dominantTypes" 
            :key="type.name"
            class="flex items-center space-x-2 px-4 py-2 rounded-full text-white font-medium"
            :style="{ backgroundColor: type.color }"
          >
            <span class="text-lg">{{ type.emoji }}</span>
            <span>{{ type.name }}</span>
          </div>
        </div>
      </div>

      <!-- Controles -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold text-white">Lista de Cartas</h2>
          <span class="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
            {{ cards.length }} cartas
          </span>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Filtros -->
          <select 
            v-model="selectedCardType"
            class="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Todos los tipos</option>
            <option value="Pokemon">Pokémon</option>
            <option value="Trainer">Entrenador</option>
            <option value="Energy">Energía</option>
          </select>

          <!-- Agregar carta -->
          <button 
            @click="showAddCardModal = true"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Agregar Carta</span>
          </button>
        </div>
      </div>

      <!-- Lista de cartas -->
      <div class="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
        <div v-if="filteredCards.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🃏</div>
          <h3 class="text-xl font-bold text-white mb-4">No hay cartas en este mazo</h3>
          <p class="text-white/80 mb-6">¡Agrega algunas cartas para comenzar a construir tu mazo!</p>
          <button 
            @click="showAddCardModal = true"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            🃏 Agregar Primera Carta
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/20">
              <tr>
                <th class="text-left py-3 px-4 text-white font-medium">Carta</th>
                <th class="text-left py-3 px-4 text-white font-medium">Tipo</th>
                <th class="text-center py-3 px-4 text-white font-medium">Cantidad</th>
                <th class="text-center py-3 px-4 text-white font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="card in filteredCards" 
                :key="card.id"
                class="border-b border-white/10 hover:bg-white/5"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
                      {{ getCardEmoji(card.type) }}
                    </div>
                    <div>
                      <div class="text-white font-medium">{{ card.name }}</div>
                      <div class="text-white/70 text-sm">{{ card.set }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium text-white"
                    :style="{ backgroundColor: getTypeColor(card.type) }"
                  >
                    {{ card.type }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <button 
                      @click="decreaseQuantity(card)"
                      class="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-colors"
                    >
                      −
                    </button>
                    <span class="text-white font-medium w-8 text-center">{{ card.quantity }}</span>
                    <button 
                      @click="increaseQuantity(card)"
                      class="w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="py-3 px-4 text-center">
                  <button 
                    @click="removeCard(card)"
                    class="text-red-400 hover:text-red-300 transition-colors"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal de agregar carta -->
    <div v-if="showAddCardModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="closeAddCardModal">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" @click.stop>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-4">Agregar Carta al Mazo</h3>
          
          <!-- Buscador -->
          <div class="mb-4">
            <input 
              v-model="cardSearchTerm"
              type="text"
              placeholder="Buscar cartas..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <!-- Lista de cartas disponibles -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-h-96 overflow-y-auto">
            <div 
              v-for="card in availableCards" 
              :key="card.id"
              class="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              @click="addCardToDeck(card)"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
                  {{ getCardEmoji(card.type) }}
                </div>
                <div class="flex-1">
                  <div class="font-medium">{{ card.name }}</div>
                  <div class="text-sm text-gray-600">{{ card.set }}</div>
                  <div class="text-sm text-gray-500">{{ card.type }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button 
              @click="closeAddCardModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Estados reactivos
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const deck = ref(null)
const cards = ref([])
const loading = ref(true)
const selectedCardType = ref('')
const showAddCardModal = ref(false)
const cardSearchTerm = ref('')

// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

// Computed
const filteredCards = computed(() => {
  if (!selectedCardType.value) return cards.value
  return cards.value.filter(card => card.type === selectedCardType.value)
})

const pokemonCount = computed(() => {
  return cards.value
    .filter(card => card.type === 'Pokemon')
    .reduce((sum, card) => sum + card.quantity, 0)
})

const trainerCount = computed(() => {
  return cards.value
    .filter(card => card.type === 'Trainer')
    .reduce((sum, card) => sum + card.quantity, 0)
})

const availableCards = computed(() => {
  // Filtrar cartas basado en búsqueda
  const search = cardSearchTerm.value.toLowerCase()
  return mockAvailableCards.filter(card => 
    card.name.toLowerCase().includes(search) ||
    card.type.toLowerCase().includes(search) ||
    card.set.toLowerCase().includes(search)
  ).slice(0, 20) // Limitar resultados
})

// Mock data para cartas disponibles
const mockAvailableCards = [
  { id: 'pikachu-1', name: 'Pikachu', type: 'Pokemon', set: 'Base Set' },
  { id: 'charizard-1', name: 'Charizard', type: 'Pokemon', set: 'Base Set' },
  { id: 'professor-oak', name: 'Professor Oak', type: 'Trainer', set: 'Base Set' },
  { id: 'lightning-energy', name: 'Lightning Energy', type: 'Energy', set: 'Base Set' },
  { id: 'fire-energy', name: 'Fire Energy', type: 'Energy', set: 'Base Set' },
  { id: 'blastoise-1', name: 'Blastoise', type: 'Pokemon', set: 'Base Set' },
  { id: 'venusaur-1', name: 'Venusaur', type: 'Pokemon', set: 'Base Set' },
  { id: 'bill', name: 'Bill', type: 'Trainer', set: 'Base Set' },
  { id: 'water-energy', name: 'Water Energy', type: 'Energy', set: 'Base Set' },
  { id: 'grass-energy', name: 'Grass Energy', type: 'Energy', set: 'Base Set' }
]

// Cargar datos al montar
onMounted(async () => {
  await loadDeck()
})

// Funciones
async function loadDeck() {
  loading.value = true
  try {
    const deckId = route.params.id
    
    // Simular carga de datos (aquí iría la llamada a la API)
    if (deckId === '1') {
      deck.value = {
        id: 1,
        name: 'Deck Pikachu Eléctrico',
        format: 'Standard',
        description: 'Un mazo rápido y agresivo basado en Pokémon eléctricos con Pikachu como carta principal.',
        totalCards: 60,
        uniqueCards: 45,
        isFavorite: true,
        isLegal: true,
        dominantTypes: [
          { name: 'Electric', color: '#F8D030', emoji: '⚡' },
          { name: 'Colorless', color: '#A8A878', emoji: '⚪' }
        ],
        updatedAt: new Date(Date.now() - 86400000)
      }
      
      cards.value = [
        { id: 1, name: 'Pikachu', type: 'Pokemon', set: 'Base Set', quantity: 4 },
        { id: 2, name: 'Raichu', type: 'Pokemon', set: 'Base Set', quantity: 3 },
        { id: 3, name: 'Professor Oak', type: 'Trainer', set: 'Base Set', quantity: 4 },
        { id: 4, name: 'Lightning Energy', type: 'Energy', set: 'Base Set', quantity: 12 }
      ]
    } else if (deckId === '2') {
      deck.value = {
        id: 2,
        name: 'Dragones Legendarios',
        format: 'Expanded',
        description: 'Mazo de control con dragones poderosos y cartas de soporte.',
        totalCards: 60,
        uniqueCards: 38,
        isFavorite: false,
        isLegal: true,
        dominantTypes: [
          { name: 'Dragon', color: '#7038F8', emoji: '🐉' },
          { name: 'Fire', color: '#F08030', emoji: '🔥' }
        ],
        updatedAt: new Date(Date.now() - 172800000)
      }
      
      cards.value = [
        { id: 1, name: 'Dragonite', type: 'Pokemon', set: 'Fossil', quantity: 3 },
        { id: 2, name: 'Charizard', type: 'Pokemon', set: 'Base Set', quantity: 2 },
        { id: 3, name: 'Bill', type: 'Trainer', set: 'Base Set', quantity: 4 },
        { id: 4, name: 'Fire Energy', type: 'Energy', set: 'Base Set', quantity: 8 }
      ]
    }
  } catch (error) {
    console.error('Error cargando mazo:', error)
  } finally {
    loading.value = false
  }
}

function toggleFavorite() {
  if (deck.value) {
    deck.value.isFavorite = !deck.value.isFavorite
  }
}

function editDeck() {
  // TODO: Implementar edición del mazo
  console.log('Editando mazo:', deck.value.name)
}

function duplicateDeck() {
  // TODO: Implementar duplicación del mazo
  console.log('Duplicando mazo:', deck.value.name)
}

function exportDeck() {
  // TODO: Implementar exportación del mazo
  console.log('Exportando mazo:', deck.value.name)
}

function addCardToDeck(card) {
  const existingCard = cards.value.find(c => c.id === card.id)
  if (existingCard) {
    existingCard.quantity += 1
  } else {
    cards.value.push({
      ...card,
      quantity: 1
    })
  }
  updateDeckStats()
  closeAddCardModal()
}

function increaseQuantity(card) {
  card.quantity += 1
  updateDeckStats()
}

function decreaseQuantity(card) {
  if (card.quantity > 1) {
    card.quantity -= 1
  } else {
    removeCard(card)
  }
  updateDeckStats()
}

function removeCard(card) {
  const index = cards.value.findIndex(c => c.id === card.id)
  if (index !== -1) {
    cards.value.splice(index, 1)
  }
  updateDeckStats()
}

function updateDeckStats() {
  if (deck.value) {
    deck.value.totalCards = cards.value.reduce((sum, card) => sum + card.quantity, 0)
    deck.value.uniqueCards = cards.value.length
  }
}

function closeAddCardModal() {
  showAddCardModal.value = false
  cardSearchTerm.value = ''
}

function getCardEmoji(type) {
  const emojis = {
    Pokemon: '🐾',
    Trainer: '👨‍🏫',
    Energy: '⚡'
  }
  return emojis[type] || '🃏'
}

function getTypeColor(type) {
  const colors = {
    Pokemon: '#6366f1',
    Trainer: '#f59e0b',
    Energy: '#10b981'
  }
  return colors[type] || '#6b7280'
}

function formatDate(date) {
  if (!date) return ''
  const now = new Date()
  const diff = now - new Date(date)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'hoy'
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`
  return new Date(date).toLocaleDateString()
}

// Metadata
useHead({
  title: computed(() => deck.value ? `${deck.value.name} - TCG Manager` : 'Cargando...'),
  meta: [
    { name: 'description', content: 'Vista detallada del mazo de Pokémon TCG con lista completa de cartas y herramientas de edición.' }
  ]
})
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>
