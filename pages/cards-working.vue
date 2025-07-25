<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        ✅ API que SÍ FUNCIONA
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Mock API local con 10 cartas completamente funcionales
      </p>
      <div class="badge badge-success mt-2">🟢 100% Operativo</div>
    </div>

    <!-- Quick Search -->
    <div class="card bg-white dark:bg-gray-800 shadow-lg mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">🔍 Búsqueda Garantizada</h2>
        <div class="join w-full">
          <input 
            v-model="searchTerm"
            @keyup.enter="searchCards"
            type="text" 
            placeholder="Busca: Pikachu, Charizard, Fire, Psychic, Rare..." 
            class="input input-bordered join-item flex-1"
          />
          <button 
            @click="searchCards" 
            class="btn btn-primary join-item"
            :class="{ loading: loading }"
          >
            {{ loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
        
        <!-- Quick buttons -->
        <div class="flex gap-2 mt-4 flex-wrap">
          <button @click="searchCards('Pikachu')" class="btn btn-sm btn-outline">⚡ Pikachu</button>
          <button @click="searchCards('Charizard')" class="btn btn-sm btn-outline">🔥 Charizard</button>
          <button @click="searchCards('Blastoise')" class="btn btn-sm btn-outline">💧 Blastoise</button>
          <button @click="searchCards('Psychic')" class="btn btn-sm btn-outline">🔮 Psíquicos</button>
          <button @click="getRandomCards()" class="btn btn-sm btn-outline">🎲 Aleatorias</button>
          <button @click="getAllCards()" class="btn btn-sm btn-secondary">📚 Ver Todas</button>
        </div>
        
        <!-- Filters -->
        <div class="flex gap-2 mt-4 flex-wrap">
          <button @click="searchCards('Fire')" class="btn btn-xs btn-error">🔥 Fuego</button>
          <button @click="searchCards('Water')" class="btn btn-xs btn-info">💧 Agua</button>
          <button @click="searchCards('Lightning')" class="btn btn-xs btn-warning">⚡ Eléctrico</button>
          <button @click="searchCards('Grass')" class="btn btn-xs btn-success">🌿 Planta</button>
          <button @click="searchCards('Psychic')" class="btn btn-xs btn-secondary">🔮 Psíquico</button>
          <button @click="searchCards('Rare Holo')" class="btn btn-xs btn-accent">✨ Holo</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="loading loading-spinner loading-lg text-primary"></div>
      <p class="mt-4 text-primary font-semibold">Procesando con Mock API...</p>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="alert alert-success mb-8">
      <div>
        <h3 class="font-bold">✅ {{ successMessage }}</h3>
        <p>API Mock funcionando perfectamente - {{ totalCount }} cartas disponibles</p>
      </div>
    </div>

    <!-- Results -->
    <div v-if="cards.length > 0 && !loading">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">
          📋 {{ totalCount }} cartas encontradas
        </h2>
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-title">Estado API</div>
            <div class="stat-value text-success text-sm">✅ ONLINE</div>
          </div>
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="card in cards" 
          :key="card.id"
          class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-primary"
          @click="selectedCard = card"
        >
          <figure class="px-4 pt-4">
            <img 
              :src="card.images.small" 
              :alt="card.name"
              class="rounded-xl h-64 w-full object-contain bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600"
              loading="lazy"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title text-lg">
              {{ card.name }}
              <div class="badge badge-primary badge-sm">{{ card.hp }} HP</div>
            </h2>
            
            <div class="flex justify-between items-center">
              <span class="badge badge-outline">{{ card.supertype }}</span>
              <span class="badge badge-secondary badge-sm">{{ card.rarity }}</span>
            </div>
            
            <div class="flex gap-1 mt-2 flex-wrap">
              <span 
                v-for="type in card.types" 
                :key="type"
                class="badge badge-sm"
                :class="{
                  'badge-error': type === 'Fire',
                  'badge-info': type === 'Water', 
                  'badge-warning': type === 'Lightning',
                  'badge-success': type === 'Grass',
                  'badge-secondary': type === 'Psychic',
                  'badge-neutral': !['Fire', 'Water', 'Lightning', 'Grass', 'Psychic'].includes(type)
                }"
              >
                {{ getTypeIcon(type) }} {{ type }}
              </span>
            </div>
            
            <div class="text-xs text-gray-500 mt-2">
              Set: {{ card.set.name }} • #{{ card.number }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No results -->
    <div v-if="cards.length === 0 && !loading && searchAttempted" class="text-center py-12">
      <div class="text-6xl mb-4">🤷‍♂️</div>
      <h3 class="text-xl font-bold mb-4">No se encontraron cartas con ese criterio</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Intenta buscar: Pikachu, Charizard, Fire, Water, Rare...
      </p>
      <button @click="getAllCards()" class="btn btn-primary">
        📚 Ver Todas las Cartas
      </button>
    </div>

    <!-- Modal for card details -->
    <div v-if="selectedCard" class="modal modal-open">
      <div class="modal-box max-w-4xl">
        <div class="flex gap-6">
          <!-- Card Image -->
          <div class="flex-shrink-0">
            <img 
              :src="selectedCard.images.large" 
              :alt="selectedCard.name"
              class="w-80 rounded-lg shadow-lg"
            />
          </div>
          
          <!-- Card Details -->
          <div class="space-y-4 flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-2xl">{{ selectedCard.name }}</h4>
                <p class="text-gray-600">{{ selectedCard.supertype }} - {{ selectedCard.subtypes?.join(', ') }}</p>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-primary">{{ selectedCard.hp }} HP</div>
                <div class="badge badge-secondary">{{ selectedCard.rarity }}</div>
              </div>
            </div>
            
            <!-- Types -->
            <div class="flex gap-2">
              <span 
                v-for="type in selectedCard.types" 
                :key="type"
                class="badge badge-lg"
                :class="{
                  'badge-error': type === 'Fire',
                  'badge-info': type === 'Water',
                  'badge-warning': type === 'Lightning', 
                  'badge-success': type === 'Grass',
                  'badge-secondary': type === 'Psychic'
                }"
              >
                {{ getTypeIcon(type) }} {{ type }}
              </span>
            </div>
            
            <!-- Attacks -->
            <div v-if="selectedCard.attacks" class="space-y-3">
              <h5 class="font-bold">⚔️ Ataques:</h5>
              <div 
                v-for="attack in selectedCard.attacks" 
                :key="attack.name"
                class="bg-base-200 p-3 rounded-lg"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold">{{ attack.name }}</span>
                  <span class="badge badge-primary">{{ attack.damage || 'Especial' }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ attack.text }}</p>
                <div class="text-xs mt-1">
                  Costo: {{ attack.cost?.join(', ') || 'Sin costo' }}
                </div>
              </div>
            </div>
            
            <!-- Set Info -->
            <div class="bg-base-200 p-3 rounded-lg">
              <div><strong>Set:</strong> {{ selectedCard.set.name }}</div>
              <div><strong>Serie:</strong> {{ selectedCard.set.series }}</div>
              <div><strong>Número:</strong> {{ selectedCard.number }}/{{ selectedCard.set.total }}</div>
              <div><strong>Artista:</strong> {{ selectedCard.artist }}</div>
              <div><strong>Fecha:</strong> {{ selectedCard.set.releaseDate }}</div>
            </div>
            
            <!-- Flavor Text -->
            <div v-if="selectedCard.flavorText" class="bg-base-200 p-3 rounded-lg">
              <p class="italic text-sm">"{{ selectedCard.flavorText }}"</p>
            </div>
            
            <div class="modal-action">
              <button @click="addToDeck(selectedCard)" class="btn btn-primary">
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
import { MockPokemonAPI } from '~/utils/mockPokemonAPI.js'

// Estados reactivos
const searchTerm = ref('')
const cards = ref([])
const totalCount = ref(0)
const loading = ref(false)
const successMessage = ref(null)
const selectedCard = ref(null)
const searchAttempted = ref(false)

// Funciones
const searchCards = async (term = null) => {
  try {
    loading.value = true
    successMessage.value = null
    searchAttempted.value = true
    
    const query = term || searchTerm.value
    if (term) searchTerm.value = term
    
    console.log(`🔍 Buscando: "${query}" con Mock API`)
    
    const result = await MockPokemonAPI.searchCards(query)
    
    cards.value = result.data
    totalCount.value = result.totalCount
    
    successMessage.value = `Búsqueda completada`
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
    
    console.log(`✅ Encontradas ${result.totalCount} cartas`)
    
  } catch (err) {
    console.error('❌ Error en Mock API:', err)
  } finally {
    loading.value = false
  }
}

const getRandomCards = async () => {
  try {
    loading.value = true
    successMessage.value = null
    
    console.log('🎲 Obteniendo cartas aleatorias...')
    
    const result = await MockPokemonAPI.getRandomCards(8)
    
    cards.value = result.data
    totalCount.value = result.count
    searchTerm.value = 'Cartas Aleatorias'
    
    successMessage.value = 'Cartas aleatorias generadas'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
    
  } catch (err) {
    console.error('❌ Error:', err)
  } finally {
    loading.value = false
  }
}

const getAllCards = async () => {
  try {
    loading.value = true
    successMessage.value = null
    
    const result = await MockPokemonAPI.searchCards('')
    
    cards.value = result.data
    totalCount.value = result.totalCount
    searchTerm.value = 'Todas las Cartas'
    
    successMessage.value = 'Catálogo completo cargado'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
    
  } catch (err) {
    console.error('❌ Error:', err)
  } finally {
    loading.value = false
  }
}

const getTypeIcon = (type) => {
  const icons = {
    Fire: '🔥',
    Water: '💧', 
    Lightning: '⚡',
    Grass: '🌿',
    Psychic: '🔮',
    Fighting: '👊',
    Colorless: '⚪'
  }
  return icons[type] || '⭐'
}

const addToDeck = (card) => {
  // Mostrar toast de éxito
  const toast = useNuxtApp().$toast || console.log
  toast(`✅ ${card.name} agregada al mazo!`)
  
  // Aquí puedes agregar la lógica real para agregar a un mazo
  alert(`¡${card.name} agregada al mazo!\n\nEsta función se conectaría con tu sistema de mazos.`)
}

// Cargar todas las cartas al inicio
onMounted(async () => {
  console.log('🚀 Inicializando Mock API - GARANTIZADO AL 100%')
  await getAllCards()
})

// SEO
useHead({
  title: 'API Funcional - PokéDeck Master',
  meta: [
    {
      name: 'description', 
      content: 'Mock API local de Pokémon TCG que siempre funciona'
    }
  ]
})
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
