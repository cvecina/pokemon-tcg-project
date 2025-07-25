<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        🃏 Prueba de Cartas Pokémon
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Conexión directa con la API oficial de Pokémon TCG
      </p>
    </div>

    <!-- Quick Search -->
    <div class="card bg-white dark:bg-gray-800 shadow-lg mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">🔍 Búsqueda Rápida</h2>
        <div class="join w-full">
          <input 
            v-model="searchTerm"
            @keyup.enter="searchPokemon"
            type="text" 
            placeholder="Busca cualquier Pokémon (ej: Pikachu, Charizard, Blastoise)" 
            class="input input-bordered join-item flex-1"
          />
          <button 
            @click="searchPokemon" 
            class="btn btn-primary join-item"
            :class="{ loading: loading }"
          >
            {{ loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
        
        <!-- Quick buttons -->
        <div class="flex gap-2 mt-4 flex-wrap">
          <button @click="searchPokemon('Pikachu')" class="btn btn-sm btn-outline">⚡ Pikachu</button>
          <button @click="searchPokemon('Charizard')" class="btn btn-sm btn-outline">🔥 Charizard</button>
          <button @click="searchPokemon('Blastoise')" class="btn btn-sm btn-outline">💧 Blastoise</button>
          <button @click="searchPokemon('Venusaur')" class="btn btn-sm btn-outline">🌿 Venusaur</button>
          <button @click="getRandomCards()" class="btn btn-sm btn-outline">🎲 Aleatorias</button>
          <button @click="checkApiStatus()" class="btn btn-sm btn-info">📡 Estado API</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="loading loading-spinner loading-lg"></div>
      <p class="mt-4">Conectando con la API de Pokémon TCG...</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="alert alert-error mb-8">
      <div>
        <h3 class="font-bold">❌ Error de Conexión</h3>
        <p>{{ error }}</p>
        <div class="flex gap-2 mt-2">
          <button @click="checkApiStatus" class="btn btn-sm btn-outline">
            🔄 Probar Conexión
          </button>
          <button @click="error = null" class="btn btn-sm btn-ghost">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- API Status -->
    <div v-if="apiStatus" class="alert mb-8" :class="{
      'alert-success': apiStatus.status === 'ok',
      'alert-warning': apiStatus.status === 'warning',
      'alert-info': apiStatus.status === 'info',
      'alert-error': apiStatus.status === 'error'
    }">
      <div>
        <h3 class="font-bold">
          {{ apiStatus.status === 'ok' ? '✅' : 
             apiStatus.status === 'warning' ? '⚠️' : 
             apiStatus.status === 'info' ? 'ℹ️' : '❌' }} Estado de la API
        </h3>
        <p>{{ apiStatus.message }}</p>
      </div>
    </div>

    <!-- No cards message -->
    <div v-if="cards.length === 0 && !loading && !error" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-4">🃏</div>
        <h3 class="text-xl font-bold mb-4">¡Busca tus cartas Pokémon favoritas!</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Usa la búsqueda de arriba o haz clic en uno de los botones de ejemplo para explorar la base de datos oficial de cartas Pokémon TCG.
        </p>
        <button @click="checkApiStatus()" class="btn btn-primary">
          📡 Verificar Estado de la API
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-if="cards.length > 0 && !loading">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">
          Resultados ({{ totalCount }} cartas encontradas)
        </h2>
        <div class="text-sm text-gray-600">
          Mostrando {{ cards.length }} de {{ totalCount }}
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="card in cards" 
          :key="card.id"
          class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
          @click="selectedCard = card"
        >
          <figure class="px-4 pt-4">
            <img 
              :src="card.images.small" 
              :alt="card.name"
              class="rounded-xl w-full h-auto"
              loading="lazy"
            />
          </figure>
          <div class="card-body p-4">
            <h3 class="card-title text-sm">{{ card.name }}</h3>
            <div class="flex gap-1 mb-2">
              <div class="badge badge-primary badge-xs">{{ card.supertype }}</div>
              <div v-if="card.types" class="badge badge-secondary badge-xs">
                {{ card.types.join(', ') }}
              </div>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ card.set.name }} • {{ card.rarity }}
            </p>
            
            <!-- Quick add to deck button -->
            <div class="card-actions justify-end mt-2">
              <button 
                @click.stop="showAddToDeck(card)"
                class="btn btn-primary btn-xs"
              >
                + Agregar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="cards.length < totalCount" class="text-center mt-8">
        <button 
          @click="loadMore()" 
          class="btn btn-outline"
          :class="{ loading: loadingMore }"
        >
          {{ loadingMore ? 'Cargando...' : 'Cargar más cartas' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="cards.length === 0 && !loading && !error" class="text-center py-16">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-2xl font-bold mb-4">Busca cartas de Pokémon</h3>
      <p class="text-gray-600 dark:text-gray-400">
        Usa el buscador para encontrar cualquier carta de la base de datos oficial
      </p>
    </div>

    <!-- Card Detail Modal -->
    <div v-if="selectedCard" class="modal modal-open">
      <div class="modal-box max-w-4xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">{{ selectedCard.name }}</h3>
          <button @click="selectedCard = null" class="btn btn-ghost btn-circle">✕</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Image -->
          <div class="text-center">
            <img 
              :src="selectedCard.images.large || selectedCard.images.small" 
              :alt="selectedCard.name"
              class="max-w-full h-auto rounded-xl mx-auto"
            />
          </div>
          
          <!-- Details -->
          <div class="space-y-4">
            <div>
              <h4 class="font-bold text-lg">{{ selectedCard.name }}</h4>
              <p class="text-gray-600">{{ selectedCard.supertype }}</p>
            </div>
            
            <div v-if="selectedCard.hp" class="stat">
              <div class="stat-title">HP</div>
              <div class="stat-value text-primary">{{ selectedCard.hp }}</div>
            </div>
            
            <div v-if="selectedCard.types" class="flex gap-2">
              <div 
                v-for="type in selectedCard.types" 
                :key="type"
                class="badge badge-secondary"
              >
                {{ type }}
              </div>
            </div>
            
            <div>
              <strong>Set:</strong> {{ selectedCard.set.name }}
            </div>
            <div>
              <strong>Rareza:</strong> {{ selectedCard.rarity }}
            </div>
            <div>
              <strong>Número:</strong> {{ selectedCard.number }}/{{ selectedCard.set.total }}
            </div>
            
            <div v-if="selectedCard.flavorText" class="text-sm italic">
              "{{ selectedCard.flavorText }}"
            </div>
            
            <div class="modal-action">
              <button @click="showAddToDeck(selectedCard)" class="btn btn-primary">
                🃏 Agregar a Mazo
              </button>
              <button @click="selectedCard = null" class="btn btn-ghost">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PokemonTCG from 'pokemon-tcg-sdk-typescript'
import { getBackupCards } from '~/assets/data/backup-cards.js'

// Configurar la API key globalmente
const config = useRuntimeConfig()
if (config.public.pokemonTcgApiKey) {
  // Establecer la API key en las variables de entorno
  if (process.client) {
    window.process = window.process || {}
    window.process.env = window.process.env || {}
    window.process.env.POKEMON_API_KEY = config.public.pokemonTcgApiKey
  } else {
    process.env.POKEMON_API_KEY = config.public.pokemonTcgApiKey
  }
  console.log('🔑 API key configurada')
} else {
  console.log('⚠️ Sin API key - funcionando en modo público')
}

// Estados reactivos
const searchTerm = ref('')
const cards = ref([])
const totalCount = ref(0)
const loading = ref(false)
const loadingMore = ref(false)
const error = ref(null)
const selectedCard = ref(null)
const currentPage = ref(1)
const apiStatus = ref(null)
const pageSize = 12

// Funciones
const searchPokemon = async (term = null, retryCount = 0) => {
  try {
    loading.value = true
    error.value = null
    currentPage.value = 1
    
    const query = term || searchTerm.value
    if (!query) {
      error.value = 'Por favor ingresa un término de búsqueda'
      return
    }
    
    if (term) searchTerm.value = term
    
    console.log(`🔍 Buscando: ${query} (intento ${retryCount + 1})`)
    console.log(config.public.pokemonTcgApiKey ? '🔑 Con API key' : '⚠️ Sin API key')
    
    try {
      const response = await PokemonTCG.Card.where({
        q: `name:*${query}*`,
        page: 1,
        pageSize: pageSize
      })
      
      cards.value = response.data
      totalCount.value = response.totalCount
      
      console.log(`✅ Encontradas ${response.totalCount} cartas desde la API`)
      
    } catch (apiError) {
      console.warn('⚠️ API no disponible, usando cartas de respaldo:', apiError.message)
      
      // Usar cartas de respaldo
      const backupResponse = getBackupCards(query)
      cards.value = backupResponse.data
      totalCount.value = backupResponse.totalCount
      
      // Mostrar mensaje informativo
      apiStatus.value = {
        status: 'warning',
        message: `⚠️ API temporalmente no disponible. Mostrando ${backupResponse.totalCount} cartas de respaldo.`
      }
      
      setTimeout(() => {
        apiStatus.value = null
      }, 8000)
      
      console.log(`📦 Encontradas ${backupResponse.totalCount} cartas de respaldo`)
    }
    
  } catch (err) {
    console.error('Error buscando cartas:', err)
    
    // Reintentar hasta 2 veces si es error de red
    if (retryCount < 2 && (err.code === 'ECONNRESET' || err.code === 'ENOTFOUND' || err.message.includes('504'))) {
      console.log(`🔄 Reintentando en 2 segundos... (${retryCount + 1}/2)`)
      setTimeout(() => {
        searchPokemon(term, retryCount + 1)
      }, 2000)
      return
    }
    
    // Mostrar mensaje de error específico
    if (err.message.includes('504') || err.code === 'ECONNRESET') {
      error.value = '⏱️ La API de Pokémon TCG está experimentando problemas de conectividad. Por favor intenta de nuevo en unos minutos.'
    } else if (err.code === 'ENOTFOUND') {
      error.value = '🌐 Sin conexión a internet. Verifica tu conectividad.'
    } else {
      error.value = `❌ Error conectando con la API: ${err.message}`
    }
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  try {
    loadingMore.value = true
    currentPage.value++
    
    const response = await PokemonTCG.Card.where({
      q: `name:*${searchTerm.value}*`,
      page: currentPage.value,
      pageSize: pageSize
    })
    
    cards.value.push(...response.data)
    
  } catch (err) {
    console.error('Error cargando más cartas:', err)
  } finally {
    loadingMore.value = false
  }
}

const getRandomCards = async (retryCount = 0) => {
  try {
    loading.value = true
    error.value = null
    
    console.log(`🎲 Obteniendo cartas aleatorias... (intento ${retryCount + 1})`)
    
    try {
      const response = await PokemonTCG.Card.where({
        pageSize: pageSize,
        page: Math.floor(Math.random() * 100) + 1 // Página aleatoria
      })
      
      cards.value = response.data
      totalCount.value = response.totalCount
      searchTerm.value = 'Cartas Aleatorias'
      
      console.log(`✅ Cartas aleatorias desde la API: ${response.data.length}`)
      
    } catch (apiError) {
      console.warn('⚠️ API no disponible para cartas aleatorias, usando respaldo:', apiError.message)
      
      // Usar cartas de respaldo aleatorias
      const backupResponse = getBackupCards()
      // Mezclar las cartas de respaldo
      const shuffled = backupResponse.data.sort(() => 0.5 - Math.random())
      
      cards.value = shuffled
      totalCount.value = shuffled.length
      searchTerm.value = 'Cartas Aleatorias (Respaldo)'
      
      // Mostrar mensaje informativo
      apiStatus.value = {
        status: 'warning',
        message: `⚠️ API temporalmente no disponible. Mostrando ${shuffled.length} cartas de respaldo aleatorias.`
      }
      
      setTimeout(() => {
        apiStatus.value = null
      }, 8000)
      
      console.log(`📦 Cartas aleatorias de respaldo: ${shuffled.length}`)
    }
    
  } catch (err) {
    console.error('Error obteniendo cartas aleatorias:', err)
    
    // Reintentar hasta 2 veces si es error de red
    if (retryCount < 2 && (err.code === 'ECONNRESET' || err.code === 'ENOTFOUND' || err.message.includes('504'))) {
      console.log(`🔄 Reintentando cartas aleatorias en 2 segundos... (${retryCount + 1}/2)`)
      setTimeout(() => {
        getRandomCards(retryCount + 1)
      }, 2000)
      return
    }
    
    if (err.message.includes('504') || err.code === 'ECONNRESET') {
      error.value = '⏱️ La API de Pokémon TCG está experimentando problemas de conectividad. Por favor intenta de nuevo en unos minutos.'
    } else {
      error.value = `❌ Error obteniendo cartas aleatorias: ${err.message}`
    }
  } finally {
    loading.value = false
  }
}

const showAddToDeck = (card) => {
  alert(`¡Función próximamente! 
  
Carta: ${card.name}
Para agregar cartas a mazos:
1. Ve a /decks
2. Crea un nuevo mazo  
3. Haz clic en "Agregar Cartas"
4. Busca y agrega cartas como esta`)
}

const checkApiStatus = async () => {
  try {
    apiStatus.value = { status: 'checking', message: 'Verificando estado de la API...' }
    
    const response = await PokemonTCG.Card.where({
      pageSize: 1,
      page: 1
    })
    
    if (response.data && response.data.length > 0) {
      apiStatus.value = { 
        status: 'ok', 
        message: `✅ API funcionando correctamente. Última carta: ${response.data[0].name}` 
      }
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        apiStatus.value = null
      }, 5000)
    } else {
      apiStatus.value = { 
        status: 'warning', 
        message: '⚠️ API responde pero sin datos. Intenta de nuevo más tarde.' 
      }
    }
  } catch (err) {
    console.error('Error verificando API:', err)
    apiStatus.value = { 
      status: 'error', 
      message: `❌ Error al conectar con la API: ${err.message}` 
    }
  }
}

// Cargar estado inicial - mostrar cartas de respaldo y verificar API
onMounted(async () => {
  console.log('🃏 Página de prueba de cartas cargada')
  console.log(config.public.pokemonTcgApiKey ? '🔑 API key configurada' : '⚠️ Funcionando sin API key')
  
  // Cargar cartas de respaldo inmediatamente para mejor UX
  const backupResponse = getBackupCards()
  cards.value = backupResponse.data
  totalCount.value = backupResponse.totalCount
  searchTerm.value = 'Cartas Destacadas'
  
  // Mostrar mensaje informativo
  apiStatus.value = {
    status: 'info',
    message: '📦 Mostrando cartas de ejemplo. Haz clic en "Estado API" para verificar conectividad.'
  }
  
  setTimeout(() => {
    apiStatus.value = null
  }, 8000)
  
  console.log(`📦 Cartas de respaldo cargadas: ${backupResponse.totalCount}`)
})

// SEO
useHead({
  title: 'Prueba de Cartas Pokémon - PokéDeck Master',
  meta: [
    {
      name: 'description', 
      content: 'Prueba la conexión con la API oficial de Pokémon TCG y busca cartas reales'
    }
  ]
})
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
