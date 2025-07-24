<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-6xl max-h-[90vh]">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">🔍 Buscar Cartas</h3>
        <button @click="$emit('close')" class="btn btn-ghost btn-circle">✕</button>
      </div>

      <!-- Search Filters -->
      <div class="card bg-gray-50 dark:bg-gray-700 mb-6">
        <div class="card-body p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <!-- Name Search -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nombre</span>
              </label>
              <input 
                v-model="filters.name"
                @keyup.enter="searchCards"
                type="text" 
                placeholder="Buscar por nombre..." 
                class="input input-bordered input-sm"
              />
            </div>

            <!-- Set Filter -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Set</span>
              </label>
              <select v-model="filters.set" class="select select-bordered select-sm">
                <option value="">Todos los sets</option>
                <option v-for="set in cardsStore.sets" :key="set.id" :value="set.id">
                  {{ set.name }}
                </option>
              </select>
            </div>

            <!-- Type Filter -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Tipo</span>
              </label>
              <select v-model="filters.type" class="select select-bordered select-sm">
                <option value="">Todos los tipos</option>
                <option v-for="type in cardsStore.types" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Supertype Filter -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Supertipo</span>
              </label>
              <select v-model="filters.supertype" class="select select-bordered select-sm">
                <option value="">Todos</option>
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
              <select v-model="filters.rarity" class="select select-bordered select-sm">
                <option value="">Todas las rarezas</option>
                <option v-for="rarity in cardsStore.rarities" :key="rarity" :value="rarity">
                  {{ rarity }}
                </option>
              </select>
            </div>

            <!-- Search Button -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">&nbsp;</span>
              </label>
              <div class="flex gap-2">
                <button @click="searchCards" class="btn btn-primary btn-sm flex-1">
                  🔍 Buscar
                </button>
                <button @click="getRandomCards" class="btn btn-secondary btn-sm">
                  🎲
                </button>
                <button @click="clearFilters" class="btn btn-ghost btn-sm">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="cardsStore.loading" class="text-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
        <p class="mt-4">Buscando cartas...</p>
      </div>

      <!-- Error -->
      <div v-else-if="cardsStore.error" class="alert alert-error">
        <span>{{ cardsStore.error }}</span>
      </div>

      <!-- No Results -->
      <div v-else-if="!cardsStore.hasResults && !cardsStore.loading" class="text-center py-8">
        <div class="text-4xl mb-4">🃏</div>
        <h3 class="text-xl font-bold mb-2">No se encontraron cartas</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Prueba ajustando los filtros de búsqueda.
        </p>
        <button @click="getRandomCards" class="btn btn-secondary">
          Ver Cartas Aleatorias
        </button>
      </div>

      <!-- Results -->
      <div v-else-if="cardsStore.hasResults">
        <!-- Results Info -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ cardsStore.totalCount }} cartas encontradas
          </span>
          <div class="btn-group">
            <button 
              @click="viewMode = 'grid'"
              :class="['btn btn-sm', viewMode === 'grid' ? 'btn-active' : '']"
            >
              ⊞
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="['btn btn-sm', viewMode === 'list' ? 'btn-active' : '']"
            >
              ☰
            </button>
          </div>
        </div>

        <!-- Cards Grid -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div 
            v-for="card in cardsStore.searchResults" 
            :key="card.id"
            class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
          >
            <figure class="px-2 pt-2">
              <img 
                :src="card.images?.small || '/placeholder-card.png'" 
                :alt="card.name"
                class="rounded-lg w-full h-auto group-hover:scale-105 transition-transform"
                @click="showCardDetail(card)"
              />
            </figure>
            <div class="card-body p-3">
              <h4 class="card-title text-xs">{{ card.name }}</h4>
              <div class="flex gap-1 mb-2">
                <div class="badge badge-primary badge-xs">{{ card.supertype }}</div>
                <div v-if="card.rarity" class="badge badge-ghost badge-xs">{{ card.rarity }}</div>
              </div>
              <div class="card-actions">
                <button 
                  @click="addCardToDeck(card)"
                  class="btn btn-primary btn-xs w-full"
                >
                  + Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cards List -->
        <div v-else class="space-y-2 mb-6">
          <div 
            v-for="card in cardsStore.searchResults" 
            :key="card.id"
            class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div class="card-body p-4">
              <div class="flex items-center gap-4">
                <img 
                  :src="card.images?.small || '/placeholder-card.png'" 
                  :alt="card.name"
                  class="w-16 h-auto rounded cursor-pointer"
                  @click="showCardDetail(card)"
                />
                <div class="flex-1">
                  <h4 class="font-semibold">{{ card.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ card.set?.name }} • {{ card.rarity }}
                  </p>
                  <div class="flex gap-2 mt-2">
                    <div class="badge badge-primary badge-sm">{{ card.supertype }}</div>
                    <div v-if="card.types" class="badge badge-ghost badge-sm">
                      {{ card.types.join(', ') }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <button 
                    @click="addCardToDeck(card, 1)"
                    class="btn btn-primary btn-sm"
                  >
                    + 1
                  </button>
                  <button 
                    @click="addCardToDeck(card, 2)"
                    class="btn btn-secondary btn-sm"
                  >
                    + 2
                  </button>
                  <button 
                    @click="addCardToDeck(card, 4)"
                    class="btn btn-accent btn-sm"
                  >
                    + 4
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center gap-2">
          <button 
            @click="cardsStore.prevPage()"
            :disabled="cardsStore.isFirstPage"
            class="btn btn-ghost"
          >
            ← Anterior
          </button>
          
          <span class="btn btn-ghost no-animation">
            {{ cardsStore.currentPage }} / {{ cardsStore.totalPages }}
          </span>
          
          <button 
            @click="cardsStore.nextPage()"
            :disabled="cardsStore.isLastPage"
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
        @add-to-deck="addCardToDeck"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCardsStore } from '~/stores/cards.store'

const emit = defineEmits(['close', 'add-card'])

const cardsStore = useCardsStore()

// Estados reactivos
const viewMode = ref('grid')
const selectedCard = ref(null)

// Filtros de búsqueda
const filters = reactive({
  name: '',
  set: '',
  type: '',
  rarity: '',
  supertype: ''
})

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
  
  // Mostrar cartas aleatorias al inicio
  if (!cardsStore.hasResults) {
    await getRandomCards()
  }
})

// Funciones
const searchCards = async () => {
  const searchFilters = {}
  
  if (filters.name.trim()) searchFilters.name = filters.name.trim()
  if (filters.set) searchFilters.set = filters.set
  if (filters.type) searchFilters.type = filters.type
  if (filters.rarity) searchFilters.rarity = filters.rarity
  if (filters.supertype) searchFilters.supertype = filters.supertype
  
  await cardsStore.searchCards(searchFilters)
}

const getRandomCards = async () => {
  await cardsStore.getRandomCards()
}

const clearFilters = () => {
  filters.name = ''
  filters.set = ''
  filters.type = ''
  filters.rarity = ''
  filters.supertype = ''
  cardsStore.clearResults()
}

const addCardToDeck = (card, quantity = 1) => {
  emit('add-card', card, quantity)
}

const showCardDetail = (card) => {
  selectedCard.value = card
}
</script>
