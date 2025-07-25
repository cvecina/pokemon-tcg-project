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
              class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            >
              <span>🎲</span>
              <span>Mis Mazos</span>
            </NuxtLink>
          </div>

          <!-- Usuario -->
          <div class="flex items-center space-x-4">
            <span class="text-sm text-white/80 hidden sm:block">
              Hola, <span class="font-medium text-white">{{ authStore.user?.username }}</span>
            </span>
            <span class="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
              Dashboard
            </span>
            <button 
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Menú de tabs del dashboard -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-1 mb-8">
        <nav class="flex space-x-1">
          <button 
            @click="activeTab = 'cards'"
            :class="activeTab === 'cards' ? 'bg-orange-600 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'"
            class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <span>🃏</span>
            <span>Mis Cartas</span>
          </button>
          <button 
            @click="activeTab = 'decks'"
            :class="activeTab === 'decks' ? 'bg-orange-600 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'"
            class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <span>🎲</span>
            <span>Mis Mazos</span>
          </button>
          <button 
            @click="activeTab = 'add-card'"
            :class="activeTab === 'add-card' ? 'bg-orange-600 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'"
            class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Agregar Carta</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Mis Cartas -->
      <div v-show="activeTab === 'cards'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-white">Mis Cartas</h1>
          <div class="flex items-center space-x-4">
            <!-- Buscador -->
            <div class="relative">
              <input 
                v-model="searchTerm"
                type="text"
                placeholder="Buscar cartas..."
                class="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg class="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <!-- Filtro por tipo -->
            <select 
              v-model="filterType"
              class="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-orange-400"
            >
              <option value="" class="text-black">Todos los tipos</option>
              <option value="Fire" class="text-black">Fuego</option>
              <option value="Water" class="text-black">Agua</option>
              <option value="Grass" class="text-black">Planta</option>
              <option value="Electric" class="text-black">Eléctrico</option>
              <option value="Psychic" class="text-black">Psíquico</option>
              <option value="Fighting" class="text-black">Lucha</option>
              <option value="Darkness" class="text-black">Siniestro</option>
              <option value="Metal" class="text-black">Metal</option>
              <option value="Fairy" class="text-black">Hada</option>
              <option value="Dragon" class="text-black">Dragón</option>
              <option value="Colorless" class="text-black">Incoloro</option>
            </select>
          </div>
        </div>

        <!-- Lista de cartas -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="loading loading-spinner loading-lg"></div>
        </div>

        <div v-else-if="filteredCards.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🃏</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tienes cartas todavía</h3>
          <p class="text-gray-600 mb-4">Comienza agregando algunas cartas a tu colección</p>
          <button 
            @click="activeTab = 'add-card'"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Agregar Primera Carta
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="card in filteredCards" 
            :key="card.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <!-- Imagen de la carta -->
            <div class="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <img 
                v-if="card.images?.small || card.imageUrl"
                :src="card.images?.small || card.imageUrl"
                :alt="card.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="text-4xl">🃏</div>
            </div>

            <!-- Info de la carta -->
            <div class="p-4">
              <h3 class="font-bold text-lg text-gray-900 mb-1">{{ card.name }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ card.setName || 'Set desconocido' }}</p>
              
              <!-- Tipos -->
              <div v-if="card.types?.length" class="flex flex-wrap gap-1 mb-2">
                <span 
                  v-for="type in card.types" 
                  :key="type"
                  class="px-2 py-1 text-xs rounded-full text-white"
                  :class="getTypeColor(type)"
                >
                  {{ type }}
                </span>
              </div>

              <!-- Rareza -->
              <div v-if="card.rarity" class="mb-3">
                <span class="text-xs text-gray-500">Rareza: </span>
                <span class="text-xs font-medium">{{ card.rarity }}</span>
              </div>

              <!-- Acciones -->
              <div class="flex justify-between items-center">
                <button 
                  @click="viewCard(card)"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver Detalles
                </button>
                <div class="flex space-x-2">
                  <button 
                    @click="editCard(card)"
                    class="text-gray-600 hover:text-gray-800"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="deleteCard(card)"
                    class="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mis Mazos -->
      <div v-show="activeTab === 'decks'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Mis Mazos</h1>
          <button 
            @click="createDeck"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Crear Mazo
          </button>
        </div>

        <div class="text-center py-12">
          <div class="text-6xl mb-4">🎴</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Próximamente</h3>
          <p class="text-gray-600">La funcionalidad de mazos estará disponible pronto</p>
        </div>
      </div>

      <!-- Agregar Carta -->
      <div v-show="activeTab === 'add-card'" class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">Agregar Nueva Carta</h1>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <form @submit.prevent="submitCard" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Carta *
                </label>
                <input 
                  v-model="cardForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Pikachu"
                />
              </div>

              <!-- Set -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Set/Colección
                </label>
                <input 
                  v-model="cardForm.setName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Base Set"
                />
              </div>

              <!-- Tipos -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tipos
                </label>
                <select 
                  v-model="cardForm.types"
                  multiple
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Fire">Fuego</option>
                  <option value="Water">Agua</option>
                  <option value="Grass">Planta</option>
                  <option value="Electric">Eléctrico</option>
                  <option value="Psychic">Psíquico</option>
                  <option value="Fighting">Lucha</option>
                  <option value="Darkness">Siniestro</option>
                  <option value="Metal">Metal</option>
                  <option value="Fairy">Hada</option>
                  <option value="Dragon">Dragón</option>
                  <option value="Colorless">Incoloro</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">Mantén Ctrl/Cmd para seleccionar múltiples</p>
              </div>

              <!-- Rareza -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rareza
                </label>
                <select 
                  v-model="cardForm.rarity"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar rareza</option>
                  <option value="Common">Común</option>
                  <option value="Uncommon">Poco Común</option>
                  <option value="Rare">Rara</option>
                  <option value="Rare Holo">Rara Holográfica</option>
                  <option value="Ultra Rare">Ultra Rara</option>
                  <option value="Secret Rare">Secreta</option>
                </select>
              </div>

              <!-- URL de imagen -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  URL de Imagen
                </label>
                <input 
                  v-model="cardForm.imageUrl"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <!-- Descripción -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Descripción/Habilidades
                </label>
                <textarea 
                  v-model="cardForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe las habilidades o características especiales de la carta..."
                ></textarea>
              </div>
            </div>

            <!-- Error y éxito -->
            <div v-if="cardError" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-red-700 text-sm">{{ cardError }}</p>
            </div>

            <div v-if="cardSuccess" class="bg-green-50 border border-green-200 rounded-lg p-3">
              <p class="text-green-700 text-sm">{{ cardSuccess }}</p>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-4">
              <button 
                type="button"
                @click="resetCardForm"
                class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                Limpiar
              </button>
              <button 
                type="submit"
                :disabled="cardLoading"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                <span v-if="cardLoading">Guardando...</span>
                <span v-else>💾 Guardar Carta</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports y stores
const authStore = useAuthStore()
const router = useRouter()

// Estados reactivos
const activeTab = ref('cards')
const loading = ref(false)
const cards = ref([])
const searchTerm = ref('')
const filterType = ref('')

// Formulario de carta
const cardForm = reactive({
  name: '',
  setName: '',
  types: [],
  rarity: '',
  imageUrl: '',
  description: ''
})

const cardLoading = ref(false)
const cardError = ref('')
const cardSuccess = ref('')

// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

// Cargar cartas al montar
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  
  // Obtener tab de la URL si existe
  const route = useRoute()
  const tabFromUrl = route.query.tab
  if (tabFromUrl && ['cards', 'decks', 'add-card'].includes(tabFromUrl)) {
    activeTab.value = tabFromUrl
  }
  
  await loadCards()
})

// Computed para cartas filtradas
const filteredCards = computed(() => {
  // Asegurar que cards.value sea un array
  if (!Array.isArray(cards.value)) {
    return []
  }
  
  let filtered = [...cards.value]
  
  // Filtrar por búsqueda
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(card => 
      card.name.toLowerCase().includes(search) ||
      card.setName?.toLowerCase().includes(search) ||
      card.description?.toLowerCase().includes(search)
    )
  }
  
  // Filtrar por tipo
  if (filterType.value) {
    filtered = filtered.filter(card => 
      card.types?.includes(filterType.value)
    )
  }
  
  return filtered
})

// Funciones
async function loadCards() {
  loading.value = true
  try {
    const response = await $fetch('/api/cards', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    console.log('Respuesta de cartas:', response)
    
    if (response.success && Array.isArray(response.data)) {
      cards.value = response.data
    } else {
      cards.value = []
      console.warn('Respuesta de cartas no válida:', response)
    }
  } catch (error) {
    console.error('Error cargando cartas:', error)
    cards.value = [] // Asegurar que siempre sea un array
  } finally {
    loading.value = false
  }
}

async function submitCard() {
  cardError.value = ''
  cardSuccess.value = ''
  cardLoading.value = true

  try {
    const response = await $fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...cardForm,
        // Preparar datos
        images: cardForm.imageUrl ? { small: cardForm.imageUrl } : null
      }
    })

    if (response.success) {
      cardSuccess.value = 'Carta guardada exitosamente!'
      resetCardForm()
      await loadCards() // Recargar lista
      
      // Cambiar a tab de cartas después de 2 segundos
      setTimeout(() => {
        activeTab.value = 'cards'
        cardSuccess.value = ''
      }, 2000)
    } else {
      cardError.value = response.message || 'Error al guardar la carta'
    }
  } catch (error) {
    cardError.value = 'Error de conexión. Intenta de nuevo.'
    console.error('Error guardando carta:', error)
  } finally {
    cardLoading.value = false
  }
}

function resetCardForm() {
  Object.keys(cardForm).forEach(key => {
    if (Array.isArray(cardForm[key])) {
      cardForm[key] = []
    } else {
      cardForm[key] = ''
    }
  })
}

function getTypeColor(type) {
  const colors = {
    Fire: 'bg-red-500',
    Water: 'bg-blue-500',
    Grass: 'bg-green-500',
    Electric: 'bg-yellow-500',
    Psychic: 'bg-purple-500',
    Fighting: 'bg-orange-500',
    Darkness: 'bg-gray-800',
    Metal: 'bg-gray-500',
    Fairy: 'bg-pink-500',
    Dragon: 'bg-indigo-500',
    Colorless: 'bg-gray-400'
  }
  return colors[type] || 'bg-gray-400'
}

function handleImageError(event) {
  event.target.style.display = 'none'
}

function viewCard(card) {
  // TODO: Implementar modal de detalles
  console.log('Ver carta:', card)
}

function editCard(card) {
  // TODO: Implementar edición
  console.log('Editar carta:', card)
}

async function deleteCard(card) {
  if (!confirm(`¿Estás seguro de eliminar "${card.name}"?`)) return
  
  try {
    const response = await $fetch(`/api/cards/${card.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.success) {
      await loadCards() // Recargar lista
    }
  } catch (error) {
    console.error('Error eliminando carta:', error)
  }
}

function createDeck() {
  // TODO: Implementar creación de mazos
  console.log('Crear mazo')
}

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}

// Metadata
useHead({
  title: 'Dashboard - TCG Manager',
  meta: [
    { name: 'description', content: 'Gestiona tu colección de cartas TCG y construye mazos increíbles.' }
  ]
})
</script>

<style scoped>
/* Animaciones suaves */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
