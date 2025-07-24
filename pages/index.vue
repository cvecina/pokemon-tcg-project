<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Hero Section -->
    <div class="hero min-h-[60vh] bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold flex items-center justify-center gap-3">
            <span>⚡</span>
            PokéDeck Master
          </h1>
          <p class="mb-5 text-lg opacity-90">
            Construye, gestiona y perfecciona tus mazos de Pokémon TCG con la herramienta definitiva para entrenadores.
          </p>
          <div class="flex gap-4 justify-center">
            <NuxtLink to="/decks" class="btn btn-primary btn-lg">
              🎲 Mis Mazos
            </NuxtLink>
            <NuxtLink to="/cards" class="btn btn-outline btn-lg text-white hover:text-gray-900">
              🔍 Explorar Cartas
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="stat bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div class="stat-figure text-primary">
            <span class="text-3xl">🎲</span>
          </div>
          <div class="stat-title">Mis Mazos</div>
          <div class="stat-value text-primary">{{ totalDecks }}</div>
          <div class="stat-desc">Mazos creados</div>
        </div>

        <div class="stat bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div class="stat-figure text-secondary">
            <span class="text-3xl">⭐</span>
          </div>
          <div class="stat-title">Favoritos</div>
          <div class="stat-value text-secondary">{{ favoriteDecks }}</div>
          <div class="stat-desc">Mazos favoritos</div>
        </div>

        <div class="stat bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div class="stat-figure text-accent">
            <span class="text-3xl">🃏</span>
          </div>
          <div class="stat-title">Total Cartas</div>
          <div class="stat-value text-accent">{{ totalCards }}</div>
          <div class="stat-desc">En todos los mazos</div>
        </div>

        <div class="stat bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div class="stat-figure text-info">
            <span class="text-3xl">⚔️</span>
          </div>
          <div class="stat-title">Formatos</div>
          <div class="stat-value text-info">{{ uniqueFormats }}</div>
          <div class="stat-desc">Diferentes formatos</div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          ¿Por qué PokéDeck Master?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          La herramienta más completa para gestionar tus mazos de Pokémon TCG
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="card bg-white dark:bg-gray-800 shadow-xl">
          <div class="card-body">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="card-title">Gestión Inteligente</h3>
            <p>Crea, edita y organiza tus mazos con facilidad. Guarda automáticamente tus cambios.</p>
          </div>
        </div>

        <div class="card bg-white dark:bg-gray-800 shadow-xl">
          <div class="card-body">
            <div class="text-4xl mb-4">🔍</div>
            <h3 class="card-title">Base de Datos Completa</h3>
            <p>Acceso a la base de datos oficial de Pokémon TCG con todas las cartas actualizadas.</p>
          </div>
        </div>

        <div class="card bg-white dark:bg-gray-800 shadow-xl">
          <div class="card-body">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="card-title">Análisis Detallado</h3>
            <p>Estadísticas avanzadas de tus mazos: tipos, costos, curva de energía y más.</p>
          </div>
        </div>

        <div class="card bg-white dark:bg-gray-800 shadow-xl">
          <div class="card-body">
            <div class="text-4xl mb-4">🎨</div>
            <h3 class="card-title">Personalización</h3>
            <p>Temas de colores, etiquetas personalizadas y organización por formatos.</p>
          </div>
        </div>

        <div class="card bg-white dark:bg-gray-800 shadow-xl">
          <div class="card-body">
            <div class="text-4xl mb-4">💾</div>
            <h3 class="card-title">Exportación</h3>
            <p>Exporta e importa tus mazos en formatos estándar para compartir con amigos.</p>
          </div>
        </div>

        <div class="card bg-white dark:bg-gray-800 shadow-xl">
          <div class="card-body">
            <div class="text-4xl mb-4">🌟</div>
            <h3 class="card-title">Totalmente Gratis</h3>
            <p>Sin límites, sin suscripciones. Toda la potencia de gestión de mazos completamente gratis.</p>
          </div>
        </div>
      </div>

      <!-- Recent Decks -->
      <div v-if="recentDecks.length > 0" class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white">Mazos Recientes</h3>
          <NuxtLink to="/decks" class="btn btn-ghost">Ver todos →</NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="deck in recentDecks" 
            :key="deck.id"
            class="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            @click="$router.push(`/decks/${deck.id}`)"
          >
            <div class="card-body">
              <div class="flex justify-between items-start">
                <h4 class="card-title text-lg">{{ deck.name }}</h4>
                <div v-if="deck.isFavorite" class="text-yellow-500">⭐</div>
              </div>
              <div class="flex gap-2 mb-2">
                <div class="badge badge-primary">{{ deck.format }}</div>
                <div class="badge badge-ghost">{{ getTotalCards(deck.id) }} cartas</div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ deck.description || 'Sin descripción' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8">
        <h3 class="text-3xl font-bold mb-4">¡Comienza a construir tu mazo perfecto!</h3>
        <p class="text-lg mb-6 opacity-90">
          Únete a miles de entrenadores que ya usan PokéDeck Master
        </p>
        <div class="flex gap-4 justify-center">
          <NuxtLink to="/decks" class="btn btn-white btn-lg">
            Crear Mi Primer Mazo
          </NuxtLink>
          <NuxtLink to="/cards" class="btn btn-outline btn-lg text-white hover:text-gray-900">
            Explorar Cartas
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// Referencias reactivas simples para empezar
const allDecks = ref([])

// Cargar mazos al montar el componente
onMounted(() => {
  // Intentar cargar desde localStorage
  try {
    const savedDecks = localStorage.getItem('pokemon-decks')
    if (savedDecks) {
      allDecks.value = JSON.parse(savedDecks)
    }
  } catch (error) {
    console.log('No hay mazos guardados aún')
    allDecks.value = []
  }
})

// Computadas para estadísticas simples
const totalDecks = computed(() => {
  return allDecks.value.length
})

const favoriteDecks = computed(() => {
  return allDecks.value.filter(deck => deck.isFavorite).length
})

const totalCards = computed(() => {
  return allDecks.value.reduce((total, deck) => {
    return total + (deck.cards?.reduce((deckTotal, card) => deckTotal + (card.quantity || 0), 0) || 0)
  }, 0)
})

const uniqueFormats = computed(() => {
  const formats = allDecks.value.map(deck => deck.format || 'Standard')
  return [...new Set(formats)].length
})

const recentDecks = computed(() => {
  return allDecks.value
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 3)
})

const getTotalCards = (deckId) => {
  const deck = allDecks.value.find(d => d.id === deckId)
  return deck?.cards?.reduce((total, card) => total + (card.quantity || 0), 0) || 0
}

// SEO
useHead({
  title: 'PokéDeck Master - Constructor de Mazos Pokémon TCG',
  meta: [
    {
      name: 'description',
      content: 'La herramienta definitiva para construir y gestionar tus mazos de Pokémon TCG. Gratis, completa y fácil de usar.'
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