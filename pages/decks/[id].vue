<template>
  <div v-if="deck" class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="btn btn-ghost btn-circle">
          ←
        </button>
        <div>
          <div class="flex items-center gap-2 mb-2">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
              {{ deck.name }}
            </h1>
            <button 
              @click="toggleFavorite"
              :class="['btn btn-ghost btn-circle', deck.isFavorite ? 'text-yellow-500' : 'text-gray-400']"
            >
              ⭐
            </button>
          </div>
          <div class="flex gap-2 mb-2">
            <div class="badge badge-primary">{{ deck.format }}</div>
            <div class="badge badge-ghost">{{ totalCards }} cartas</div>
            <div v-if="deck.tags && deck.tags.length > 0" class="flex gap-1">
              <span 
                v-for="tag in deck.tags.slice(0, 3)" 
                :key="tag"
                class="badge badge-outline badge-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <p v-if="deck.description" class="text-gray-600 dark:text-gray-400">
            {{ deck.description }}
          </p>
        </div>
      </div>
      
      <div class="flex gap-2 mt-4 md:mt-0">
        <button @click="showSearchModal = true" class="btn btn-primary">
          + Agregar Cartas
        </button>
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost">
            ⋮
          </label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a @click="editDeck">✏️ Editar mazo</a></li>
            <li><a @click="duplicateDeck">📄 Duplicar</a></li>
            <li><a @click="exportDeck" class="text-info">💾 Exportar</a></li>
            <li><a @click="clearDeck" class="text-warning">🗑️ Vaciar mazo</a></li>
            <li><a @click="deleteDeck" class="text-error">❌ Eliminar mazo</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="stat bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div class="stat-figure text-primary">
          <span class="text-2xl">🟦</span>
        </div>
        <div class="stat-title">Pokémon</div>
        <div class="stat-value text-primary">{{ pokemonCards.length }}</div>
        <div class="stat-desc">{{ pokemonCount }} cartas</div>
      </div>

      <div class="stat bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div class="stat-figure text-secondary">
          <span class="text-2xl">🎯</span>
        </div>
        <div class="stat-title">Entrenadores</div>
        <div class="stat-value text-secondary">{{ trainerCards.length }}</div>
        <div class="stat-desc">{{ trainerCount }} cartas</div>
      </div>

      <div class="stat bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div class="stat-figure text-accent">
          <span class="text-2xl">⚡</span>
        </div>
        <div class="stat-title">Energías</div>
        <div class="stat-value text-accent">{{ energyCards.length }}</div>
        <div class="stat-desc">{{ energyCount }} cartas</div>
      </div>

      <div class="stat bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div class="stat-figure text-info">
          <span class="text-2xl">📊</span>
        </div>
        <div class="stat-title">Total</div>
        <div class="stat-value text-info">{{ totalCards }}</div>
        <div class="stat-desc">{{ totalCards }}/60 cartas</div>
      </div>
    </div>

    <!-- Deck Validation -->
    <div v-if="validationIssues.length > 0" class="alert alert-warning mb-6">
      <div>
        <h3 class="font-bold">⚠️ Problemas del mazo:</h3>
        <ul class="list-disc list-inside">
          <li v-for="issue in validationIssues" :key="issue">{{ issue }}</li>
        </ul>
      </div>
    </div>

    <div v-else-if="totalCards === 60" class="alert alert-success mb-6">
      <div>
        <span class="font-bold">✅ ¡Mazo válido!</span>
        Tu mazo tiene exactamente 60 cartas y cumple con las reglas del formato.
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs tabs-boxed mb-6">
      <button 
        @click="activeTab = 'cards'"
        :class="['tab', activeTab === 'cards' ? 'tab-active' : '']"
      >
        🃏 Cartas ({{ totalCards }})
      </button>
      <button 
        @click="activeTab = 'stats'"
        :class="['tab', activeTab === 'stats' ? 'tab-active' : '']"
      >
        📊 Estadísticas
      </button>
      <button 
        @click="activeTab = 'testing'"
        :class="['tab', activeTab === 'testing' ? 'tab-active' : '']"
      >
        🎯 Testing
      </button>
    </div>

    <!-- Cards Tab -->
    <div v-if="activeTab === 'cards'">
      <!-- Empty deck -->
      <div v-if="deck.cards.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🃏</div>
        <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Mazo vacío
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Comienza agregando cartas a tu mazo para construir tu estrategia.
        </p>
        <button 
          @click="showSearchModal = true"
          class="btn btn-primary btn-lg"
        >
          Buscar Cartas
        </button>
      </div>

      <!-- Card sections -->
      <div v-else class="space-y-8">
        <!-- Pokémon -->
        <div v-if="pokemonCards.length > 0">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">
              🟦 Pokémon ({{ pokemonCount }})
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="card in pokemonCards" 
              :key="card.id"
              class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div class="card-body p-4">
                <div class="flex items-start gap-3">
                  <img 
                    :src="card.images?.small" 
                    :alt="card.name"
                    class="w-16 h-auto rounded cursor-pointer"
                    @click="showCardDetail(card)"
                  />
                  <div class="flex-1">
                    <h4 class="font-semibold text-sm">{{ card.name }}</h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ card.set?.name }} • {{ card.rarity }}
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <button 
                        @click="removeCard(card.id)"
                        class="btn btn-ghost btn-xs"
                        :disabled="card.quantity <= 1"
                      >
                        -
                      </button>
                      <span class="font-bold">{{ card.quantity }}</span>
                      <button 
                        @click="addCard(card)"
                        class="btn btn-ghost btn-xs"
                        :disabled="card.quantity >= 4"
                      >
                        +
                      </button>
                      <button 
                        @click="removeCardCompletely(card.id)"
                        class="btn btn-ghost btn-xs text-error ml-auto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Trainers -->
        <div v-if="trainerCards.length > 0">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">
              🎯 Entrenadores ({{ trainerCount }})
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="card in trainerCards" 
              :key="card.id"
              class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div class="card-body p-4">
                <div class="flex items-start gap-3">
                  <img 
                    :src="card.images?.small" 
                    :alt="card.name"
                    class="w-16 h-auto rounded cursor-pointer"
                    @click="showCardDetail(card)"
                  />
                  <div class="flex-1">
                    <h4 class="font-semibold text-sm">{{ card.name }}</h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ card.set?.name }} • {{ card.rarity }}
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <button 
                        @click="removeCard(card.id)"
                        class="btn btn-ghost btn-xs"
                        :disabled="card.quantity <= 1"
                      >
                        -
                      </button>
                      <span class="font-bold">{{ card.quantity }}</span>
                      <button 
                        @click="addCard(card)"
                        class="btn btn-ghost btn-xs"
                        :disabled="card.quantity >= 4"
                      >
                        +
                      </button>
                      <button 
                        @click="removeCardCompletely(card.id)"
                        class="btn btn-ghost btn-xs text-error ml-auto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Energy -->
        <div v-if="energyCards.length > 0">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">
              ⚡ Energías ({{ energyCount }})
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="card in energyCards" 
              :key="card.id"
              class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div class="card-body p-4">
                <div class="flex items-start gap-3">
                  <img 
                    :src="card.images?.small" 
                    :alt="card.name"
                    class="w-16 h-auto rounded cursor-pointer"
                    @click="showCardDetail(card)"
                  />
                  <div class="flex-1">
                    <h4 class="font-semibold text-sm">{{ card.name }}</h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ card.set?.name }} • {{ card.rarity }}
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <button 
                        @click="removeCard(card.id)"
                        class="btn btn-ghost btn-xs"
                        :disabled="card.quantity <= 1"
                      >
                        -
                      </button>
                      <span class="font-bold">{{ card.quantity }}</span>
                      <button 
                        @click="addCard(card)"
                        class="btn btn-ghost btn-xs"
                        :disabled="card.quantity >= 4"
                      >
                        +
                      </button>
                      <button 
                        @click="removeCardCompletely(card.id)"
                        class="btn btn-ghost btn-xs text-error ml-auto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Tab -->
    <div v-if="activeTab === 'stats'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Distribución por tipo -->
      <div class="card bg-white dark:bg-gray-800 shadow-lg">
        <div class="card-body">
          <h3 class="card-title mb-4">Distribución por Tipo</h3>
          <div class="space-y-2">
            <div v-for="type in typeDistribution" :key="type.name" class="flex justify-between items-center">
              <span>{{ type.name }}</span>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary h-2 rounded-full" 
                    :style="{ width: `${type.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm font-bold">{{ type.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Distribución por rareza -->
      <div class="card bg-white dark:bg-gray-800 shadow-lg">
        <div class="card-body">
          <h3 class="card-title mb-4">Distribución por Rareza</h3>
          <div class="space-y-2">
            <div v-for="rarity in rarityDistribution" :key="rarity.name" class="flex justify-between items-center">
              <span>{{ rarity.name }}</span>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-secondary h-2 rounded-full" 
                    :style="{ width: `${rarity.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm font-bold">{{ rarity.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testing Tab -->
    <div v-if="activeTab === 'testing'" class="text-center py-16">
      <div class="text-6xl mb-4">🎯</div>
      <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Testing de Mazo
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Próximamente: simulador de manos iniciales, curva de energía y más herramientas de testing.
      </p>
    </div>

    <!-- Modals -->
    <CardSearchModal 
      v-if="showSearchModal"
      @close="showSearchModal = false"
      @add-card="addCardToDeck"
    />

    <CardDetailModal 
      v-if="selectedCard"
      :card="selectedCard"
      @close="selectedCard = null"
      @add-to-deck="addCardToDeck"
    />

    <DeckFormModal 
      v-if="showEditModal"
      :deck="deck"
      @close="showEditModal = false"
      @save="handleEditSave"
    />
  </div>

  <!-- Loading or Error -->
  <div v-else class="container mx-auto px-4 py-8 text-center">
    <div class="text-4xl mb-4">🔍</div>
    <h2 class="text-2xl font-bold mb-4">Mazo no encontrado</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-8">
      El mazo que buscas no existe o ha sido eliminado.
    </p>
    <NuxtLink to="/decks" class="btn btn-primary">
      Volver a Mis Mazos
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDecksStore } from '~/stores/decks.store'
import { useAlertStore } from '~/stores/alert.store'

const route = useRoute()
const router = useRouter()
const decksStore = useDecksStore()
const alertStore = useAlertStore()

// Estados reactivos
const activeTab = ref('cards')
const showSearchModal = ref(false)
const showEditModal = ref(false)
const selectedCard = ref(null)

// Cargar mazos
onMounted(() => {
  decksStore.loadDecks()
})

// Deck actual
const deck = computed(() => {
  return decksStore.getDeckById(route.params.id)
})

// Computadas para las cartas
const pokemonCards = computed(() => {
  return deck.value?.cards?.filter(card => card.supertype === 'Pokémon') || []
})

const trainerCards = computed(() => {
  return deck.value?.cards?.filter(card => card.supertype === 'Trainer') || []
})

const energyCards = computed(() => {
  return deck.value?.cards?.filter(card => card.supertype === 'Energy') || []
})

// Conteos
const pokemonCount = computed(() => {
  return pokemonCards.value.reduce((total, card) => total + card.quantity, 0)
})

const trainerCount = computed(() => {
  return trainerCards.value.reduce((total, card) => total + card.quantity, 0)
})

const energyCount = computed(() => {
  return energyCards.value.reduce((total, card) => total + card.quantity, 0)
})

const totalCards = computed(() => {
  return pokemonCount.value + trainerCount.value + energyCount.value
})

// Validación del mazo
const validationIssues = computed(() => {
  const issues = []
  
  if (totalCards.value < 60) {
    issues.push(`El mazo necesita ${60 - totalCards.value} cartas más`)
  } else if (totalCards.value > 60) {
    issues.push(`El mazo tiene ${totalCards.value - 60} cartas de más`)
  }
  
  // Verificar límite de 4 cartas por nombre
  const cardNames = {}
  deck.value?.cards?.forEach(card => {
    const name = card.name
    if (!cardNames[name]) cardNames[name] = 0
    cardNames[name] += card.quantity
    
    if (cardNames[name] > 4) {
      issues.push(`Demasiadas copias de "${name}" (${cardNames[name]}/4)`)
    }
  })
  
  return issues
})

// Distribuciones para estadísticas
const typeDistribution = computed(() => {
  const distribution = {}
  
  deck.value?.cards?.forEach(card => {
    const types = card.types || ['Colorless']
    types.forEach(type => {
      if (!distribution[type]) distribution[type] = 0
      distribution[type] += card.quantity
    })
  })
  
  return Object.entries(distribution)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / totalCards.value) * 100
    }))
    .sort((a, b) => b.count - a.count)
})

const rarityDistribution = computed(() => {
  const distribution = {}
  
  deck.value?.cards?.forEach(card => {
    const rarity = card.rarity || 'Unknown'
    if (!distribution[rarity]) distribution[rarity] = 0
    distribution[rarity] += card.quantity
  })
  
  return Object.entries(distribution)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / totalCards.value) * 100
    }))
    .sort((a, b) => b.count - a.count)
})

// Funciones
const addCard = (card) => {
  decksStore.addCardToDeck(deck.value.id, card, 1)
}

const removeCard = (cardId) => {
  decksStore.removeCardFromDeck(deck.value.id, cardId, 1)
}

const removeCardCompletely = (cardId) => {
  const card = deck.value.cards.find(c => c.id === cardId)
  if (card) {
    decksStore.removeCardFromDeck(deck.value.id, cardId, card.quantity)
  }
}

const addCardToDeck = (card, quantity = 1) => {
  decksStore.addCardToDeck(deck.value.id, card, quantity)
  alertStore.showAlert('success', `${card.name} agregada al mazo`)
}

const showCardDetail = (card) => {
  selectedCard.value = card
}

const toggleFavorite = () => {
  decksStore.toggleFavorite(deck.value.id)
}

const editDeck = () => {
  showEditModal.value = true
}

const handleEditSave = (deckData) => {
  decksStore.updateDeck(deck.value.id, deckData)
  showEditModal.value = false
  alertStore.showAlert('success', 'Mazo actualizado correctamente')
}

const duplicateDeck = () => {
  const duplicated = decksStore.duplicateDeck(deck.value.id)
  if (duplicated) {
    alertStore.showAlert('success', 'Mazo duplicado correctamente')
    router.push(`/decks/${duplicated.id}`)
  }
}

const exportDeck = () => {
  const dataStr = JSON.stringify(deck.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${deck.value.name}.json`
  link.click()
  URL.revokeObjectURL(url)
  alertStore.showAlert('success', 'Mazo exportado correctamente')
}

const clearDeck = () => {
  if (confirm('¿Estás seguro de que quieres vaciar este mazo? Se eliminarán todas las cartas.')) {
    decksStore.updateDeck(deck.value.id, { cards: [] })
    alertStore.showAlert('success', 'Mazo vaciado correctamente')
  }
}

const deleteDeck = () => {
  if (confirm('¿Estás seguro de que quieres eliminar este mazo? Esta acción no se puede deshacer.')) {
    decksStore.deleteDeck(deck.value.id)
    alertStore.showAlert('success', 'Mazo eliminado correctamente')
    router.push('/decks')
  }
}

// SEO
useHead({
  title: computed(() => deck.value ? `${deck.value.name} - PokéDeck Master` : 'Mazo - PokéDeck Master'),
  meta: [
    {
      name: 'description',
      content: computed(() => deck.value ? `Gestiona tu mazo ${deck.value.name} de Pokémon TCG` : 'Gestiona tu mazo de Pokémon TCG')
    }
  ]
})
</script>
