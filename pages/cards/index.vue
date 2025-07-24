<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        🔍 Explorar Cartas
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Descubre todas las cartas de Pokémon TCG
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="card bg-white dark:bg-gray-800 shadow-lg mb-8">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <!-- Name Search -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Buscar por nombre</span>
            </label>
            <div class="join">
              <input 
                v-model="filters.name"
                @keyup.enter="searchCards"
                type="text" 
                placeholder="Ej: Pikachu, Charizard..." 
                class="input input-bordered join-item flex-1"
              />
              <button @click="searchCards" class="btn btn-primary join-item">
                🔍
              </button>
            </div>
          </div>

          <!-- Set Filter -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Set</span>
            </label>
            <select v-model="filters.set" class="select select-bordered">
              <option value="">Todos los sets</option>
              <option v-for="set in cardsStore.sets.slice(0, 20)" :key="set.id" :value="set.id">
                {{ set.name }}
              </option>
            </select>
          </div>

          <!-- Type Filter -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Tipo</span>
            </label>
            <select v-model="filters.type" class="select select-bordered">
              <option value="">Todos los tipos</option>
              <option v-for="type in cardsStore.types" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Supertype Filter -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Categoría</span>
            </label>
            <select v-model="filters.supertype" class="select select-bordered">
              <option value="">Todas</option>
              <option value="Pokémon">Pokémon</option>
              <option value="Trainer">Entrenador</option>
              <option value="Energy">Energía</option>
            </select>
          </div>

          <!-- Rarity Filter -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Rareza</span>
            </label>
            <select v-model="filters.rarity" class="select select-bordered">
              <option value="">Todas</option>
              <option v-for="rarity in popularRarities" :key="rarity" :value="rarity">
                {{ rarity }}
              </option>
            </select>
          </div>

          <!-- View Mode -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Vista</span>
            </label>
            <div class="btn-group">
              <button 
                @click="viewMode = 'grid'"
                :class="['btn', viewMode === 'grid' ? 'btn-active' : '']"
              >
                ⊞ Grid
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="['btn', viewMode === 'list' ? 'btn-active' : '']"
              >
                ☰ Lista
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Acciones</span>
            </label>
            <div class="flex gap-2">
              <button @click="getRandomCards" class="btn btn-secondary flex-1">
                🎲 Aleatorio
              </button>
              <button @click="clearFilters" class="btn btn-ghost">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Filters -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button 
        @click="quickFilter('Pokémon')"
        class="btn btn-sm btn-outline"
      >
        🟦 Pokémon
      </button>
      <button 
        @click="quickFilter('Trainer')"
        class="btn btn-sm btn-outline"
      >
        🎯 Entrenadores
      </button>
      <button 
        @click="quickFilter('Energy')"
        class="btn btn-sm btn-outline"
      >
        ⚡ Energías
      </button>
      <button 
        @click="quickFilter('Rare')"
        class="btn btn-sm btn-outline"
      >
        💎 Raras
      </button>
      <button 
        @click="quickFilter('Ultra Rare')"
        class="btn btn-sm btn-outline"
      >
        ✨ Ultra Raras
      </button>
    </div>

    <!-- Loading -->
    <div v-if="cardsStore.loading" class="text-center py-16">
      <span class="loading loading-spinner loading-lg"></span>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Buscando cartas...</p>
    </div>

    <!-- Error -->
    <div v-else-if="cardsStore.error" class="alert alert-error">
      <span>{{ cardsStore.error }}</span>
      <button @click="getRandomCards" class="btn btn-sm">Reintentar</button>
    </div>

    <!-- No Results -->
    <div v-else-if="!cardsStore.hasResults && searchPerformed" class="text-center py-16">
      <div class="text-6xl mb-4">🃏</div>
      <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        No se encontraron cartas
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Prueba ajustando los filtros de búsqueda o explora cartas aleatorias.
      </p>
      <div class="flex gap-4 justify-center">
        <button @click="clearFilters" class="btn btn-ghost">
          Limpiar Filtros
        </button>
        <button @click="getRandomCards" class="btn btn-secondary">
          Ver Cartas Aleatorias
        </button>
      </div>
    </div>

    <!-- Welcome message -->
    <div v-else-if="!cardsStore.hasResults && !searchPerformed" class="text-center py-16">
      <div class="text-6xl mb-4">🎲</div>
      <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        ¡Explora el mundo de Pokémon TCG!
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Usa los filtros de arriba para buscar cartas específicas o descubre cartas aleatorias.
      </p>
      <button @click="getRandomCards" class="btn btn-primary btn-lg">
        Comenzar Exploración
      </button>
    </div>

    <!-- Results -->
    <div v-else>
      <!-- Results Info -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span class="text-lg font-semibold">{{ cardsStore.totalCount }} cartas encontradas</span>
          <span v-if="cardsStore.lastQuery" class="text-sm text-gray-600 dark:text-gray-400 block">
            Búsqueda: {{ cardsStore.lastQuery === 'random' ? 'Aleatorio' : cardsStore.lastQuery }}
          </span>
        </div>
        
        <div class="flex gap-2">
          <select v-model="sortBy" @change="applySorting" class="select select-bordered select-sm">
            <option value="name">Nombre A-Z</option>
            <option value="-name">Nombre Z-A</option>
            <option value="set.releaseDate">Más antiguos</option>
            <option value="-set.releaseDate">Más recientes</option>
            <option value="number">Número</option>
          </select>
        </div>
      </div>

      <!-- Cards Grid View -->
      <div v-if="viewMode === 'grid'">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          <div 
            v-for="card in sortedCards" 
            :key="card.id"
            class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
          >
            <figure class="px-2 pt-2">
              <img 
                :src="card.images?.small || '/placeholder-card.png'" 
                :alt="card.name"
                class="rounded-lg w-full h-auto group-hover:scale-105 transition-transform"
                @click="showCardDetail(card)"
                loading="lazy"
              />
            </figure>
            <div class="card-body p-3">
              <h4 class="card-title text-xs truncate" :title="card.name">{{ card.name }}</h4>
              <div class="flex flex-wrap gap-1 mb-2">
                <div class="badge badge-primary badge-xs">{{ card.supertype }}</div>
                <div v-if="card.rarity" class="badge badge-ghost badge-xs">{{ card.rarity }}</div>
              </div>
              <div class="card-actions">
                <button 
                  @click="showCardDetail(card)"
                  class="btn btn-primary btn-xs w-full"
                >
                  Ver Detalle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards List View -->
      <div v-else class="space-y-3 mb-8">
        <div 
          v-for="card in sortedCards" 
          :key="card.id"
          class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          @click="showCardDetail(card)"
        >
          <div class="card-body p-4">
            <div class="flex items-center gap-4">
              <img 
                :src="card.images?.small || '/placeholder-card.png'" 
                :alt="card.name"
                class="w-16 h-auto rounded"
                loading="lazy"
              />
              <div class="flex-1">
                <h4 class="font-semibold text-lg">{{ card.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ card.set?.name }}
                  <span v-if="card.number"> • #{{ card.number }}</span>
                  <span v-if="card.rarity"> • {{ card.rarity }}</span>
                </p>
                <div class="flex gap-2 mt-2">
                  <div class="badge badge-primary badge-sm">{{ card.supertype }}</div>
                  <div v-if="card.types && card.types.length > 0" class="badge badge-ghost badge-sm">
                    {{ card.types.join(', ') }}
                  </div>
                  <div v-if="card.hp" class="badge badge-error badge-sm">
                    {{ card.hp }} HP
                  </div>
                </div>
              </div>
              <div class="text-right">
                <button class="btn btn-primary btn-sm">
                  Ver Detalle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-4">
        <button 
          @click="cardsStore.prevPage()"
          :disabled="cardsStore.isFirstPage || cardsStore.loading"
          class="btn btn-ghost"
        >
          ← Anterior
        </button>
        
        <div class="flex items-center gap-2">
          <span class="text-sm">Página</span>
          <span class="font-bold">{{ cardsStore.currentPage }}</span>
          <span class="text-sm">de</span>
          <span class="font-bold">{{ cardsStore.totalPages }}</span>
        </div>
        
        <button 
          @click="cardsStore.nextPage()"
          :disabled="cardsStore.isLastPage || cardsStore.loading"
          class="btn btn-ghost"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Card Detail Modal -->
    <CardDetailModal 
      v-if="selectedCard"
      :card="selectedCard"
      @close="selectedCard = null"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useCardsStore } from '~/stores/cards.store'

const cardsStore = useCardsStore()

// Estados reactivos
const viewMode = ref('grid')
const selectedCard = ref(null)
const searchPerformed = ref(false)
const sortBy = ref('name')

// Filtros de búsqueda
const filters = reactive({
  name: '',
  set: '',
  type: '',
  rarity: '',
  supertype: ''
})

// Rarezas populares para el filtro
const popularRarities = [
  'Common', 'Uncommon', 'Rare', 'Rare Holo', 'Rare Ultra', 
  'Double Rare', 'Ultra Rare', 'Secret Rare', 'Radiant Rare'
]

// Cargar datos iniciales
onMounted(async () => {
  if (cardsStore.sets.length === 0) {
    await cardsStore.loadSets()
  }
  if (cardsStore.types.length === 0) {
    await cardsStore.loadTypes()
  }
  if (cardsStore.rarities.length === 0) {
    await cardsStore.loadRarities()
  }
})

// Cartas ordenadas
const sortedCards = computed(() => {
  let cards = [...cardsStore.searchResults]
  
  switch (sortBy.value) {
    case 'name':
      cards.sort((a, b) => a.name.localeCompare(b.name))
      break
    case '-name':
      cards.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'set.releaseDate':
      cards.sort((a, b) => new Date(a.set?.releaseDate || '1900-01-01') - new Date(b.set?.releaseDate || '1900-01-01'))
      break
    case '-set.releaseDate':
      cards.sort((a, b) => new Date(b.set?.releaseDate || '1900-01-01') - new Date(a.set?.releaseDate || '1900-01-01'))
      break
    case 'number':
      cards.sort((a, b) => {
        const numA = parseInt(a.number) || 0
        const numB = parseInt(b.number) || 0
        return numA - numB
      })
      break
  }
  
  return cards
})

// Watchers para filtros automáticos
watch(() => [filters.set, filters.type, filters.supertype, filters.rarity], () => {
  if (searchPerformed.value) {
    searchCards()
  }
}, { deep: true })

// Funciones
const searchCards = async () => {
  const searchFilters = {}
  
  if (filters.name.trim()) searchFilters.name = filters.name.trim()
  if (filters.set) searchFilters.set = filters.set
  if (filters.type) searchFilters.type = filters.type
  if (filters.rarity) searchFilters.rarity = filters.rarity
  if (filters.supertype) searchFilters.supertype = filters.supertype
  
  await cardsStore.searchCards(searchFilters)
  searchPerformed.value = true
}

const getRandomCards = async () => {
  await cardsStore.getRandomCards(24)
  searchPerformed.value = true
}

const clearFilters = () => {
  filters.name = ''
  filters.set = ''
  filters.type = ''
  filters.rarity = ''
  filters.supertype = ''
  cardsStore.clearResults()
  searchPerformed.value = false
}

const quickFilter = (value) => {
  if (['Pokémon', 'Trainer', 'Energy'].includes(value)) {
    filters.supertype = value
  } else {
    filters.rarity = value
    filters.supertype = ''
  }
  searchCards()
}

const applySorting = () => {
  // El computed sortedCards se actualiza automáticamente
}

const showCardDetail = (card) => {
  selectedCard.value = card
}

// SEO
useHead({
  title: 'Explorar Cartas - PokéDeck Master',
  meta: [
    {
      name: 'description',
      content: 'Explora todas las cartas de Pokémon TCG. Busca, filtra y descubre nuevas cartas para tus mazos.'
    }
  ]
})
</script>
