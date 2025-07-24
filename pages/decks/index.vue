<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          🎲 Mis Mazos
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gestiona y organiza tus mazos de Pokémon TCG
        </p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="btn btn-primary btn-lg mt-4 md:mt-0"
      >
        <span class="text-xl mr-2">+</span>
        Nuevo Mazo
      </button>
    </div>

    <!-- Filters -->
    <div class="card bg-white dark:bg-gray-800 shadow-lg mb-8">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Buscar</span>
            </label>
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="Nombre del mazo..." 
              class="input input-bordered"
            />
          </div>

          <!-- Format Filter -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Formato</span>
            </label>
            <select v-model="selectedFormat" class="select select-bordered">
              <option value="">Todos los formatos</option>
              <option value="Standard">Standard</option>
              <option value="Expanded">Expanded</option>
              <option value="Unlimited">Unlimited</option>
            </select>
          </div>

          <!-- Sort -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Ordenar por</span>
            </label>
            <select v-model="sortBy" class="select select-bordered">
              <option value="updatedAt">Última modificación</option>
              <option value="createdAt">Fecha de creación</option>
              <option value="name">Nombre</option>
              <option value="totalCards">Número de cartas</option>
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
                ⊞
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="['btn', viewMode === 'list' ? 'btn-active' : '']"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button 
            @click="showOnlyFavorites = !showOnlyFavorites"
            :class="['btn btn-sm', showOnlyFavorites ? 'btn-warning' : 'btn-ghost']"
          >
            ⭐ Solo favoritos
          </button>
          <button 
            @click="clearFilters"
            class="btn btn-sm btn-ghost"
          >
            🗑️ Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredDecks.length === 0 && decksStore.getAllDecks.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">🎲</div>
      <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        ¡Comienza tu aventura!
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Aún no tienes mazos creados. ¡Crea tu primer mazo y empieza a construir estrategias ganadoras!
      </p>
      <button 
        @click="showCreateModal = true"
        class="btn btn-primary btn-lg"
      >
        Crear Mi Primer Mazo
      </button>
    </div>

    <!-- No Results -->
    <div v-else-if="filteredDecks.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        No se encontraron mazos
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Prueba ajustando los filtros o crea un nuevo mazo.
      </p>
      <button 
        @click="clearFilters"
        class="btn btn-ghost mr-4"
      >
        Limpiar Filtros
      </button>
      <button 
        @click="showCreateModal = true"
        class="btn btn-primary"
      >
        Nuevo Mazo
      </button>
    </div>

    <!-- Decks Grid -->
    <div v-else>
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="deck in filteredDecks" 
          :key="deck.id"
          class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
          @click="$router.push(`/decks/${deck.id}`)"
        >
          <div class="card-body">
            <!-- Header -->
            <div class="flex justify-between items-start mb-3">
              <h3 class="card-title text-lg group-hover:text-primary transition-colors">
                {{ deck.name }}
              </h3>
              <div class="dropdown dropdown-end" @click.stop>
                <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                  ⋮
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a @click="editDeck(deck)">✏️ Editar</a></li>
                  <li><a @click="duplicateDeck(deck.id)">📄 Duplicar</a></li>
                  <li><a @click="toggleFavorite(deck.id)">
                    {{ deck.isFavorite ? '💔 Quitar de favoritos' : '⭐ Agregar a favoritos' }}
                  </a></li>
                  <li><a @click="exportDeck(deck)" class="text-info">💾 Exportar</a></li>
                  <li><a @click="confirmDelete(deck)" class="text-error">🗑️ Eliminar</a></li>
                </ul>
              </div>
            </div>

            <!-- Badges -->
            <div class="flex flex-wrap gap-2 mb-3">
              <div class="badge badge-primary">{{ deck.format }}</div>
              <div class="badge badge-ghost">{{ decksStore.getTotalCards(deck.id) }} cartas</div>
              <div v-if="deck.isFavorite" class="badge badge-warning">⭐</div>
            </div>

            <!-- Description -->
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {{ deck.description || 'Sin descripción' }}
            </p>

            <!-- Tags -->
            <div v-if="deck.tags && deck.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
              <span 
                v-for="tag in deck.tags.slice(0, 3)" 
                :key="tag"
                class="badge badge-outline badge-xs"
              >
                {{ tag }}
              </span>
              <span v-if="deck.tags.length > 3" class="badge badge-outline badge-xs">
                +{{ deck.tags.length - 3 }}
              </span>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>{{ formatDate(deck.updatedAt) }}</span>
              <div class="flex gap-2">
                <span>🟦 {{ getCardsByType(deck.id, 'Pokémon').length }}</span>
                <span>⚡ {{ getCardsByType(deck.id, 'Energy').length }}</span>
                <span>🎯 {{ getCardsByType(deck.id, 'Trainer').length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div 
          v-for="deck in filteredDecks" 
          :key="deck.id"
          class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          @click="$router.push(`/decks/${deck.id}`)"
        >
          <div class="card-body py-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <div>
                  <h3 class="font-semibold text-lg">{{ deck.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ deck.description || 'Sin descripción' }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="text-sm text-gray-500">
                  {{ formatDate(deck.updatedAt) }}
                </div>
                <div class="flex gap-2">
                  <div class="badge badge-primary">{{ deck.format }}</div>
                  <div class="badge badge-ghost">{{ decksStore.getTotalCards(deck.id) }}</div>
                  <div v-if="deck.isFavorite" class="badge badge-warning">⭐</div>
                </div>
                <div class="dropdown dropdown-end" @click.stop>
                  <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                    ⋮
                  </label>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a @click="editDeck(deck)">✏️ Editar</a></li>
                    <li><a @click="duplicateDeck(deck.id)">📄 Duplicar</a></li>
                    <li><a @click="toggleFavorite(deck.id)">
                      {{ deck.isFavorite ? '💔 Quitar de favoritos' : '⭐ Agregar a favoritos' }}
                    </a></li>
                    <li><a @click="exportDeck(deck)" class="text-info">💾 Exportar</a></li>
                    <li><a @click="confirmDelete(deck)" class="text-error">🗑️ Eliminar</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <DeckFormModal 
      v-if="showCreateModal || editingDeck"
      :deck="editingDeck"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="deckToDelete" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">¿Eliminar mazo?</h3>
        <p class="py-4">
          ¿Estás seguro de que quieres eliminar el mazo "{{ deckToDelete.name }}"? 
          Esta acción no se puede deshacer.
        </p>
        <div class="modal-action">
          <button @click="deckToDelete = null" class="btn">Cancelar</button>
          <button @click="deleteDeck(deckToDelete.id)" class="btn btn-error">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDecksStore } from '~/stores/decks.store'
import { useAlertStore } from '~/stores/alert.store'
import moment from 'moment'

const decksStore = useDecksStore()
const alertStore = useAlertStore()

// Estados reactivos
const searchTerm = ref('')
const selectedFormat = ref('')
const sortBy = ref('updatedAt')
const viewMode = ref('grid')
const showOnlyFavorites = ref(false)
const showCreateModal = ref(false)
const editingDeck = ref(null)
const deckToDelete = ref(null)

// Cargar mazos al montar
onMounted(() => {
  decksStore.loadDecks()
})

// Mazos filtrados
const filteredDecks = computed(() => {
  let decks = [...decksStore.getAllDecks]
  
  // Filtro de búsqueda
  if (searchTerm.value) {
    decks = decks.filter(deck => 
      deck.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (deck.description && deck.description.toLowerCase().includes(searchTerm.value.toLowerCase()))
    )
  }
  
  // Filtro de formato
  if (selectedFormat.value) {
    decks = decks.filter(deck => deck.format === selectedFormat.value)
  }
  
  // Filtro de favoritos
  if (showOnlyFavorites.value) {
    decks = decks.filter(deck => deck.isFavorite)
  }
  
  // Ordenamiento
  decks.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy.value === 'totalCards') {
      return decksStore.getTotalCards(b.id) - decksStore.getTotalCards(a.id)
    } else {
      return new Date(b[sortBy.value]) - new Date(a[sortBy.value])
    }
  })
  
  return decks
})

// Funciones
const clearFilters = () => {
  searchTerm.value = ''
  selectedFormat.value = ''
  showOnlyFavorites.value = false
  sortBy.value = 'updatedAt'
}

const editDeck = (deck) => {
  editingDeck.value = { ...deck }
}

const closeModal = () => {
  showCreateModal.value = false
  editingDeck.value = null
}

const handleSave = (deckData) => {
  if (editingDeck.value) {
    decksStore.updateDeck(editingDeck.value.id, deckData)
    alertStore.showAlert('success', 'Mazo actualizado correctamente')
  } else {
    decksStore.createDeck(deckData)
    alertStore.showAlert('success', 'Mazo creado correctamente')
  }
  closeModal()
}

const duplicateDeck = (id) => {
  const duplicated = decksStore.duplicateDeck(id)
  if (duplicated) {
    alertStore.showAlert('success', 'Mazo duplicado correctamente')
  }
}

const toggleFavorite = (id) => {
  decksStore.toggleFavorite(id)
}

const confirmDelete = (deck) => {
  deckToDelete.value = deck
}

const deleteDeck = (id) => {
  decksStore.deleteDeck(id)
  deckToDelete.value = null
  alertStore.showAlert('success', 'Mazo eliminado correctamente')
}

const exportDeck = (deck) => {
  const dataStr = JSON.stringify(deck, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${deck.name}.json`
  link.click()
  URL.revokeObjectURL(url)
  alertStore.showAlert('success', 'Mazo exportado correctamente')
}

const formatDate = (dateString) => {
  return moment(dateString).fromNow()
}

const getCardsByType = (deckId, type) => {
  return decksStore.getCardsByType(deckId, type)
}

// SEO
useHead({
  title: 'Mis Mazos - PokéDeck Master',
  meta: [
    {
      name: 'description',
      content: 'Gestiona todos tus mazos de Pokémon TCG en un solo lugar'
    }
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
</style>
