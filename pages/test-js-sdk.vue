<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        🃏 Test con SDK JavaScript Original
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Usando pokemontcgsdk (JavaScript) en lugar de pokemon-tcg-sdk-typescript
      </p>
    </div>

    <!-- API Status Banner -->
    <div v-if="!pokemon" class="alert alert-warning mb-8">
      <div>
        <h3 class="font-bold">⚠️ Modo Sin Conexión</h3>
        <p>La API de Pokémon TCG no está disponible. Mostrando datos de respaldo.</p>
      </div>
    </div>

    <!-- Quick Search -->
    <div class="card bg-white dark:bg-gray-800 shadow-lg mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">🔍 Búsqueda con SDK JavaScript</h2>
        <div class="join w-full">
          <input 
            v-model="searchTerm"
            @keyup.enter="searchPokemon"
            type="text" 
            placeholder="Busca cualquier Pokémon (ej: Pikachu, Charizard)" 
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
          <button @click="getRandomCards()" class="btn btn-sm btn-outline">🎲 Aleatorias</button>
          <button @click="testApiConnection()" class="btn btn-sm btn-info">📡 Test API</button>
          <button @click="useBackupData('', true)" class="btn btn-sm btn-secondary">📦 Respaldo</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="loading loading-spinner loading-lg"></div>
      <p class="mt-4">Conectando con la API usando SDK JavaScript...</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="alert alert-error mb-8">
      <div>
        <h3 class="font-bold">❌ Error</h3>
        <p>{{ error }}</p>
        <button @click="error = null" class="btn btn-sm btn-ghost mt-2">
          Cerrar
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="alert alert-success mb-8">
      <div>
        <h3 class="font-bold">✅ Éxito</h3>
        <p>{{ successMessage }}</p>
      </div>
    </div>

    <!-- Results -->
    <div v-if="cards.length > 0 && !loading">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">
          Resultados ({{ totalCount }} cartas encontradas)
        </h2>
        <div class="text-sm text-gray-600">
          SDK: {{ sdkUsed }}
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
              :src="card.images?.small || card.imageUrl" 
              :alt="card.name"
              class="rounded-xl h-64 w-full object-contain"
              @error="handleImageError"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title text-lg">{{ card.name }}</h2>
            <div class="flex justify-between items-center">
              <span class="badge badge-secondary">{{ card.supertype }}</span>
              <span v-if="card.hp" class="text-sm font-bold">{{ card.hp }} HP</span>
            </div>
            <div v-if="card.types" class="flex gap-1 mt-2">
              <span 
                v-for="type in card.types" 
                :key="type"
                class="badge badge-outline badge-xs"
              >
                {{ type }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No results -->
    <div v-if="cards.length === 0 && !loading && !error && searchAttempted" class="text-center py-12">
      <div class="text-6xl mb-4">🤷‍♂️</div>
      <h3 class="text-xl font-bold mb-4">No se encontraron cartas</h3>
      <p class="text-gray-600 dark:text-gray-400">
        Intenta con otro término de búsqueda
      </p>
    </div>

    <!-- Modal for card details -->
    <div v-if="selectedCard" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <div class="flex gap-6">
          <!-- Card Image -->
          <div class="flex-shrink-0">
            <img 
              :src="selectedCard.images?.large || selectedCard.imageUrlHiRes || selectedCard.images?.small || selectedCard.imageUrl" 
              :alt="selectedCard.name"
              class="w-64 rounded-lg"
            />
          </div>
          
          <!-- Card Details -->
          <div class="space-y-4 flex-1">
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
            
            <div v-if="selectedCard.set">
              <strong>Set:</strong> {{ selectedCard.set.name || selectedCard.set }}
            </div>
            <div v-if="selectedCard.rarity">
              <strong>Rareza:</strong> {{ selectedCard.rarity }}
            </div>
            <div v-if="selectedCard.number">
              <strong>Número:</strong> {{ selectedCard.number }}{{ selectedCard.set?.total ? `/${selectedCard.set.total}` : '' }}
            </div>
            
            <div class="modal-action">
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

// Estados reactivos
const searchTerm = ref('')
const cards = ref([])
const totalCount = ref(0)
const loading = ref(false)
const error = ref(null)
const successMessage = ref(null)
const selectedCard = ref(null)
const searchAttempted = ref(false)
const sdkUsed = ref('pokemontcgsdk (JavaScript)')

// Configuración de la API
const config = useRuntimeConfig()
let pokemon

// Inicializar el SDK
const initializeSDK = () => {
  try {
    // Importar el SDK JavaScript
    if (process.client) {
      import('pokemontcgsdk').then((module) => {
        pokemon = module.default
        console.log('✅ SDK JavaScript inicializado')
        
        // Configurar API key si está disponible
        if (config.public.pokemonTcgApiKey) {
          pokemon.configure({ apiKey: config.public.pokemonTcgApiKey })
          console.log('🔑 API key configurada')
        }
      }).catch((err) => {
        console.error('❌ Error importando SDK:', err)
        error.value = 'Error cargando el SDK de Pokémon TCG'
      })
    }
  } catch (err) {
    console.error('❌ Error inicializando SDK:', err)
    error.value = 'Error inicializando el SDK'
  }
}

// Funciones
const searchPokemon = async (term = null, retryCount = 0) => {
  try {
    loading.value = true
    error.value = null
    successMessage.value = null
    searchAttempted.value = true
    
    const query = term || searchTerm.value
    if (!query) {
      error.value = 'Por favor ingresa un término de búsqueda'
      return
    }
    
    if (term) searchTerm.value = term
    
    console.log(`🔍 Buscando: ${query} con SDK JavaScript (intento ${retryCount + 1})`)
    
    // Verificar si el SDK está inicializado
    if (!pokemon) {
      console.warn('⚠️ SDK no inicializado, usando datos de respaldo')
      useBackupData(query)
      return
    }

    try {
      const result = await pokemon.card.where({ q: `name:*${query}*` })
      
      cards.value = result.cards || []
      totalCount.value = result.cards?.length || 0
      
      if (cards.value.length > 0) {
        successMessage.value = `✅ Encontradas ${totalCount.value} cartas usando SDK JavaScript`
        setTimeout(() => {
          successMessage.value = null
        }, 5000)
      }
      
      console.log(`✅ Encontradas ${totalCount.value} cartas con API`)
      
    } catch (apiError) {
      console.warn('⚠️ Error con API, usando datos de respaldo:', apiError.message)
      
      // Reintentar una vez más antes de usar respaldo
      if (retryCount < 1) {
        console.log('🔄 Reintentando en 2 segundos...')
        setTimeout(() => {
          searchPokemon(term, retryCount + 1)
        }, 2000)
        return
      }
      
      // Usar datos de respaldo
      useBackupData(query)
    }
    
  } catch (err) {
    console.error('❌ Error general:', err)
    
    if (retryCount < 1) {
      console.log('🔄 Reintentando búsqueda...')
      setTimeout(() => {
        searchPokemon(term, retryCount + 1)
      }, 2000)
      return
    }
    
    // Usar datos de respaldo como último recurso
    useBackupData(term || searchTerm.value)
  } finally {
    loading.value = false
  }
}

const getRandomCards = async (retryCount = 0) => {
  try {
    loading.value = true
    error.value = null
    successMessage.value = null
    
    console.log(`🎲 Obteniendo cartas aleatorias con SDK JavaScript (intento ${retryCount + 1})`)
    
    if (!pokemon) {
      console.warn('⚠️ SDK no inicializado, usando datos de respaldo aleatorios')
      useBackupData('', true)
      return
    }

    try {
      const result = await pokemon.card.all({ page: Math.floor(Math.random() * 100) + 1 })
      
      cards.value = result.cards || []
      totalCount.value = result.cards?.length || 0
      searchTerm.value = 'Cartas Aleatorias (JS SDK)'
      
      if (cards.value.length > 0) {
        successMessage.value = `✅ Cartas aleatorias obtenidas usando SDK JavaScript`
        setTimeout(() => {
          successMessage.value = null
        }, 5000)
      }
      
    } catch (apiError) {
      console.warn('⚠️ Error con API para cartas aleatorias:', apiError.message)
      
      if (retryCount < 1) {
        setTimeout(() => {
          getRandomCards(retryCount + 1)
        }, 2000)
        return
      }
      
      useBackupData('', true)
    }
    
  } catch (err) {
    console.error('❌ Error obteniendo cartas aleatorias:', err)
    
    if (retryCount < 1) {
      setTimeout(() => {
        getRandomCards(retryCount + 1)
      }, 2000)
      return
    }
    
    useBackupData('', true)
  } finally {
    loading.value = false
  }
}

const testApiConnection = async () => {
  try {
    loading.value = true
    error.value = null
    successMessage.value = null
    
    console.log('📡 Probando conexión API con SDK JavaScript...')
    
    if (!pokemon) {
      error.value = '❌ SDK JavaScript no está inicializado'
      return
    }
    
    const result = await pokemon.card.where({ pageSize: 1 })
    
    if (result.cards && result.cards.length > 0) {
      successMessage.value = `✅ API funcionando! Test exitoso con: ${result.cards[0].name}`
      setTimeout(() => {
        successMessage.value = null
      }, 5000)
    } else {
      error.value = '⚠️ API responde pero sin datos'
    }
    
  } catch (err) {
    console.error('❌ Error en test de API:', err)
    error.value = `❌ API no disponible: ${err.message}. La aplicación funcionará con datos de respaldo.`
  } finally {
    loading.value = false
  }
}

// Función para usar datos de respaldo
const useBackupData = (query = '', isRandom = false) => {
  console.log('📦 Usando datos de respaldo')
  
  // Datos de respaldo simples para el SDK JavaScript
  const backupCards = [
    {
      id: "base1-4",
      name: "Charizard",
      supertype: "Pokémon",
      hp: "120",
      types: ["Fire"],
      rarity: "Rare Holo",
      number: "4",
      set: { name: "Base Set", total: "102" },
      images: { 
        small: "https://images.pokemontcg.io/base1/4.png",
        large: "https://images.pokemontcg.io/base1/4_hires.png"
      }
    },
    {
      id: "base1-58",
      name: "Pikachu", 
      supertype: "Pokémon",
      hp: "40",
      types: ["Lightning"],
      rarity: "Common",
      number: "58",
      set: { name: "Base Set", total: "102" },
      images: {
        small: "https://images.pokemontcg.io/base1/58.png",
        large: "https://images.pokemontcg.io/base1/58_hires.png"
      }
    },
    {
      id: "base1-2",
      name: "Blastoise",
      supertype: "Pokémon", 
      hp: "100",
      types: ["Water"],
      rarity: "Rare Holo",
      number: "2",
      set: { name: "Base Set", total: "102" },
      images: {
        small: "https://images.pokemontcg.io/base1/2.png",
        large: "https://images.pokemontcg.io/base1/2_hires.png"
      }
    },
    {
      id: "base1-15",
      name: "Venusaur",
      supertype: "Pokémon",
      hp: "100", 
      types: ["Grass"],
      rarity: "Rare Holo",
      number: "15",
      set: { name: "Base Set", total: "102" },
      images: {
        small: "https://images.pokemontcg.io/base1/15.png",
        large: "https://images.pokemontcg.io/base1/15_hires.png"
      }
    }
  ]
  
  let filteredCards = backupCards
  
  if (isRandom) {
    // Mezclar cartas para aleatorias
    filteredCards = [...backupCards].sort(() => 0.5 - Math.random())
    searchTerm.value = 'Cartas de Respaldo (Aleatorias)'
  } else if (query) {
    // Filtrar por búsqueda
    filteredCards = backupCards.filter(card => 
      card.name.toLowerCase().includes(query.toLowerCase()) ||
      card.types.some(type => type.toLowerCase().includes(query.toLowerCase()))
    )
  } else {
    searchTerm.value = 'Cartas de Respaldo'
  }
  
  cards.value = filteredCards
  totalCount.value = filteredCards.length
  sdkUsed.value = 'Datos de Respaldo (API no disponible)'
  
  successMessage.value = `📦 Mostrando ${filteredCards.length} cartas de respaldo. La API no está disponible temporalmente.`
  setTimeout(() => {
    successMessage.value = null
  }, 8000)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/200x280/cccccc/666666?text=Sin+Imagen'
}

// Inicializar al montar
onMounted(() => {
  console.log('🚀 Inicializando página con SDK JavaScript')
  
  // Mostrar datos de respaldo inmediatamente para mejor UX
  useBackupData()
  
  // Intentar inicializar el SDK en segundo plano
  initializeSDK()
})

// SEO
useHead({
  title: 'Test SDK JavaScript - PokéDeck Master',
  meta: [
    {
      name: 'description', 
      content: 'Prueba del SDK JavaScript original de Pokémon TCG'
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
