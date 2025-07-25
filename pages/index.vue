<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
    <!-- Header -->
    <header class="relative z-10">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="text-3xl font-bold text-white flex items-center space-x-2">
            <span>🃏</span>
            <span>TCG Manager</span>
          </div>
          
          <!-- Navegación central -->
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
              v-if="authStore.isAuthenticated"
              to="/decks" 
              class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            >
              <span>🎲</span>
              <span>Mis Mazos</span>
            </NuxtLink>
          </div>
          
          <!-- Usuario/Auth -->
          <div class="space-x-4 flex items-center">
            <!-- Si está autenticado, mostrar dashboard y logout -->
            <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
              <span class="text-white/80 hidden sm:block">
                Hola, {{ authStore.user?.username }}
              </span>
              <NuxtLink 
                to="/dashboard" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Dashboard
              </NuxtLink>
              <button 
                @click="authStore.logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cerrar Sesión
              </button>
              <button 
                @click="handleLogout"
                class="text-white/80 hover:text-white transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
            
            <!-- Si no está autenticado, mostrar login/registro -->
            <div v-else class="flex items-center space-x-4">
              <NuxtLink to="/auth" class="text-white hover:text-yellow-300 transition-colors">
                Iniciar Sesión
              </NuxtLink>
              <NuxtLink to="/auth" class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors">
                Registrarse
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-16">
        <div class="mb-8">
          <div class="text-8xl mb-6">🃏</div>
          <h1 class="text-6xl font-bold text-white mb-4">
            TCG Manager
          </h1>
          <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            La plataforma definitiva para gestionar tu colección de cartas TCG. 
            Crea, organiza y construye mazos increíbles con tus cartas favoritas.
          </p>
        </div>

        <!-- Acciones principales -->
        <div v-if="authStore.isAuthenticated" class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <NuxtLink 
            to="/dashboard" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <span>📊</span>
            <span>Mi Dashboard</span>
          </NuxtLink>
          <button 
            @click="quickAddCard"
            class="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <span>➕</span>
            <span>Agregar Carta</span>
          </button>
        </div>

        <div v-else class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <NuxtLink 
            to="/auth" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <span>🚀</span>
            <span>Comenzar Ahora</span>
          </NuxtLink>
          <button 
            @click="showDemo"
            class="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2 backdrop-blur-sm"
          >
            <span>👀</span>
            <span>Ver Demo</span>
          </button>
        </div>
      </div>

      <!-- Features Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div class="text-4xl mb-4">🗃️</div>
          <h3 class="text-xl font-bold text-white mb-2">Gestión de Colección</h3>
          <p class="text-white/80">
            Organiza tu colección completa de cartas TCG con búsquedas avanzadas y filtros inteligentes.
          </p>
        </div>

        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div class="text-4xl mb-4">�</div>
          <h3 class="text-xl font-bold text-white mb-2">Constructor de Mazos</h3>
          <p class="text-white/80">
            Crea mazos competitivos con herramientas profesionales y análisis de cartas en tiempo real.
          </p>
        </div>

        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div class="text-4xl mb-4">👥</div>
          <h3 class="text-xl font-bold text-white mb-2">Comunidad</h3>
          <p class="text-white/80">
            Comparte tus cartas con otros usuarios y contribuye a crear la base de datos más completa.
          </p>
        </div>
      </div>

      <!-- Stats Section -->
      <div v-if="authStore.isAuthenticated" class="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-16">
        <h2 class="text-2xl font-bold text-white mb-6 text-center">Tu Progreso</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-400 mb-1">{{ userStats.totalCards }}</div>
            <div class="text-white/80 text-sm">Cartas en Colección</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-400 mb-1">{{ userStats.totalDecks }}</div>
            <div class="text-white/80 text-sm">Mazos Creados</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-400 mb-1">{{ userStats.rareCards }}</div>
            <div class="text-white/80 text-sm">Cartas Raras</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-400 mb-1">{{ userStats.daysSinceJoined }}</div>
            <div class="text-white/80 text-sm">Días Activo</div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center py-16">
        <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-8">
          <h2 class="text-3xl font-bold text-white mb-4">
            {{ authStore.isAuthenticated ? '¡Sigue construyendo tu colección!' : '¡Únete a la comunidad TCG!' }}
          </h2>
          <p class="text-white/80 mb-6">
            {{ authStore.isAuthenticated 
              ? 'Agrega más cartas, crea nuevos mazos y conecta con otros coleccionistas.' 
              : 'Miles de jugadores ya gestionan sus cartas y mazos con TCG Manager.' }}
          </p>
          <div v-if="!authStore.isAuthenticated" class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/auth" 
              class="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 rounded-lg text-lg font-bold transition-all"
            >
              Crear Cuenta Gratis
            </NuxtLink>
            <NuxtLink 
              to="/auth" 
              class="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors backdrop-blur-sm"
            >
              Ya tengo cuenta
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/20 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-white/60">
          <p>&copy; 2024 TCG Manager. Hecho con ❤️ para la comunidad TCG.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Store de autenticación
const authStore = useAuthStore()
const router = useRouter()

// Estados reactivos
const userStats = reactive({
  totalCards: 0,
  totalDecks: 0,
  rareCards: 0,
  daysSinceJoined: 0
})

// Cargar estadísticas del usuario si está autenticado
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await loadUserStats()
  }
})

// Funciones
async function loadUserStats() {
  try {
    // Simular estadísticas por ahora
    userStats.totalCards = Math.floor(Math.random() * 500) + 50
    userStats.totalDecks = Math.floor(Math.random() * 20) + 1
    userStats.rareCards = Math.floor(Math.random() * 50) + 5
    userStats.daysSinceJoined = Math.floor(Math.random() * 365) + 1
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

function quickAddCard() {
  router.push('/dashboard?tab=add-card')
}

function showDemo() {
  // TODO: Implementar demo
  alert('Demo próximamente disponible!')
}

async function handleLogout() {
  await authStore.logout()
  // Limpiar estadísticas
  Object.keys(userStats).forEach(key => {
    userStats[key] = 0
  })
}

// Metadata
useHead({
  title: 'TCG Manager - Gestiona tu Colección de Cartas',
  meta: [
    {
      name: 'description',
      content: 'La plataforma definitiva para gestionar tu colección de cartas TCG. Crea, organiza y construye mazos increíbles.'
    },
    {
      name: 'keywords',
      content: 'TCG, cartas, colección, mazos, Pokémon, trading cards, gestión'
    }
  ]
})
</script>

<style scoped>
/* Animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Efectos de hover personalizados */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Backdrop blur personalizado */
.backdrop-blur-custom {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>