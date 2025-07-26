<template>
  <header class="relative z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <NuxtLink
          to="/"
          class="text-3xl font-bold text-white flex items-center space-x-2"
        >
          <span>🃏</span>
          <span>TCG Manager</span>
        </NuxtLink>

        <!-- Navegación Desktop -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/pokedex"
            class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            :class="{ 'text-yellow-300': currentRoute === '/pokedex' }"
          >
            <span>📱</span>
            <span>Pokédex</span>
          </NuxtLink>
          <NuxtLink
            to="/cards"
            class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            :class="{ 'text-yellow-300': currentRoute === '/cards' }"
          >
            <span>🔍</span>
            <span>Explorar Cartas</span>
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/decks"
            class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            :class="{ 'text-yellow-300': currentRoute === '/decks' || currentRoute.startsWith('/decks/') }"
          >
            <span>🎲</span>
            <span>Mis Mazos</span>
          </NuxtLink>
          <a
            href="https://discord.gg/aKxPPuEFnH"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
          >
            <span>💬</span>
            <span>Discord</span>
          </a>
        </div>

        <!-- Botón hamburguesa para móvil -->
        <div class="md:hidden flex items-center space-x-2">
          <!-- Usuario móvil compacto -->
          <div v-if="authStore.isAuthenticated" class="flex items-center">
            <NuxtLink
              to="/dashboard"
              class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm font-medium transition-colors"
            >
              Dashboard
            </NuxtLink>
          </div>
          <div v-else>
            <NuxtLink
              to="/auth"
              class="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded text-sm font-medium transition-colors"
            >
              Login
            </NuxtLink>
          </div>
          
          <!-- Botón hamburguesa - VERSION SIMPLE -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="text-white p-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
            :class="{ 'bg-white/20': showMobileMenu }"
            type="button"
          >
            <svg v-if="!showMobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Usuario Desktop -->
        <div
          v-if="authStore.isAuthenticated"
          class="hidden md:flex items-center space-x-4"
        >
          <NuxtLink
            to="/dashboard"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            :class="{ 'bg-blue-700': currentRoute === '/dashboard' }"
          >
            Dashboard
          </NuxtLink>
          <button
            @click="authStore.logout()"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        <div v-else class="hidden md:block">
          <NuxtLink
            to="/auth"
            class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Iniciar Sesión
          </NuxtLink>
        </div>
      </div>

      <!-- Menú móvil desplegable -->
      <div v-if="showMobileMenu" class="md:hidden">
        <div class="bg-white/10 backdrop-blur-sm rounded-lg mt-4 p-4 space-y-3 relative z-40">
          <!-- Debug indicator -->
          <div class="text-center text-white/60 text-xs mb-2 border border-white/20 rounded p-1">
            🍔 Menú móvil activo - Estado: {{ showMobileMenu }}
          </div>
          
          <NuxtLink
            to="/pokedex"
            @click="showMobileMenu = false"
            class="flex items-center space-x-3 text-white hover:text-yellow-300 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/10"
            :class="{ 'text-yellow-300 bg-white/20': currentRoute === '/pokedex' }"
          >
            <span class="text-xl">📱</span>
            <span>Pokédex</span>
          </NuxtLink>
          
          <NuxtLink
            to="/cards"
            @click="showMobileMenu = false"
            class="flex items-center space-x-3 text-white hover:text-yellow-300 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/10"
            :class="{ 'text-yellow-300 bg-white/20': currentRoute === '/cards' }"
          >
            <span class="text-xl">🔍</span>
            <span>Explorar Cartas</span>
          </NuxtLink>
          
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/decks"
            @click="showMobileMenu = false"
            class="flex items-center space-x-3 text-white hover:text-yellow-300 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/10"
            :class="{ 'text-yellow-300 bg-white/20': currentRoute === '/decks' || currentRoute.startsWith('/decks/') }"
          >
            <span class="text-xl">🎲</span>
            <span>Mis Mazos</span>
          </NuxtLink>
          
          <a
            href="https://discord.gg/aKxPPuEFnH"
            target="_blank"
            rel="noopener noreferrer"
            @click="showMobileMenu = false"
            class="flex items-center space-x-3 text-white hover:text-yellow-300 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/10"
          >
            <span class="text-xl">💬</span>
            <span>Discord</span>
          </a>

          <!-- Acciones de usuario en móvil -->
          <div v-if="authStore.isAuthenticated" class="border-t border-white/20 pt-3 space-y-2">
            <button
              @click="authStore.logout(); showMobileMenu = false"
              class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
// Importar stores y composables
const authStore = useAuthStore();
const route = useRoute();

// Estados reactivos
const showMobileMenu = ref(false);

// Computadas
const currentRoute = computed(() => route?.path || '/');

// Log para debugging
console.log('🚀 GlobalHeader inicializado');

// Cerrar menú al cambiar de ruta
watch(() => route?.path, () => {
  if (showMobileMenu.value) {
    console.log("🚪 Ruta cambió - cerrando menú");
    showMobileMenu.value = false;
  }
});

// Limpiar en unmount
onUnmounted(() => {
  console.log('🧹 GlobalHeader desmontado');
});
</script>

<style scoped>
/* Estilos básicos */
.hamburger-button {
  transition: all 0.2s ease;
}

.hamburger-button:active {
  transform: scale(0.95);
}

/* Asegurar que el menú esté encima de todo */
header {
  z-index: 50;
}
</style>
