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
              class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            >
              <span>🔍</span>
              <span>Explorar Cartas</span>
            </NuxtLink>
            <NuxtLink 
              to="/decks" 
              class="text-yellow-300 font-medium flex items-center space-x-1"
            >
              <span>🎲</span>
              <span>Mis Mazos</span>
            </NuxtLink>
            <a 
              href="https://discord.gg/aKxPPuEFnH" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            >
              <span>💬</span>
              <span>Discord</span>
            </a>
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
        <div class="text-8xl mb-6">🎲</div>
        <h1 class="text-5xl font-bold text-white mb-4">Mis Mazos</h1>
        <p class="text-xl text-white/80 max-w-2xl mx-auto">
          Construye, organiza y perfecciona tus mazos de Pokémon TCG para competir al más alto nivel.
        </p>
      </div>

      <!-- Mensaje para usuarios no autenticados -->
      <div v-if="!authStore.isAuthenticated" class="text-center py-16">
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
          <div class="text-6xl mb-4">🔒</div>
          <h3 class="text-xl font-bold text-white mb-4">Inicia sesión para ver tus mazos</h3>
          <p class="text-white/80 mb-6">Crea una cuenta gratuita para comenzar a construir tus mazos de Pokémon TCG.</p>
          <NuxtLink 
            to="/auth" 
            class="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Iniciar Sesión / Registrarse
          </NuxtLink>
        </div>
      </div>

      <!-- Contenido para usuarios autenticados -->
      <div v-else>
        <!-- Controles superiores -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <!-- Buscador -->
          <div class="relative">
            <input 
              v-model="searchTerm"
              type="text"
              placeholder="Buscar mazos..."
              class="pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg class="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Filtros y botón crear -->
          <div class="flex items-center space-x-4">
            <select 
              v-model="selectedFormat"
              class="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Todos los formatos</option>
              <option value="Standard">Standard</option>
              <option value="Expanded">Expanded</option>
              <option value="Legacy">Legacy</option>
              <option value="Unlimited">Unlimited</option>
            </select>

            <button 
              @click="createDeck"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Crear Mazo</span>
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="loading loading-spinner loading-lg text-white"></div>
        </div>

        <!-- Grid de mazos -->
        <div v-else-if="filteredDecks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="deck in filteredDecks" 
            :key="deck.id"
            class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer"
            @click="viewDeck(deck)"
          >
            <!-- Header del mazo -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-white font-bold text-lg mb-1">{{ deck.name }}</h3>
                <p class="text-white/70 text-sm">{{ deck.format || 'Standard' }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click.stop="toggleFavorite(deck)"
                  class="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  {{ deck.isFavorite ? '⭐' : '☆' }}
                </button>
                <div class="relative">
                  <button 
                    @click.stop="toggleMenu(deck.id)"
                    class="text-white/70 hover:text-white transition-colors"
                  >
                    ⋮
                  </button>
                  <div 
                    v-if="openMenuId === deck.id"
                    class="absolute right-0 top-8 bg-white rounded-lg shadow-lg py-2 z-10 min-w-[120px]"
                  >
                    <button 
                      @click.stop="editDeck(deck)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      @click.stop="duplicateDeck(deck)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📋 Duplicar
                    </button>
                    <button 
                      @click.stop="deleteDeck(deck)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Descripción -->
            <p class="text-white/80 text-sm mb-4 line-clamp-2">
              {{ deck.description || 'Sin descripción disponible' }}
            </p>

            <!-- Estadísticas del mazo -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-white/10 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-white">{{ deck.totalCards || 0 }}</div>
                <div class="text-white/70 text-xs">Cartas</div>
              </div>
              <div class="bg-white/10 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-white">{{ deck.uniqueCards || 0 }}</div>
                <div class="text-white/70 text-xs">Únicas</div>
              </div>
            </div>

            <!-- Tipos dominantes -->
            <div v-if="deck.dominantTypes?.length" class="flex flex-wrap gap-1 mb-4">
              <span 
                v-for="type in deck.dominantTypes.slice(0, 3)" 
                :key="type.name"
                class="px-2 py-1 text-xs rounded-full text-white font-medium"
                :style="{ backgroundColor: type.color }"
              >
                {{ type.emoji }} {{ type.name }}
              </span>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center text-xs text-white/60">
              <span>{{ formatDate(deck.updatedAt) }}</span>
              <span v-if="deck.isLegal" class="text-green-400">✓ Legal</span>
              <span v-else class="text-red-400">✗ Ilegal</span>
            </div>
          </div>
        </div>

        <!-- Sin mazos -->
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">🎲</div>
          <h3 class="text-xl font-bold text-white mb-4">Aún no tienes mazos</h3>
          <p class="text-white/80 mb-6">¡Crea tu primer mazo y comienza a competir!</p>
          <button 
            @click="createDeck"
            class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
          >
            🎲 Crear Mi Primer Mazo
          </button>
        </div>
      </div>
    </main>

    <!-- Modal de crear/editar mazo -->
    <div v-if="showDeckModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="closeDeckModal">
      <div class="bg-white rounded-lg max-w-md w-full" @click.stop>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-4">{{ editingDeck ? 'Editar Mazo' : 'Crear Nuevo Mazo' }}</h3>
          
          <form @submit.prevent="saveDeck" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Mazo</label>
              <input 
                v-model="deckForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ej: Deck Pikachu Eléctrico"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Formato</label>
              <select 
                v-model="deckForm.format"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="Standard">Standard</option>
                <option value="Expanded">Expanded</option>
                <option value="Legacy">Legacy</option>
                <option value="Unlimited">Unlimited</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea 
                v-model="deckForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe la estrategia de tu mazo..."
              ></textarea>
            </div>

            <div class="flex justify-end space-x-4">
              <button 
                type="button"
                @click="closeDeckModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
              >
                {{ editingDeck ? 'Guardar Cambios' : 'Crear Mazo' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Estados reactivos
const authStore = useAuthStore()
const router = useRouter()
const searchTerm = ref('')
const selectedFormat = ref('')
const decks = ref([])
const loading = ref(false)
const showDeckModal = ref(false)
const editingDeck = ref(null)
const openMenuId = ref(null)

// Formulario de mazo
const deckForm = reactive({
  name: '',
  format: 'Standard',
  description: ''
})

// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

// Computed
const filteredDecks = computed(() => {
  let filtered = decks.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(deck => 
      deck.name.toLowerCase().includes(search) ||
      deck.description?.toLowerCase().includes(search)
    )
  }

  if (selectedFormat.value) {
    filtered = filtered.filter(deck => deck.format === selectedFormat.value)
  }

  return filtered
})

// Cargar mazos al montar
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await loadDecks()
  }
})

// Funciones
async function loadDecks() {
  loading.value = true
  try {
    // Simular carga de mazos (aquí iría la llamada a la API)
    decks.value = generateMockDecks()
  } catch (error) {
    console.error('Error cargando mazos:', error)
  } finally {
    loading.value = false
  }
}

function generateMockDecks() {
  return [
    {
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
      updatedAt: new Date(Date.now() - 86400000) // 1 día atrás
    },
    {
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
      updatedAt: new Date(Date.now() - 172800000) // 2 días atrás
    }
  ]
}

function createDeck() {
  editingDeck.value = null
  deckForm.name = ''
  deckForm.format = 'Standard'
  deckForm.description = ''
  showDeckModal.value = true
}

function editDeck(deck) {
  editingDeck.value = deck
  deckForm.name = deck.name
  deckForm.format = deck.format
  deckForm.description = deck.description
  showDeckModal.value = true
  openMenuId.value = null
}

function closeDeckModal() {
  showDeckModal.value = false
  editingDeck.value = null
}

function saveDeck() {
  if (editingDeck.value) {
    // Editar mazo existente
    const index = decks.value.findIndex(d => d.id === editingDeck.value.id)
    if (index !== -1) {
      decks.value[index] = {
        ...decks.value[index],
        ...deckForm,
        updatedAt: new Date()
      }
    }
  } else {
    // Crear nuevo mazo
    const newDeck = {
      id: Date.now(),
      ...deckForm,
      totalCards: 0,
      uniqueCards: 0,
      isFavorite: false,
      isLegal: false,
      dominantTypes: [],
      updatedAt: new Date()
    }
    decks.value.unshift(newDeck)
  }
  
  closeDeckModal()
}

function viewDeck(deck) {
  // TODO: Implementar vista detallada del mazo
  router.push(`/decks/${deck.id}`)
}

function toggleFavorite(deck) {
  deck.isFavorite = !deck.isFavorite
}

function toggleMenu(deckId) {
  openMenuId.value = openMenuId.value === deckId ? null : deckId
}

function duplicateDeck(deck) {
  const duplicatedDeck = {
    ...deck,
    id: Date.now(),
    name: `${deck.name} (Copia)`,
    updatedAt: new Date()
  }
  decks.value.unshift(duplicatedDeck)
  openMenuId.value = null
}

function deleteDeck(deck) {
  if (confirm(`¿Estás seguro de eliminar "${deck.name}"?`)) {
    const index = decks.value.findIndex(d => d.id === deck.id)
    if (index !== -1) {
      decks.value.splice(index, 1)
    }
  }
  openMenuId.value = null
}

function formatDate(date) {
  if (!date) return ''
  const now = new Date()
  const diff = now - new Date(date)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  return new Date(date).toLocaleDateString()
}

// Cerrar menú al hacer clic fuera
onMounted(() => {
  document.addEventListener('click', () => {
    openMenuId.value = null
  })
})

// Metadata
useHead({
  title: 'Mis Mazos - TCG Manager',
  meta: [
    { name: 'description', content: 'Construye, organiza y perfecciona tus mazos de Pokémon TCG para competir al más alto nivel.' }
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
</style>
