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
              class="text-white hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
            >
              <span>📱</span>
              <span>Pokédex</span>
            </NuxtLink>
            <NuxtLink
              to="/cards"
              class="text-yellow-300 font-medium flex items-center space-x-1"
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
        <div class="text-8xl mb-6">🔍</div>
        <h1 class="text-5xl font-bold text-white mb-4">Explorar Cartas TCG</h1>
        <p class="text-xl text-white/80 max-w-2xl mx-auto">
          Descubre cartas increíbles de Pokémon TCG de todas las expansiones y
          colecciones.
        </p>
      </div>

      <!-- Controles de búsqueda y filtros -->
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Buscador -->
          <div class="relative lg:col-span-2">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar cartas por nombre..."
              class="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg
                class="h-5 w-5 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Filtro por tipo -->
          <select
            v-model="selectedType"
            class="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" class="text-black">Todos los tipos</option>
            <option
              v-for="type in pokemonTypes"
              :key="type"
              :value="type"
              class="text-black"
            >
              {{ type }}
            </option>
          </select>

          <!-- Filtro por rareza -->
          <select
            v-model="selectedRarity"
            class="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" class="text-black">Todas las rarezas</option>
            <option value="Common" class="text-black">Común</option>
            <option value="Uncommon" class="text-black">Poco Común</option>
            <option value="Rare" class="text-black">Rara</option>
            <option value="Rare Holo" class="text-black">
              Rara Holográfica
            </option>
            <option value="Rare Holo EX" class="text-black">
              Rara Holo EX
            </option>
            <option value="Rare Holo GX" class="text-black">
              Rara Holo GX
            </option>
            <option value="Rare Holo V" class="text-black">Rara Holo V</option>
            <option value="Rare Holo VMAX" class="text-black">
              Rara Holo VMAX
            </option>
            <option value="Ultra Rare" class="text-black">Ultra Rara</option>
            <option value="Rare Secret" class="text-black">Secreta</option>
          </select>
        </div>

        <!-- Filtro por set/expansión -->
        <div class="mb-6">
          <label class="block text-white/90 text-sm font-medium mb-2"
            >Expansión:</label
          >
          <select
            v-model="selectedSet"
            class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" class="text-black">Todas las expansiones</option>
            <option
              v-for="set in sets"
              :key="set.id"
              :value="set.id"
              class="text-black"
            >
              {{ set.name }} ({{ set.releaseDate }})
            </option>
          </select>
        </div>

        <!-- Botones de filtro rápido -->
        <div class="mb-4">
          <p class="text-white/90 text-sm font-medium mb-3">Filtros rápidos:</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="type in quickFilters"
              :key="type"
              @click="quickFilter(type)"
              :class="
                activeFilter === type
                  ? 'bg-orange-600 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              "
              class="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {{ type }}
            </button>
            <button
              v-if="activeFilter"
              @click="clearFilters"
              class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              ❌ Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Stats de búsqueda -->
        <div v-if="totalCards > 0 && !loading" class="text-white/70 text-sm">
          Mostrando {{ cards.length }} de
          {{ totalCards.toLocaleString() }} cartas
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="loading loading-spinner loading-lg text-white"></div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-6xl mb-4">😔</div>
        <h3 class="text-xl font-bold text-white mb-2">
          Error al cargar cartas
        </h3>
        <p class="text-white/80 mb-4">{{ error }}</p>
        <button
          @click="searchCards"
          class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Grid de cartas -->
      <div
        v-else-if="cards.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <div
          v-for="card in cards"
          :key="card.id"
          @click="selectCard(card)"
          class="bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-all hover:scale-105 hover:shadow-xl group"
        >
          <!-- Imagen de la carta -->
          <div
            class="aspect-[3/4] bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-3 overflow-hidden relative"
          >
            <img
              v-if="card.images?.small"
              :src="card.images.small"
              :alt="card.name"
              class="w-full h-full object-cover transition-transform group-hover:scale-110"
              @error="handleImageError"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-4xl text-orange-300"
            >
              🃏
            </div>

            <!-- Badge de rareza -->
            <div v-if="card.rarity" class="absolute top-2 right-2">
              <span
                :class="getRarityColor(card.rarity)"
                class="px-2 py-1 text-xs rounded-full font-bold text-white backdrop-blur-sm"
              >
                {{ getRarityShort(card.rarity) }}
              </span>
            </div>
          </div>

          <!-- Info de la carta -->
          <div>
            <h3 class="text-white font-bold text-sm mb-1 line-clamp-2">
              {{ card.name }}
            </h3>

            <!-- Set info -->
            <div class="flex items-center justify-between mb-2">
              <p class="text-white/70 text-xs">
                {{ card.set?.name || "Set desconocido" }}
              </p>
              <span v-if="card.number" class="text-white/60 text-xs"
                >#{{ card.number }}</span
              >
            </div>

            <!-- Tipos (para Pokémon) -->
            <div
              v-if="card.types && card.types.length > 0"
              class="mb-2 flex flex-wrap gap-1"
            >
              <span
                v-for="type in card.types.slice(0, 2)"
                :key="type"
                :class="getTypeColor(type)"
                class="px-2 py-1 text-xs rounded-full text-white font-medium"
              >
                {{ type }}
              </span>
            </div>

            <!-- HP (para Pokémon) -->
            <div v-if="card.hp" class="mb-2">
              <span class="text-green-400 text-xs font-bold"
                >❤️ {{ card.hp }} HP</span
              >
            </div>

            <!-- Precio (si disponible) -->
            <div v-if="card.tcgplayer?.prices" class="text-xs">
              <span
                v-if="getCardPrice(card)"
                class="text-green-300 font-medium"
              >
                💰 ${{ getCardPrice(card) }}
              </span>
            </div>

            <!-- Artista -->
            <div v-if="card.artist" class="mt-2 text-xs text-white/50">
              🎨 {{ card.artist }}
            </div>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-bold text-white mb-2">
          No se encontraron cartas
        </h3>
        <p class="text-white/80">Intenta ajustar tus filtros de búsqueda</p>
      </div>

      <!-- Cargar más -->
      <div v-if="hasMore && cards.length > 0" class="text-center mt-8">
        <button
          @click="loadMore"
          :disabled="loading"
          class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {{ loading ? "Cargando..." : "Cargar Más Cartas" }}
        </button>
      </div>
    </main>

    <!-- Modal de carta -->
    <div
      v-if="selectedCard"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-white/20"
        @click.stop
      >
        <div class="p-6">
          <!-- Header del modal -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-3xl font-bold text-white mb-2">
                {{ selectedCard.name }}
              </h2>
              <div class="flex items-center space-x-4 text-white/80">
                <span>{{ selectedCard.set?.name }}</span>
                <span v-if="selectedCard.number"
                  >#{{ selectedCard.number }}</span
                >
                <span
                  v-if="selectedCard.rarity"
                  :class="getRarityColor(selectedCard.rarity)"
                  class="px-3 py-1 text-xs rounded-full text-white font-bold"
                >
                  {{ selectedCard.rarity }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Botón agregar a colección -->
              <button
                v-if="authStore.isAuthenticated"
                @click="addToCollection"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Agregar a mi colección</span>
              </button>
              <button
                @click="closeModal"
                class="text-white/70 hover:text-white text-3xl font-bold transition-colors"
              >
                &times;
              </button>
            </div>
          </div>

          <!-- Contenido del modal -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Imagen -->
            <div class="text-center">
              <div
                class="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block"
              >
                <img
                  v-if="selectedCard.images?.large"
                  :src="selectedCard.images.large"
                  :alt="selectedCard.name"
                  class="max-w-full h-auto mx-auto rounded-lg shadow-2xl max-h-96"
                />
                <div
                  v-else
                  class="w-64 h-96 flex items-center justify-center text-6xl text-white/50"
                >
                  🃏
                </div>
              </div>
            </div>

            <!-- Información -->
            <div class="space-y-6">
              <!-- Info básica -->
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 class="text-xl font-bold text-white mb-3">
                  📋 Información Básica
                </h3>
                <div class="space-y-2 text-white/90">
                  <div class="flex justify-between">
                    <span class="text-white/70">Supertipo:</span>
                    <span class="font-medium">{{
                      selectedCard.supertype || "N/A"
                    }}</span>
                  </div>
                  <div
                    v-if="selectedCard.subtypes"
                    class="flex justify-between"
                  >
                    <span class="text-white/70">Subtipo:</span>
                    <span class="font-medium">{{
                      selectedCard.subtypes.join(", ")
                    }}</span>
                  </div>
                  <div v-if="selectedCard.hp" class="flex justify-between">
                    <span class="text-white/70">HP:</span>
                    <span class="font-medium text-green-400">{{
                      selectedCard.hp
                    }}</span>
                  </div>
                  <div v-if="selectedCard.types" class="flex justify-between">
                    <span class="text-white/70">Tipos:</span>
                    <div class="flex space-x-1">
                      <span
                        v-for="type in selectedCard.types"
                        :key="type"
                        :class="getTypeColor(type)"
                        class="px-2 py-1 text-xs rounded-full text-white font-medium"
                      >
                        {{ type }}
                      </span>
                    </div>
                  </div>
                  <div v-if="selectedCard.artist" class="flex justify-between">
                    <span class="text-white/70">Artista:</span>
                    <span class="font-medium">{{ selectedCard.artist }}</span>
                  </div>
                </div>
              </div>

              <!-- Ataques -->
              <div
                v-if="selectedCard.attacks?.length"
                class="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <h3 class="text-xl font-bold text-white mb-3">⚔️ Ataques</h3>
                <div class="space-y-3">
                  <div
                    v-for="attack in selectedCard.attacks"
                    :key="attack.name"
                    class="bg-white/10 rounded-lg p-3"
                  >
                    <div class="flex justify-between items-center mb-2">
                      <h4 class="font-bold text-white">{{ attack.name }}</h4>
                      <span
                        v-if="attack.damage"
                        class="text-red-400 font-bold text-lg"
                        >{{ attack.damage }}</span
                      >
                    </div>
                    <div
                      v-if="attack.cost"
                      class="flex items-center space-x-1 mb-2"
                    >
                      <span class="text-white/70 text-sm">Costo:</span>
                      <div class="flex space-x-1">
                        <span
                          v-for="(cost, index) in attack.cost"
                          :key="index"
                          :class="getTypeColor(cost)"
                          class="w-6 h-6 rounded-full text-xs flex items-center justify-center text-white font-bold"
                        >
                          {{ cost.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <p v-if="attack.text" class="text-white/80 text-sm">
                      {{ attack.text }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Habilidades -->
              <div
                v-if="selectedCard.abilities?.length"
                class="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <h3 class="text-xl font-bold text-white mb-3">
                  ✨ Habilidades
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="ability in selectedCard.abilities"
                    :key="ability.name"
                    class="bg-white/10 rounded-lg p-3"
                  >
                    <h4 class="font-bold text-white mb-1">
                      {{ ability.name }}
                    </h4>
                    <p class="text-purple-300 text-sm font-medium mb-2">
                      {{ ability.type }}
                    </p>
                    <p class="text-white/80 text-sm">{{ ability.text }}</p>
                  </div>
                </div>
              </div>

              <!-- Resistencias y debilidades -->
              <div
                v-if="selectedCard.weaknesses || selectedCard.resistances"
                class="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <h3 class="text-xl font-bold text-white mb-3">
                  🛡️ Resistencias y Debilidades
                </h3>
                <div class="space-y-2">
                  <div
                    v-if="selectedCard.weaknesses"
                    class="flex items-center space-x-2"
                  >
                    <span class="text-red-400 font-medium">Debilidad:</span>
                    <div
                      v-for="weakness in selectedCard.weaknesses"
                      :key="weakness.type"
                      class="flex items-center space-x-1"
                    >
                      <span
                        :class="getTypeColor(weakness.type)"
                        class="px-2 py-1 text-xs rounded-full text-white"
                      >
                        {{ weakness.type }}
                      </span>
                      <span class="text-white/80">{{ weakness.value }}</span>
                    </div>
                  </div>
                  <div
                    v-if="selectedCard.resistances"
                    class="flex items-center space-x-2"
                  >
                    <span class="text-green-400 font-medium">Resistencia:</span>
                    <div
                      v-for="resistance in selectedCard.resistances"
                      :key="resistance.type"
                      class="flex items-center space-x-1"
                    >
                      <span
                        :class="getTypeColor(resistance.type)"
                        class="px-2 py-1 text-xs rounded-full text-white"
                      >
                        {{ resistance.type }}
                      </span>
                      <span class="text-white/80">{{ resistance.value }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Precio -->
              <div
                v-if="selectedCard.tcgplayer?.prices"
                class="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <h3 class="text-xl font-bold text-white mb-3">
                  💰 Precios TCGPlayer
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="(priceData, priceType) in selectedCard.tcgplayer
                      .prices"
                    :key="priceType"
                    class="bg-white/10 rounded-lg p-3"
                  >
                    <p class="font-medium text-white capitalize mb-1">
                      {{ priceType.replace(/([A-Z])/g, " $1") }}:
                    </p>
                    <div class="text-sm text-white/80 space-y-1">
                      <p v-if="priceData.low">
                        Bajo:
                        <span class="text-green-400 font-bold"
                          >${{ priceData.low }}</span
                        >
                      </p>
                      <p v-if="priceData.mid">
                        Medio:
                        <span class="text-yellow-400 font-bold"
                          >${{ priceData.mid }}</span
                        >
                      </p>
                      <p v-if="priceData.high">
                        Alto:
                        <span class="text-red-400 font-bold"
                          >${{ priceData.high }}</span
                        >
                      </p>
                      <p v-if="priceData.market">
                        Mercado:
                        <span class="text-blue-400 font-bold"
                          >${{ priceData.market }}</span
                        >
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Estados reactivos
const authStore = useAuthStore();
const searchTerm = ref("");
const selectedSet = ref("");
const selectedRarity = ref("");
const selectedType = ref("");
const activeFilter = ref("");
const cards = ref([]);
const sets = ref([]);
const loading = ref(false);
const error = ref("");
const selectedCard = ref(null);
const currentPage = ref(1);
const hasMore = ref(true);
const totalCards = ref(0);

// Filtros rápidos
const quickFilters = [
  "Pokémon",
  "Trainer",
  "Energy",
  "Rare Holo",
  "Ultra Rare",
];

// Tipos de Pokémon
const pokemonTypes = [
  "Colorless",
  "Darkness",
  "Dragon",
  "Fairy",
  "Fighting",
  "Fire",
  "Grass",
  "Lightning",
  "Metal",
  "Psychic",
  "Water",
];

// Cargar datos iniciales
onMounted(async () => {
  console.log("🚀 Iniciando carga de datos con endpoints del servidor...");

  await loadSets();
  await searchCards();
});

// Watchers para búsqueda automática
watch(
  [searchTerm, selectedSet, selectedRarity, selectedType],
  () => {
    resetSearch();
    searchCards();
  },
  { debounce: 800 }
);

// Funciones
async function loadSets() {
  try {
    console.log("🔥 Cargando sets desde nuestro endpoint...");

    const response = await $fetch('/api/pokemon-tcg/sets', {
      query: {
        pageSize: 50,
        orderBy: '-releaseDate'
      }
    });

    console.log("✅ Sets cargados exitosamente:", response);

    // Filtrar sets más populares y recientes
    sets.value = response.data
      .filter((set) => set.images?.logo) // Solo sets con logo
      .slice(0, 30); // Top 30 sets más recientes

    console.log("📋 Sets filtrados y guardados:", sets.value.length, "sets");
  } catch (err) {
    console.error("❌ Error cargando sets:", err);
    // El endpoint ya maneja los datos de respaldo, no necesitamos duplicarlos aquí
  }
}

function resetSearch() {
  cards.value = [];
  currentPage.value = 1;
  hasMore.value = true;
  error.value = "";
}

async function searchCards() {
  if (loading.value) return;

  loading.value = true;
  error.value = "";

  try {
    console.log("🔍 Iniciando búsqueda a través de nuestro endpoint...");

    // Construir query para nuestro endpoint
    const queryParams = {
      pageSize: 24,
      page: currentPage.value,
      orderBy: '-set.releaseDate'
    };

    // Construir filtros para la API de Pokémon TCG
    const filters = [];
    
    if (searchTerm.value.trim()) {
      filters.push(`name:"*${searchTerm.value.trim()}*"`);
    }
    
    if (selectedSet.value) {
      filters.push(`set.id:${selectedSet.value}`);
    }
    
    if (selectedRarity.value) {
      filters.push(`rarity:"${selectedRarity.value}"`);
    }
    
    if (selectedType.value) {
      filters.push(`types:${selectedType.value}`);
    }
    
    if (activeFilter.value) {
      if (activeFilter.value === 'Pokémon') {
        filters.push('supertype:Pokémon');
      } else if (activeFilter.value === 'Trainer') {
        filters.push('supertype:Trainer');
      } else if (activeFilter.value === 'Energy') {
        filters.push('supertype:Energy');
      } else if (activeFilter.value.includes('Rare')) {
        filters.push(`rarity:"${activeFilter.value}"`);
      }
    }

    // Si hay filtros, agregarlos como query 'q'
    if (filters.length > 0) {
      queryParams.q = filters.join(' ');
    }

    console.log("📋 Parámetros de búsqueda:", queryParams);

    const data = await $fetch('/api/pokemon-tcg/cards', {
      query: queryParams
    });

    console.log("✅ Datos recibidos:", {
      totalCount: data.totalCount,
      cardsReceived: data.data?.length || 0,
    });

    if (currentPage.value === 1) {
      cards.value = data.data || [];
    } else {
      cards.value.push(...(data.data || []));
    }

    totalCards.value = data.totalCount || 0;
    hasMore.value = currentPage.value * 24 < totalCards.value;

    console.log("🎯 Cartas cargadas:", cards.value.length);

    // El endpoint ya maneja los datos de respaldo, no necesitamos duplicarlos aquí
  } catch (err) {
    console.error("❌ Error en búsqueda:", err);
    error.value = "Error cargando cartas. Verifica tu conexión.";
  } finally {
    loading.value = false;
  }
}

function useExampleCards() {
  const exampleCards = [
    {
      id: "base1-4",
      name: "Charizard",
      supertype: "Pokémon",
      subtypes: ["Stage 2"],
      hp: "120",
      types: ["Fire"],
      rarity: "Rare Holo",
      artist: "Mitsuhiro Arita",
      set: {
        id: "base1",
        name: "Base Set",
        releaseDate: "1999/01/09",
      },
      number: "4",
      attacks: [
        {
          name: "Fire Spin",
          cost: ["Fire", "Fire", "Fire", "Fire"],
          damage: "100",
          text: "Discard 2 Energy cards attached to Charizard in order to use this attack.",
        },
      ],
      weaknesses: [
        {
          type: "Water",
          value: "×2",
        },
      ],
      images: {
        small: "https://images.pokemontcg.io/base1/4.png",
        large: "https://images.pokemontcg.io/base1/4_hires.png",
      },
      tcgplayer: {
        prices: {
          holofoil: {
            low: 89.99,
            mid: 150.0,
            high: 299.99,
            market: 175.5,
          },
        },
      },
    },
    {
      id: "base1-25",
      name: "Pikachu",
      supertype: "Pokémon",
      subtypes: ["Basic"],
      hp: "60",
      types: ["Lightning"],
      rarity: "Common",
      artist: "Mitsuhiro Arita",
      set: {
        id: "base1",
        name: "Base Set",
        releaseDate: "1999/01/09",
      },
      number: "25",
      attacks: [
        {
          name: "Thunder Jolt",
          cost: ["Lightning", "Colorless"],
          damage: "30",
          text: "Flip a coin. If tails, Pikachu does 10 damage to itself.",
        },
      ],
      weaknesses: [
        {
          type: "Fighting",
          value: "×2",
        },
      ],
      images: {
        small: "https://images.pokemontcg.io/base1/25.png",
        large: "https://images.pokemontcg.io/base1/25_hires.png",
      },
      tcgplayer: {
        prices: {
          normal: {
            low: 1.99,
            mid: 3.5,
            high: 8.99,
            market: 4.25,
          },
        },
      },
    },
  ];

  cards.value = exampleCards;
  totalCards.value = exampleCards.length;
  hasMore.value = false;
  console.log("Cartas de ejemplo cargadas:", exampleCards.length);
}

function quickFilter(type) {
  activeFilter.value = activeFilter.value === type ? "" : type;
  resetSearch();
  searchCards();
}

function clearFilters() {
  activeFilter.value = "";
  selectedSet.value = "";
  selectedRarity.value = "";
  selectedType.value = "";
  searchTerm.value = "";
  resetSearch();
  searchCards();
}

function loadMore() {
  currentPage.value++;
  searchCards();
}

function selectCard(card) {
  selectedCard.value = card;
}

function closeModal() {
  selectedCard.value = null;
}

// Funciones auxiliares para UI
function getRarityColor(rarity) {
  const colors = {
    Common: "bg-gray-500",
    Uncommon: "bg-green-500",
    Rare: "bg-blue-500",
    "Rare Holo": "bg-purple-500",
    "Rare Holo EX": "bg-purple-600",
    "Rare Holo GX": "bg-purple-700",
    "Rare Holo V": "bg-indigo-600",
    "Rare Holo VMAX": "bg-indigo-700",
    "Ultra Rare": "bg-yellow-500",
    "Rare Secret": "bg-pink-500",
  };
  return colors[rarity] || "bg-gray-400";
}

function getRarityShort(rarity) {
  const shorts = {
    Common: "C",
    Uncommon: "UC",
    Rare: "R",
    "Rare Holo": "RH",
    "Rare Holo EX": "EX",
    "Rare Holo GX": "GX",
    "Rare Holo V": "V",
    "Rare Holo VMAX": "VMAX",
    "Ultra Rare": "UR",
    "Rare Secret": "SR",
  };
  return shorts[rarity] || "R";
}

function getTypeColor(type) {
  const colors = {
    Colorless: "bg-gray-400",
    Darkness: "bg-gray-800",
    Dragon: "bg-purple-600",
    Fairy: "bg-pink-400",
    Fighting: "bg-red-600",
    Fire: "bg-red-500",
    Grass: "bg-green-500",
    Lightning: "bg-yellow-400",
    Metal: "bg-gray-500",
    Psychic: "bg-purple-500",
    Water: "bg-blue-500",
  };
  return colors[type] || "bg-gray-400";
}

function getCardPrice(card) {
  if (!card.tcgplayer?.prices) return null;

  const prices = card.tcgplayer.prices;
  if (prices.holofoil?.market) return prices.holofoil.market;
  if (prices.reverseHolofoil?.market) return prices.reverseHolofoil.market;
  if (prices.normal?.market) return prices.normal.market;
  if (prices.unlimited?.market) return prices.unlimited.market;

  return null;
}

async function addToCollection() {
  if (!selectedCard.value) return;

  try {
    // Simular agregar a colección
    const toast = useToast();
    toast.success(`¡${selectedCard.value.name} agregada a tu colección!`);
    closeModal();
  } catch (err) {
    console.error("Error agregando carta:", err);
    const toast = useToast();
    toast.error("Error al agregar la carta. Intenta de nuevo.");
  }
}

function handleImageError(event) {
  event.target.style.display = "none";
}

// Metadata
useHead({
  title: "Explorar Cartas - TCG Manager",
  meta: [
    {
      name: "description",
      content:
        "Descubre cartas increíbles de Pokémon TCG de todas las expansiones y colecciones.",
    },
  ],
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animaciones */
.transition-all {
  transition: all 0.3s ease;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
