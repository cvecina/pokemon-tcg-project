<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
    <!-- Header -->
    <header class="relative z-10">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <NuxtLink to="/" class="text-3xl font-bold text-white flex items-center space-x-2">
            <span>🃏</span>
            <span>TCG Manager</span>
          </NuxtLink>
          
          <!-- Navegación -->
          <div class="hidden md:flex items-center space-x-6">
            <NuxtLink 
              to="/pokedex" 
              class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            >
              <span>📱</span>
              <span>Pokédex</span>
            </NuxtLink>
            <NuxtLink 
              to="/cards" 
              class="text-yellow-300 font-medium flex items-center space-x-1"
            >
              <span>🔍</span>
              <span>Explorar Cartas</span>
            </NuxtLink>
            <NuxtLink 
              v-if="authStore.isAuthenticated"
              to="/decks" 
              class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            >
              <span>🎲</span>
              <span>Mis Mazos</span>
            </NuxtLink>
          </div>

          <!-- Usuario -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <NuxtLink to="/dashboard" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Dashboard
            </NuxtLink>
            <button 
              @click="authStore.logout()"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          <div v-else>
            <NuxtLink to="/auth" class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors">
              Iniciar Sesión
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Contenido Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="text-8xl mb-6">🔍</div>
        <h1 class="text-5xl font-bold text-white mb-4">Explorar Cartas TCG</h1>
        <p class="text-xl text-white/80 max-w-2xl mx-auto">
          Descubre cartas increíbles de Pokémon TCG de todas las expansiones y colecciones.
        </p>
      </div>

      <!-- Controles de búsqueda y filtros -->
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <!-- Buscador -->
          <div class="relative">
            <input 
              v-model="searchTerm"
              type="text"
              placeholder="Buscar cartas..."
              class="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg class="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Filtro por set -->
          <select 
            v-model="selectedSet"
            class="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Todas las expansiones</option>
            <option v-for="set in sets" :key="set.id" :value="set.id">
              {{ set.name }}
            </option>
          </select>

          <!-- Filtro por rareza -->
          <select 
            v-model="selectedRarity"
            class="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Todas las rarezas</option>
            <option value="Common">Común</option>
            <option value="Uncommon">Poco Común</option>
            <option value="Rare">Rara</option>
            <option value="Rare Holo">Rara Holográfica</option>
            <option value="Ultra Rare">Ultra Rara</option>
          </select>
        </div>

        <!-- Botones de filtro rápido -->
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="type in quickFilters" 
            :key="type"
            @click="quickFilter(type)"
            :class="activeFilter === type ? 'bg-purple-600' : 'bg-white/20 hover:bg-white/30'"
            class="px-4 py-2 rounded-lg text-white font-medium transition-colors"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="loading loading-spinner loading-lg text-white"></div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-6xl mb-4">😔</div>
        <h3 class="text-xl font-bold text-white mb-2">Error al cargar cartas</h3>
        <p class="text-white/80 mb-4">{{ error }}</p>
        <button 
          @click="searchCards"
          class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Grid de cartas -->
      <div v-else-if="cards.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div 
          v-for="card in cards" 
          :key="card.id"
          @click="selectCard(card)"
          class="bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-all hover:scale-105 hover:shadow-xl"
        >
          <!-- Imagen de la carta -->
          <div class="aspect-[3/4] bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-3 overflow-hidden">
            <img 
              v-if="card.images?.small"
              :src="card.images.small"
              :alt="card.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-4xl">🃏</div>
          </div>

          <!-- Info de la carta -->
          <div>
            <h3 class="text-white font-bold text-sm mb-1 line-clamp-2">{{ card.name }}</h3>
            <p class="text-white/70 text-xs mb-2">{{ card.set?.name || 'Set desconocido' }}</p>
            
            <!-- Rareza -->
            <div v-if="card.rarity" class="mb-2">
              <span class="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300 font-medium">
                {{ card.rarity }}
              </span>
            </div>

            <!-- Precio (si disponible) -->
            <div v-if="card.tcgplayer?.prices" class="text-xs text-green-300">
              <span v-if="card.tcgplayer.prices.holofoil?.market">
                💰 ${{ card.tcgplayer.prices.holofoil.market }}
              </span>
              <span v-else-if="card.tcgplayer.prices.normal?.market">
                💰 ${{ card.tcgplayer.prices.normal.market }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-bold text-white mb-2">No se encontraron cartas</h3>
        <p class="text-white/80">Intenta ajustar tus filtros de búsqueda</p>
      </div>

      <!-- Cargar más -->
      <div v-if="hasMore && cards.length > 0" class="text-center mt-8">
        <button 
          @click="loadMore"
          :disabled="loading"
          class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Cargando...' : 'Cargar Más Cartas' }}
        </button>
      </div>
    </main>

    <!-- Modal de carta -->
    <div v-if="selectedCard" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="closeModal">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="p-6">
          <!-- Header del modal -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">{{ selectedCard.name }}</h2>
            <div class="flex items-center space-x-4">
              <!-- Botón agregar a colección -->
              <button 
                v-if="authStore.isAuthenticated"
                @click="addToCollection"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                ➕ Agregar a mi colección
              </button>
              <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
          </div>

          <!-- Contenido del modal -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Imagen -->
            <div class="text-center">
              <img 
                v-if="selectedCard.images?.large"
                :src="selectedCard.images.large"
                :alt="selectedCard.name"
                class="max-w-full h-auto mx-auto rounded-lg shadow-lg"
              />
            </div>

            <!-- Información -->
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold mb-2">Información Básica</h3>
                <div class="space-y-1 text-sm">
                  <p><strong>Set:</strong> {{ selectedCard.set?.name || 'Desconocido' }}</p>
                  <p><strong>Número:</strong> {{ selectedCard.number }}</p>
                  <p v-if="selectedCard.rarity"><strong>Rareza:</strong> {{ selectedCard.rarity }}</p>
                  <p v-if="selectedCard.artist"><strong>Artista:</strong> {{ selectedCard.artist }}</p>
                </div>
              </div>

              <!-- Ataques -->
              <div v-if="selectedCard.attacks?.length">
                <h3 class="text-lg font-semibold mb-2">Ataques</h3>
                <div class="space-y-2">
                  <div v-for="attack in selectedCard.attacks" :key="attack.name" class="border rounded-lg p-3">
                    <div class="flex justify-between items-center">
                      <h4 class="font-medium">{{ attack.name }}</h4>
                      <span v-if="attack.damage" class="text-red-600 font-bold">{{ attack.damage }}</span>
                    </div>
                    <p v-if="attack.text" class="text-sm text-gray-600 mt-1">{{ attack.text }}</p>
                  </div>
                </div>
              </div>

              <!-- Precio -->
              <div v-if="selectedCard.tcgplayer?.prices" class="bg-green-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-2">Precios TCGPlayer</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div v-if="selectedCard.tcgplayer.prices.normal">
                    <p class="font-medium">Normal:</p>
                    <p v-if="selectedCard.tcgplayer.prices.normal.market">
                      Mercado: ${{ selectedCard.tcgplayer.prices.normal.market }}
                    </p>
                  </div>
                  <div v-if="selectedCard.tcgplayer.prices.holofoil">
                    <p class="font-medium">Holográfica:</p>
                    <p v-if="selectedCard.tcgplayer.prices.holofoil.market">
                      Mercado: ${{ selectedCard.tcgplayer.prices.holofoil.market }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Estados reactivos
const authStore = useAuthStore()
const searchTerm = ref('')
const selectedSet = ref('')
const selectedRarity = ref('')
const activeFilter = ref('')
const cards = ref([])
const sets = ref([])
const loading = ref(false)
const error = ref('')
const selectedCard = ref(null)
const currentPage = ref(1)
const hasMore = ref(true)

// Filtros rápidos
const quickFilters = ['Pokémon', 'Trainer', 'Energy', 'Populares', 'Recientes']

// Cargar sets al montar
onMounted(async () => {
  await loadSets()
  await searchCards()
})

// Watchers para búsqueda automática
watch([searchTerm, selectedSet, selectedRarity], () => {
  resetSearch()
  searchCards()
}, { debounce: 500 })

// Funciones
async function loadSets() {
  try {
    // Simular sets populares
    sets.value = [
      { id: 'base1', name: 'Base Set' },
      { id: 'base2', name: 'Jungle' },
      { id: 'base3', name: 'Fossil' },
      { id: 'swsh1', name: 'Sword & Shield' },
      { id: 'swsh2', name: 'Rebel Clash' },
      { id: 'swsh3', name: 'Darkness Ablaze' }
    ]
  } catch (err) {
    console.error('Error cargando sets:', err)
  }
}

function resetSearch() {
  cards.value = []
  currentPage.value = 1
  hasMore.value = true
  error.value = ''
}

async function searchCards() {
  if (loading.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    // Simular cartas para demo
    const mockCards = generateMockCards()
    
    if (currentPage.value === 1) {
      cards.value = mockCards
    } else {
      cards.value.push(...mockCards)
    }
    
    // Simular paginación
    hasMore.value = currentPage.value < 3
  } catch (err) {
    console.error('Error buscando cartas:', err)
    error.value = 'Error al conectar con la API de Pokémon TCG'
  } finally {
    loading.value = false
  }
}

function generateMockCards() {
  const mockCards = []
  const pokemonNames = ['Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Mew', 'Lugia', 'Ho-Oh', 'Rayquaza', 'Dialga']
  const rarities = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Ultra Rare']
  
  for (let i = 0; i < 20; i++) {
    const name = pokemonNames[Math.floor(Math.random() * pokemonNames.length)]
    mockCards.push({
      id: `mock-${currentPage.value}-${i}`,
      name: `${name} ${Math.floor(Math.random() * 100) + 1}`,
      number: `${i + 1}`,
      rarity: rarities[Math.floor(Math.random() * rarities.length)],
      set: {
        name: sets.value[Math.floor(Math.random() * sets.value.length)]?.name || 'Base Set'
      },
      images: {
        small: `https://via.placeholder.com/200x280/4C1D95/FFFFFF?text=${name}`,
        large: `https://via.placeholder.com/400x560/4C1D95/FFFFFF?text=${name}`
      },
      artist: 'Mitsuhiro Arita',
      attacks: [
        {
          name: 'Thunder Shock',
          damage: '20',
          text: 'Flip a coin. If tails, this attack does nothing.'
        }
      ],
      tcgplayer: {
        prices: {
          normal: {
            market: (Math.random() * 50 + 1).toFixed(2)
          }
        }
      }
    })
  }
  
  return mockCards
}

function quickFilter(type) {
  activeFilter.value = activeFilter.value === type ? '' : type
  resetSearch()
  searchCards()
}

function loadMore() {
  currentPage.value++
  searchCards()
}

function selectCard(card) {
  selectedCard.value = card
}

function closeModal() {
  selectedCard.value = null
}

async function addToCollection() {
  if (!selectedCard.value) return
  
  try {
    // Aquí iría la lógica para agregar a la colección del usuario
    alert(`¡${selectedCard.value.name} agregada a tu colección!`)
    closeModal()
  } catch (err) {
    console.error('Error agregando carta:', err)
    alert('Error al agregar la carta. Intenta de nuevo.')
  }
}

function handleImageError(event) {
  event.target.style.display = 'none'
}

// Metadata
useHead({
  title: 'Explorar Cartas - TCG Manager',
  meta: [
    { name: 'description', content: 'Descubre cartas increíbles de Pokémon TCG de todas las expansiones y colecciones.' }
  ]
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animaciones */
.transition-all {
  transition: all 0.3s ease;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
