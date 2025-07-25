<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900"
  >
    <!-- Header -->
    <header class="relative z-10">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <NuxtLink
            to="/"
            class="text-3xl font-bold text-white flex items-center space-x-2"
          >
            <span>🃏</span>
            <span>TCG Manager</span>
          </NuxtLink>

          <!-- Navegación -->
          <div class="hidden md:flex items-center space-x-6">
            <NuxtLink
              to="/pokedex"
              class="text-yellow-300 font-medium flex items-center space-x-1"
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

          <!-- Usuario -->
          <div
            v-if="authStore.isAuthenticated"
            class="flex items-center space-x-4"
          >
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
          </div>
          <div v-else>
            <NuxtLink
              to="/auth"
              class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Iniciar Sesión
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Contenido Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="text-8xl mb-6">📱</div>
        <h1 class="text-5xl font-bold text-white mb-4">Pokédex</h1>
        <p class="text-xl text-white/80 max-w-2xl mx-auto">
          Explora el mundo de los Pokémon con información detallada,
          estadísticas y habilidades de todos los Pokémon.
        </p>
      </div>

      <!-- Controles -->
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <div
          class="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <!-- Búsqueda por nombre -->
          <div class="flex gap-2">
            <input
              v-model="searchTerm"
              @keyup.enter="searchPokemon"
              placeholder="Buscar Pokémon (ej: pikachu)"
              class="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <button
              @click="searchPokemon"
              class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🔍 Buscar
            </button>
          </div>

          <!-- Generación aleatoria -->
          <button
            @click="getRandomPokemon"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🎲 Pokémon Aleatorio
          </button>

          <!-- Navegación -->
          <div class="flex gap-2 items-center">
            <button
              @click="previousPokemon"
              :disabled="currentId <= 1"
              class="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⬅️ Anterior
            </button>
            <span class="text-lg font-bold text-yellow-300"
              >#{{ currentId }}</span
            >
            <button
              @click="nextPokemon"
              :disabled="currentId >= 1010"
              class="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➡️ Siguiente
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="text-center">
          <div class="loading loading-spinner loading-lg text-white"></div>
          <p class="mt-4 text-lg text-white">Cargando Pokémon...</p>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="bg-red-600/20 border border-red-600/30 rounded-lg p-4 mb-8"
      >
        <div class="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-red-200">{{ error }}</span>
        </div>
      </div>

      <!-- Pokémon Card -->
      <div
        v-if="pokemon && !loading"
        class="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8 transform transition-all hover:scale-105"
      >
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <!-- Imagen y básicos -->
          <div class="text-center">
            <div class="relative inline-block">
              <img
                :src="pokemon.sprites.other['official-artwork'].front_default"
                :alt="pokemon.name"
                class="w-64 h-64 mx-auto mb-4 drop-shadow-2xl"
                @error="handleImageError"
              />
              <div
                class="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full px-3 py-1 font-bold"
              >
                #{{ pokemon.id }}
              </div>
            </div>

            <h2 class="text-4xl font-bold capitalize text-white mb-2">
              {{ pokemon.name }}
            </h2>

            <!-- Tipos -->
            <div class="flex justify-center gap-2 mb-4">
              <span
                v-for="type in pokemon.types"
                :key="type.slot"
                :class="getTypeColor(type.type.name)"
                class="px-4 py-2 rounded-full text-white font-bold text-sm uppercase"
              >
                {{ type.type.name }}
              </span>
            </div>

            <!-- Stats básicas -->
            <div class="grid grid-cols-3 gap-4 text-center">
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div class="text-2xl font-bold text-blue-300">
                  {{ pokemon.height / 10 }}m
                </div>
                <div class="text-sm text-white/70">Altura</div>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div class="text-2xl font-bold text-green-300">
                  {{ pokemon.weight / 10 }}kg
                </div>
                <div class="text-sm text-white/70">Peso</div>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div class="text-2xl font-bold text-purple-300">
                  {{ pokemon.base_experience }}
                </div>
                <div class="text-sm text-white/70">Exp. Base</div>
              </div>
            </div>
          </div>

          <!-- Stats detalladas -->
          <div>
            <h3 class="text-2xl font-bold text-white mb-4">📊 Estadísticas</h3>
            <div class="space-y-3">
              <div
                v-for="stat in pokemon.stats"
                :key="stat.stat.name"
                class="flex items-center gap-3"
              >
                <div class="w-32 text-sm font-medium capitalize text-white/80">
                  {{ stat.stat.name.replace("-", " ") }}:
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <div class="w-full bg-white/20 rounded-full h-3">
                      <div
                        :class="getStatColor(stat.base_stat)"
                        class="h-3 rounded-full transition-all duration-1000"
                        :style="{
                          width:
                            Math.min((stat.base_stat / 255) * 100, 100) + '%',
                        }"
                      ></div>
                    </div>
                    <span class="text-sm font-bold text-white w-8 text-right">{{
                      stat.base_stat
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Habilidades -->
            <h3 class="text-2xl font-bold text-white mb-4 mt-6">
              ⚡ Habilidades
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="ability in pokemon.abilities"
                :key="ability.slot"
                :class="
                  ability.is_hidden
                    ? 'bg-purple-600 text-white'
                    : 'bg-blue-600 text-white'
                "
                class="px-3 py-1 rounded-full text-sm font-medium capitalize"
              >
                {{ ability.ability.name.replace("-", " ") }}
                <span v-if="ability.is_hidden" class="text-xs">(Oculta)</span>
              </span>
            </div>

            <!-- Movimientos destacados -->
            <h3 class="text-2xl font-bold text-white mb-4 mt-6">
              🥊 Movimientos
            </h3>
            
            <!-- Movimientos destacados (primeros 8) -->
            <div class="mb-4">
              <h4 class="text-lg font-semibold text-white/90 mb-2">Algunos Movimientos:</h4>
              <div class="grid grid-cols-2 gap-2">
                <span
                  v-for="move in pokemon.moves.slice(0, 8)"
                  :key="move.move.name"
                  class="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium capitalize"
                >
                  {{ move.move.name.replace("-", " ") }}
                </span>
              </div>
            </div>

            <!-- Botón para mostrar todos los movimientos -->
            <div class="mb-4">
              <button 
                @click="showAllMoves = !showAllMoves"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>{{ showAllMoves ? '🔽' : '▶️' }}</span>
                <span>{{ showAllMoves ? 'Ocultar' : 'Ver' }} Todos los Movimientos ({{ pokemon.moves.length }})</span>
              </button>
            </div>

            <!-- Lista completa de movimientos (expandible) -->
            <div v-if="showAllMoves" class="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-h-96 overflow-y-auto">
              <h4 class="text-lg font-semibold text-white mb-3">Todos los Movimientos:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div 
                  v-for="(move, index) in pokemon.moves" 
                  :key="move.move.name"
                  class="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded text-sm font-medium capitalize flex justify-between items-center"
                >
                  <span>{{ move.move.name.replace("-", " ") }}</span>
                  <span class="text-xs text-white/60">#{{ index + 1 }}</span>
                </div>
              </div>
              <div class="mt-3 text-center">
                <p class="text-white/70 text-sm">Total: {{ pokemon.moves.length }} movimientos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Pokémon recientes -->
      <div
        v-if="recentPokemon.length > 0"
        class="bg-white/10 backdrop-blur-sm rounded-lg p-6"
      >
        <h3 class="text-2xl font-bold text-white mb-4">
          📜 Pokémon Vistos Recientemente
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="recent in recentPokemon"
            :key="recent.id"
            @click="loadPokemon(recent.id)"
            class="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center cursor-pointer hover:bg-white/30 transition-colors"
          >
            <img
              :src="recent.sprites.front_default"
              :alt="recent.name"
              class="w-16 h-16 mx-auto mb-2"
            />
            <div class="text-sm font-medium capitalize text-white">
              {{ recent.name }}
            </div>
            <div class="text-xs text-white/70">#{{ recent.id }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Store de autenticación
const authStore = useAuthStore();

const pokemon = ref(null);
const loading = ref(false);
const error = ref("");
const searchTerm = ref("");
const currentId = ref(1);
const recentPokemon = ref([]);
const showAllMoves = ref(false);

// Cargar Pokémon inicial
onMounted(() => {
  loadPokemon(1);
});

// Función principal para cargar Pokémon
async function loadPokemon(id) {
  loading.value = true;
  error.value = "";

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(`Pokémon #${id} no encontrado`);
    }

    const data = await response.json();
    pokemon.value = data;
    currentId.value = data.id;

    // Agregar a recientes (máximo 12)
    const existing = recentPokemon.value.findIndex((p) => p.id === data.id);
    if (existing === -1) {
      recentPokemon.value.unshift(data);
      if (recentPokemon.value.length > 12) {
        recentPokemon.value.pop();
      }
    }
  } catch (err) {
    error.value = err.message;
    console.error("Error cargando Pokémon:", err);
  } finally {
    loading.value = false;
  }
}

// Buscar por nombre
async function searchPokemon() {
  if (!searchTerm.value.trim()) return;

  const term = searchTerm.value.toLowerCase().trim();
  await loadPokemon(term);
}

// Pokémon aleatorio
function getRandomPokemon() {
  const randomId = Math.floor(Math.random() * 1010) + 1;
  loadPokemon(randomId);
}

// Navegación
function nextPokemon() {
  if (currentId.value < 1010) {
    loadPokemon(currentId.value + 1);
  }
}

function previousPokemon() {
  if (currentId.value > 1) {
    loadPokemon(currentId.value - 1);
  }
}

// Colores para tipos
function getTypeColor(type) {
  const colors = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-green-400",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  };
  return colors[type] || "bg-gray-400";
}

// Colores para stats
function getStatColor(value) {
  if (value >= 120) return "bg-green-500"; // Excelente - Verde
  if (value >= 90) return "bg-yellow-500"; // Muy bueno - Amarillo
  if (value >= 60) return "bg-orange-500"; // Bueno - Naranja
  if (value >= 30) return "bg-red-400"; // Regular - Rojo claro
  return "bg-red-500"; // Bajo - Rojo
}

// Manejar errores de imagen
function handleImageError(event) {
  event.target.src = pokemon.value?.sprites.front_default || "/favicon.ico";
}

// Metadata
useHead({
  title: "Pokédex Real - Todos los Pokémon",
  meta: [
    {
      name: "description",
      content:
        "Explora todos los Pokémon usando la API real de PokéAPI. Busca, navega y descubre estadísticas completas.",
    },
  ],
});
</script>

<style scoped>
/* Animaciones personalizadas */
.transform {
  transition: transform 0.3s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.02);
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
