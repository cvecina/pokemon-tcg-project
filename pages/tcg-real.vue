<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header Épico -->
      <div class="text-center mb-8">
        <h1 class="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
          🃏 TCG REAL CARDS 🃏
        </h1>
        <p class="text-xl text-white mb-4">¡Base de datos COMPLETA con más de 200 cartas reales del TCG!</p>
        <div class="bg-black/30 backdrop-blur-sm rounded-xl p-4 inline-block">
          <p class="text-green-400 font-bold">✅ API Local Funcional | 📊 {{ totalCards }} Cartas Disponibles | 🔥 Listo para Mazos</p>
        </div>
      </div>

      <!-- Controles de Búsqueda y Filtros -->
      <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <!-- Búsqueda -->
          <div class="lg:col-span-2">
            <div class="relative">
              <input 
                v-model="searchQuery" 
                @input="performSearch"
                placeholder="🔍 Buscar cartas (ej: Charizard, Fire, Base Set...)"
                class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <div class="absolute right-3 top-3 text-white/50">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Filtro por Tipo -->
          <div>
            <select v-model="selectedType" @change="performSearch" class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option value="" class="bg-gray-800">Todos los Tipos</option>
              <option v-for="type in availableTypes" :key="type" :value="type" class="bg-gray-800">{{ type }}</option>
            </select>
          </div>

          <!-- Filtro por Supertipo -->
          <div>
            <select v-model="selectedSupertype" @change="performSearch" class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option value="" class="bg-gray-800">Todos los Supertipos</option>
              <option value="Pokémon" class="bg-gray-800">🦄 Pokémon</option>
              <option value="Trainer" class="bg-gray-800">👤 Entrenador</option>
              <option value="Energy" class="bg-gray-800">⚡ Energía</option>
            </select>
          </div>

          <!-- Filtro por Set -->
          <div>
            <select v-model="selectedSet" @change="performSearch" class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option value="" class="bg-gray-800">Todos los Sets</option>
              <option v-for="set in availableSets" :key="set.id" :value="set.id" class="bg-gray-800">{{ set.name }}</option>
            </select>
          </div>
        </div>

        <!-- Acciones Rápidas -->
        <div class="flex flex-wrap gap-3 justify-center">
          <button @click="showRandomCards" class="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600">
            🎲 Cartas Aleatorias
          </button>
          <button @click="showRareCards" class="btn bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 hover:from-yellow-600 hover:to-orange-600">
            ✨ Solo Raras
          </button>
          <button @click="showHoloCards" class="btn bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:from-blue-600 hover:to-cyan-600">
            🌟 Solo Holográficas
          </button>
          <button @click="showBaseSet" class="btn bg-gradient-to-r from-red-500 to-red-600 text-white border-0 hover:from-red-600 hover:to-red-700">
            🔥 Base Set Clásico
          </button>
          <button @click="clearFilters" class="btn bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 hover:from-gray-600 hover:to-gray-700">
            🔄 Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="text-center">
          <div class="loading loading-spinner loading-lg text-yellow-400"></div>
          <p class="mt-4 text-xl text-white">Cargando cartas del TCG...</p>
        </div>
      </div>

      <!-- Estadísticas -->
      <div v-if="!loading" class="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/20">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-3">
            <div class="text-2xl font-bold text-green-400">{{ filteredCards.length }}</div>
            <div class="text-sm text-white/80">Cartas Mostradas</div>
          </div>
          <div class="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-3">
            <div class="text-2xl font-bold text-blue-400">{{ pokemonCount }}</div>
            <div class="text-sm text-white/80">Pokémon</div>
          </div>
          <div class="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-3">
            <div class="text-2xl font-bold text-purple-400">{{ trainerCount }}</div>
            <div class="text-sm text-white/80">Entrenadores</div>
          </div>
          <div class="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-3">
            <div class="text-2xl font-bold text-yellow-400">{{ energyCount }}</div>
            <div class="text-sm text-white/80">Energías</div>
          </div>
        </div>
      </div>

      <!-- Grid de Cartas -->
      <div v-if="!loading && filteredCards.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        <div 
          v-for="card in paginatedCards" 
          :key="card.id"
          @click="openCardModal(card)"
          class="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40 group"
        >
          <!-- Imagen de la carta -->
          <div class="relative">
            <img 
              :src="card.images?.small || '/favicon.ico'" 
              :alt="card.name"
              class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              @error="handleImageError"
            />
            <div class="absolute top-2 left-2">
              <span :class="getRarityColor(card.rarity)" class="px-2 py-1 rounded-full text-xs font-bold text-white">
                {{ card.rarity || 'Common' }}
              </span>
            </div>
            <div class="absolute top-2 right-2">
              <span class="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
                #{{ card.number }}
              </span>
            </div>
          </div>

          <!-- Información de la carta -->
          <div class="p-4">
            <h3 class="text-lg font-bold text-white mb-2 truncate">{{ card.name }}</h3>
            
            <!-- Tipos -->
            <div v-if="card.types" class="flex flex-wrap gap-1 mb-2">
              <span 
                v-for="type in card.types" 
                :key="type"
                :class="getTypeColor(type)"
                class="px-2 py-1 rounded-full text-xs font-bold text-white"
              >
                {{ type }}
              </span>
            </div>

            <!-- HP para Pokémon -->
            <div v-if="card.hp" class="mb-2">
              <span class="text-red-400 font-bold">❤️ {{ card.hp }} HP</span>
            </div>

            <!-- Set -->
            <div class="text-xs text-white/70 mb-2">
              📦 {{ card.set?.name || 'Unknown Set' }}
            </div>

            <!-- Precio si está disponible -->
            <div v-if="card.tcgplayer?.prices" class="text-xs text-green-400">
              💰 ${{ getCardPrice(card) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-if="!loading && filteredCards.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">😔</div>
        <h3 class="text-2xl font-bold text-white mb-4">No se encontraron cartas</h3>
        <p class="text-white/70 mb-6">Intenta con otros términos de búsqueda o filtros diferentes</p>
        <button @click="clearFilters" class="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          🔄 Limpiar Filtros
        </button>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
        <button 
          @click="currentPage--" 
          :disabled="currentPage <= 1"
          class="btn btn-outline text-white border-white/30 hover:bg-white/20 disabled:opacity-50"
        >
          ⬅️ Anterior
        </button>
        
        <div class="flex gap-2">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="currentPage = page"
            :class="page === currentPage ? 'bg-yellow-500 text-black' : 'bg-white/20 text-white hover:bg-white/30'"
            class="btn btn-sm"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="currentPage++" 
          :disabled="currentPage >= totalPages"
          class="btn btn-outline text-white border-white/30 hover:bg-white/20 disabled:opacity-50"
        >
          Siguiente ➡️
        </button>
      </div>
    </div>

    <!-- Modal de Detalle de Carta -->
    <div v-if="selectedCard" @click="closeModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div @click.stop class="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/30">
        <div class="sticky top-0 bg-gradient-to-r from-purple-800 to-blue-800 p-4 flex justify-between items-center border-b border-white/20">
          <h2 class="text-2xl font-bold text-white">{{ selectedCard.name }}</h2>
          <button @click="closeModal" class="btn btn-circle btn-outline text-white border-white/30 hover:bg-white/20">
            ✕
          </button>
        </div>

        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Imagen grande -->
            <div class="text-center">
              <img 
                :src="selectedCard.images?.large || selectedCard.images?.small || '/favicon.ico'" 
                :alt="selectedCard.name"
                class="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
                @error="handleImageError"
              />
            </div>

            <!-- Detalles -->
            <div class="space-y-6">
              <!-- Información básica -->
              <div class="bg-white/10 rounded-lg p-4">
                <h3 class="text-xl font-bold text-white mb-3">📋 Información Básica</h3>
                <div class="space-y-2 text-white/90">
                  <p><strong>Supertipo:</strong> {{ selectedCard.supertype }}</p>
                  <p v-if="selectedCard.subtypes"><strong>Subtipos:</strong> {{ selectedCard.subtypes.join(', ') }}</p>
                  <p v-if="selectedCard.hp"><strong>HP:</strong> {{ selectedCard.hp }}</p>
                  <p v-if="selectedCard.types"><strong>Tipos:</strong> {{ selectedCard.types.join(', ') }}</p>
                  <p><strong>Rareza:</strong> {{ selectedCard.rarity || 'Common' }}</p>
                  <p><strong>Artista:</strong> {{ selectedCard.artist || 'Unknown' }}</p>
                </div>
              </div>

              <!-- Ataques -->
              <div v-if="selectedCard.attacks && selectedCard.attacks.length > 0" class="bg-white/10 rounded-lg p-4">
                <h3 class="text-xl font-bold text-white mb-3">⚔️ Ataques</h3>
                <div class="space-y-3">
                  <div v-for="attack in selectedCard.attacks" :key="attack.name" class="bg-white/10 rounded p-3">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-bold text-white">{{ attack.name }}</h4>
                      <span class="text-red-400 font-bold">{{ attack.damage }}</span>
                    </div>
                    <p v-if="attack.text" class="text-white/80 text-sm">{{ attack.text }}</p>
                    <div v-if="attack.cost" class="mt-2">
                      <span class="text-xs text-white/70">Costo: {{ attack.cost.join(', ') }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reglas -->
              <div v-if="selectedCard.rules && selectedCard.rules.length > 0" class="bg-white/10 rounded-lg p-4">
                <h3 class="text-xl font-bold text-white mb-3">📜 Reglas</h3>
                <div class="space-y-2">
                  <p v-for="rule in selectedCard.rules" :key="rule" class="text-white/90 text-sm">{{ rule }}</p>
                </div>
              </div>

              <!-- Set y precios -->
              <div class="bg-white/10 rounded-lg p-4">
                <h3 class="text-xl font-bold text-white mb-3">💰 Set y Precios</h3>
                <div class="space-y-2 text-white/90">
                  <p><strong>Set:</strong> {{ selectedCard.set?.name || 'Unknown' }}</p>
                  <p><strong>Serie:</strong> {{ selectedCard.set?.series || 'Unknown' }}</p>
                  <p><strong>Número:</strong> {{ selectedCard.number }}/{{ selectedCard.set?.total || '?' }}</p>
                  <div v-if="selectedCard.tcgplayer?.prices" class="mt-3">
                    <p class="font-bold text-green-400">Precio de mercado: ${{ getCardPrice(selectedCard) }}</p>
                  </div>
                </div>
              </div>

              <!-- Botón agregar al mazo -->
              <button 
                @click="addToDeck(selectedCard)"
                class="w-full btn bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700"
              >
                ➕ Agregar al Mazo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CompleteTCGDatabase } from '~/utils/completeTCGDatabase.js'

// Estados reactivos
const tcgDB = new CompleteTCGDatabase()
const allCards = ref([])
const filteredCards = ref([])
const selectedCard = ref(null)
const loading = ref(true)

// Filtros
const searchQuery = ref('')
const selectedType = ref('')
const selectedSupertype = ref('')
const selectedSet = ref('')

// Opciones disponibles
const availableTypes = ref([])
const availableSets = ref([])

// Paginación
const currentPage = ref(1)
const cardsPerPage = 20

// Estadísticas computadas
const totalCards = computed(() => allCards.value.length)
const pokemonCount = computed(() => filteredCards.value.filter(card => card.supertype === 'Pokémon').length)
const trainerCount = computed(() => filteredCards.value.filter(card => card.supertype === 'Trainer').length)
const energyCount = computed(() => filteredCards.value.filter(card => card.supertype === 'Energy').length)

// Paginación computada
const totalPages = computed(() => Math.ceil(filteredCards.value.length / cardsPerPage))
const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * cardsPerPage
  const end = start + cardsPerPage
  return filteredCards.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Lifecycle
onMounted(async () => {
  await loadCards()
})

// Métodos principales
async function loadCards() {
  loading.value = true
  try {
    // Simular carga de la base de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    allCards.value = tcgDB.cards
    filteredCards.value = [...allCards.value]
    
    // Cargar opciones de filtros
    availableTypes.value = tcgDB.getAllTypes()
    availableSets.value = tcgDB.getAllSets()
    
    console.log('✅ Base de datos TCG cargada:', allCards.value.length, 'cartas')
  } catch (error) {
    console.error('❌ Error cargando cartas:', error)
  } finally {
    loading.value = false
  }
}

function performSearch() {
  const filters = {
    type: selectedType.value,
    supertype: selectedSupertype.value,
    set: selectedSet.value
  }
  
  filteredCards.value = tcgDB.searchCards(searchQuery.value, filters)
  currentPage.value = 1 // Reset pagination
}

// Acciones rápidas
function showRandomCards() {
  filteredCards.value = tcgDB.getRandomCards(50)
  clearFiltersButKeepResults()
}

function showRareCards() {
  filteredCards.value = allCards.value.filter(card => 
    card.rarity && (card.rarity.includes('Rare') || card.rarity.includes('Ultra'))
  )
  clearFiltersButKeepResults()
}

function showHoloCards() {
  filteredCards.value = allCards.value.filter(card => 
    card.rarity && card.rarity.includes('Holo')
  )
  clearFiltersButKeepResults()
}

function showBaseSet() {
  filteredCards.value = allCards.value.filter(card => 
    card.set && card.set.id === 'base1'
  )
  clearFiltersButKeepResults()
}

function clearFilters() {
  searchQuery.value = ''
  selectedType.value = ''
  selectedSupertype.value = ''
  selectedSet.value = ''
  filteredCards.value = [...allCards.value]
  currentPage.value = 1
}

function clearFiltersButKeepResults() {
  searchQuery.value = ''
  selectedType.value = ''
  selectedSupertype.value = ''
  selectedSet.value = ''
  currentPage.value = 1
}

// Modal
function openCardModal(card) {
  selectedCard.value = card
}

function closeModal() {
  selectedCard.value = null
}

// Utilidades de colores
function getTypeColor(type) {
  const colors = {
    Fire: 'bg-red-500',
    Water: 'bg-blue-500',
    Grass: 'bg-green-500',
    Lightning: 'bg-yellow-500',
    Psychic: 'bg-purple-500',
    Fighting: 'bg-orange-600',
    Colorless: 'bg-gray-500',
    Darkness: 'bg-gray-800',
    Metal: 'bg-gray-400'
  }
  return colors[type] || 'bg-gray-500'
}

function getRarityColor(rarity) {
  if (!rarity) return 'bg-gray-500'
  if (rarity.includes('Holo') || rarity.includes('Ultra')) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  if (rarity.includes('Rare')) return 'bg-purple-500'
  if (rarity.includes('Uncommon')) return 'bg-blue-500'
  return 'bg-gray-500'
}

function getCardPrice(card) {
  if (!card.tcgplayer?.prices) return 'N/A'
  
  const prices = card.tcgplayer.prices
  if (prices.holofoil?.market) return prices.holofoil.market.toFixed(2)
  if (prices.normal?.market) return prices.normal.market.toFixed(2)
  return 'N/A'
}

function handleImageError(event) {
  event.target.src = '/favicon.ico'
}

function addToDeck(card) {
  // TODO: Implementar lógica para agregar al mazo
  console.log('Agregando al mazo:', card.name)
  // Aquí conectarías con el store de mazos
  alert(`¡${card.name} agregada al mazo! (Funcionalidad próximamente)`)
}

// Metadata
useHead({
  title: 'TCG Real Cards - Base de Datos Completa',
  meta: [
    { name: 'description', content: 'Explora más de 200 cartas reales del Pokémon TCG. Busca, filtra y construye tus mazos perfectos.' }
  ]
})
</script>

<style scoped>
/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Animaciones */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Gradientes para los botones */
.btn {
  transition: all 0.3s ease;
}

/* Efectos de selección */
option {
  background: #1f2937;
  color: white;
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
