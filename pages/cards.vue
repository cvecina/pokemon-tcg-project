<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900"
  >
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
              placeholder="Buscar cartas por nombre (mín. 2 caracteres)..."
              class="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
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

            <!-- Indicador de búsqueda pendiente -->
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div v-if="isSearchPending" class="flex items-center space-x-2">
                <div
                  class="loading loading-spinner loading-sm text-orange-400"
                ></div>
                <span class="text-xs text-orange-300">Buscando...</span>
              </div>
              <div v-else-if="loading" class="flex items-center space-x-2">
                <div
                  class="loading loading-spinner loading-sm text-green-400"
                ></div>
                <span class="text-xs text-green-300">Cargando...</span>
              </div>
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
        <div
          v-if="totalCards > 0 && !loading && !isSearchPending"
          class="text-white/70 text-sm"
        >
          Mostrando {{ cards.length }} de
          {{ totalCards.toLocaleString() }} cartas
          <span class="text-green-400 ml-2">🚀 API directa</span>
        </div>
        <div
          v-else-if="
            isSearchPending &&
            searchTerm.length > 0 &&
            searchTerm.length < MIN_SEARCH_LENGTH
          "
          class="text-white/70 text-sm"
        >
          ✍️ Escribe al menos {{ MIN_SEARCH_LENGTH }} caracteres para buscar...
        </div>
        <div v-else-if="isSearchPending" class="text-white/70 text-sm">
          ⏳ Esperando a que termines de escribir...
        </div>
        <div
          v-else-if="loading"
          class="text-white/70 text-sm flex items-center space-x-2"
        >
          <div class="loading loading-spinner loading-sm"></div>
          <span>Conexión directa a Pokémon TCG API...</span>
        </div>
      </div>

      <!-- Loading inicial (solo para primera carga) -->
      <div v-if="loading && currentPage === 1" class="flex justify-center py-12">
        <div class="loading loading-spinner loading-lg text-white"></div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error && cards.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">😔</div>
        <h3 class="text-xl font-bold text-white mb-2">
          Error al cargar cartas
        </h3>
        <p class="text-white/80 mb-4">{{ error }}</p>
        <button
          @click="searchCards"
          class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Reintentar carga desde API
        </button>
      </div>

      <!-- Grid de cartas -->
      <div
        v-if="cards.length > 0"
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
              decoding="async"
              fetchpriority="low"
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
      <div v-else-if="cards.length === 0 && !loading" class="text-center py-12">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-bold text-white mb-2">
          ¡Busca cartas para comenzar!
        </h3>
        <p class="text-white/80 mb-4">
          Escribe el nombre de una carta, selecciona un tipo o usa los filtros
          rápidos para empezar a explorar.
        </p>
        <div class="text-white/60 text-sm">
          💡 Tip: Prueba buscar "Pikachu", "Charizard" o usa los filtros rápidos
          de arriba
        </div>
      </div>

      <!-- Error al cargar más cartas (no oculta las existentes) -->
      <div v-if="error && cards.length > 0" class="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mx-auto max-w-2xl mb-6">
        <div class="flex items-center space-x-3">
          <div class="text-2xl">⚠️</div>
          <div>
            <h4 class="text-red-300 font-medium">Error al cargar más cartas</h4>
            <p class="text-red-200 text-sm">{{ error }}</p>
            <button
              @click="loadMore"
              class="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>

      <!-- Elemento invisible para auto-carga (Intersection Observer) -->
      <div 
        v-if="hasMore && cards.length > 0" 
        ref="autoLoadRef" 
        class="h-20 flex items-center justify-center bg-white/5 rounded-lg my-4"
      >
        <div v-if="loading && currentPage > 1" class="flex items-center space-x-3 text-white/70">
          <div class="loading loading-spinner loading-md text-orange-400"></div>
          <span class="text-sm">Cargando más cartas automáticamente... (Página {{ currentPage }})</span>
        </div>
        <div v-else class="text-white/60 text-sm text-center">
          <div class="mb-1">📍 Zona de auto-carga activa</div>
          <div class="text-xs">Quedan {{ totalCards - cards.length }} cartas por cargar</div>
        </div>
      </div>

      <!-- Cargar más -->
      <div v-if="hasMore && cards.length > 0" class="text-center mt-8">
        <!-- Controles manuales opcionales -->
        <div class="mb-4">
          <button
            @click="toggleManualControls"
            class="text-white/70 hover:text-white text-sm underline transition-colors"
          >
            {{ showManualControls ? '🔼 Ocultar controles manuales' : '🔽 Mostrar controles manuales' }}
          </button>
        </div>
        
        <div v-if="showManualControls" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            @click="loadMore"
            :disabled="loading"
            class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              v-if="loading && currentPage > 1"
              class="flex items-center space-x-2"
            >
              <div class="loading loading-spinner loading-sm"></div>
              <span>Cargando página {{ currentPage }}...</span>
            </span>
            <span v-else-if="loading">Cargando...</span>
            <span v-else
              >⚡ Cargar Más ({{
                totalCards - cards.length
              }}
              restantes)</span
            >
          </button>

          <button
            @click="loadAllCards"
            :disabled="loading || totalCards > 1000"
            class="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>🚀</span>
            <span v-if="loading && isLoadingAll">
              <div class="flex items-center space-x-2">
                <div class="loading loading-spinner loading-sm"></div>
                <span>Cargando todas...</span>
              </div>
            </span>
            <span v-else-if="totalCards > 1000"
              >Demasiadas cartas ({{ totalCards }})</span
            >
            <span v-else>Cargar Todas ({{ totalCards }})</span>
          </button>
        </div>        <div v-if="totalCards > 1000" class="text-yellow-300 text-sm mt-2">
          ⚠️ Hay {{ totalCards.toLocaleString() }} cartas. La auto-carga funciona mejor con filtros específicos.
        </div>
        
        <!-- Información de auto-carga -->
        <div class="text-white/60 text-xs mt-3">
          💡 Las cartas se cargan automáticamente al hacer scroll hacia abajo
        </div>
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
                  loading="eager"
                  decoding="async"
                />
                <img
                  v-else-if="selectedCard.images?.small"
                  :src="selectedCard.images.small"
                  :alt="selectedCard.name"
                  class="max-w-full h-auto mx-auto rounded-lg shadow-2xl max-h-96"
                  loading="eager"
                  decoding="async"
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
const selectedRarity = ref("");
const selectedType = ref("");
const activeFilter = ref("");
const cards = ref([]);
const loading = ref(false);
const error = ref("");
const selectedCard = ref(null);
const currentPage = ref(1);
const hasMore = ref(true);
const totalCards = ref(0);
const isLoadingAll = ref(false); // Nueva variable para indicar carga masiva
const autoLoadRef = ref(null); // Referencia para el observer de auto-carga
const showManualControls = ref(false); // Controlar visibilidad de botones manuales

// Variables para debouncing
const searchTimeout = ref(null);
const DEBOUNCE_DELAY = 400; // Reducido a 400ms para respuesta más rápida
const MIN_SEARCH_LENGTH = 2; // Reducido a 2 caracteres para buscar más rápido
const isSearchPending = ref(false); // Indica si hay una búsqueda pendiente

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
  console.log("🚀 Componente montado - esperando búsqueda del usuario");
  
  // Configurar Intersection Observer para auto-carga
  setupAutoLoad();
  
  // No cargar cartas automáticamente, solo mostrar mensaje inicial
  // El usuario debe buscar algo para ver resultados
});

// Configurar auto-carga con Intersection Observer
function setupAutoLoad() {
  if (typeof window === 'undefined') return; // SSR safety
  
  let observer;
  
  const createObserver = () => {
    if (observer) {
      observer.disconnect();
    }
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && hasMore.value && !loading.value && cards.value.length > 0) {
            console.log('🔄 Auto-cargando más cartas... Current page:', currentPage.value);
            loadMore();
          }
        });
      },
      {
        rootMargin: '200px', // Aumentado a 200px para cargar antes
        threshold: 0.1
      }
    );
    
    return observer;
  };
  
  // Función para re-observar el elemento
  const observeElement = () => {
    nextTick(() => {
      if (autoLoadRef.value && observer) {
        observer.observe(autoLoadRef.value);
        console.log('👁️ Observando elemento para auto-carga');
      }
    });
  };
  
  // Crear observer inicial
  observer = createObserver();
  
  // Observar cuando el elemento esté disponible
  observeElement();
  
  // Re-observar después de cada carga
  watch([cards, hasMore], () => {
    if (hasMore.value && cards.value.length > 0) {
      observeElement();
    }
  }, { flush: 'post' });
  
  // Limpiar observer al desmontar
  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
}

// Función para manejar el debouncing de búsqueda
function debouncedSearch() {
  // Limpiar el timeout anterior si existe
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  // Si la búsqueda es muy corta, no buscar
  if (
    searchTerm.value.trim() &&
    searchTerm.value.trim().length < MIN_SEARCH_LENGTH
  ) {
    console.log(
      `⚠️ Búsqueda muy corta (${searchTerm.value.length} caracteres), esperando al menos ${MIN_SEARCH_LENGTH}`
    );
    isSearchPending.value = true;
    return;
  }

  // Indicar que hay una búsqueda pendiente
  isSearchPending.value = true;

  // Configurar nuevo timeout
  searchTimeout.value = setTimeout(() => {
    console.log("🔍 Ejecutando búsqueda después del debounce...");
    isSearchPending.value = false;
    resetSearch();
    searchCards();
  }, DEBOUNCE_DELAY);
}

// Watchers para búsqueda con debouncing
watch(searchTerm, () => {
  console.log("✍️ Usuario escribiendo:", searchTerm.value);
  debouncedSearch();
});

// Para filtros, búsqueda inmediata (sin debouncing)
watch([selectedRarity, selectedType], () => {
  console.log("🎛️ Filtros cambiados, búsqueda inmediata");
  resetSearch();
  searchCards();
});

// Cerrar menú móvil al hacer click fuera
onMounted(async () => {
  console.log("🚀 Componente montado - esperando búsqueda del usuario");
  
  // Configurar Intersection Observer para auto-carga
  setupAutoLoad();
  
  // No cargar cartas automáticamente, solo mostrar mensaje inicial
  // El usuario debe buscar algo para ver resultados
});

// Limpiar timeout al desmontar el componente
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  isSearchPending.value = false;
});

// Funciones
function resetSearch() {
  cards.value = [];
  currentPage.value = 1;
  hasMore.value = true;
  error.value = "";
}

async function searchCards() {
  if (loading.value) {
    console.log("⚠️ Ya hay una búsqueda en curso");
    return;
  }

  // Si es la primera página, validar filtros
  if (currentPage.value === 1) {
    // Validar longitud mínima de búsqueda si hay texto
    const hasValidSearch =
      !searchTerm.value.trim() ||
      searchTerm.value.trim().length >= MIN_SEARCH_LENGTH;

    // No buscar si no hay filtros aplicados O si la búsqueda es muy corta
    if (
      !hasValidSearch ||
      (!searchTerm.value.trim() &&
        !selectedRarity.value &&
        !selectedType.value &&
        !activeFilter.value)
    ) {
      if (!hasValidSearch) {
        console.log(
          `⚠️ Búsqueda muy corta (${searchTerm.value.length} caracteres), necesitas al menos ${MIN_SEARCH_LENGTH}`
        );
      } else {
        console.log(
          "⚠️ No hay filtros - no se ejecuta búsqueda para evitar carga masiva"
        );
      }
      cards.value = [];
      totalCards.value = 0;
      hasMore.value = false;
      return;
    }
  }

  loading.value = true;
  error.value = "";

  try {
    const isLoadingMore = currentPage.value > 1;
    console.log(
      isLoadingMore
        ? `📄 Cargando página ${currentPage.value}...`
        : "🔍 Buscando cartas directamente desde API de Pokémon TCG..."
    );

    // Construir URL de la API directa de Pokémon TCG
    const baseUrl = "https://api.pokemontcg.io/v2/cards";
    const params = new URLSearchParams();

    // Parámetros de paginación
    params.append("pageSize", "8"); // Reducido a 8 para carga más rápida
    params.append("page", currentPage.value.toString());
    params.append("orderBy", "-set.releaseDate");

    // Construir filtros para la API de Pokémon TCG (simplificados)
    const filters = [];

    if (searchTerm.value.trim()) {
      // Búsqueda más simple y rápida
      filters.push(`name:${searchTerm.value.trim()}`);
    }

    if (selectedRarity.value) {
      filters.push(`rarity:"${selectedRarity.value}"`);
    }

    if (selectedType.value) {
      filters.push(`types:${selectedType.value}`);
    }

    if (activeFilter.value) {
      if (activeFilter.value === "Pokémon") {
        filters.push("supertype:Pokémon");
      } else if (activeFilter.value === "Trainer") {
        filters.push("supertype:Trainer");
      } else if (activeFilter.value === "Energy") {
        filters.push("supertype:Energy");
      } else if (activeFilter.value.includes("Rare")) {
        filters.push(`rarity:"${activeFilter.value}"`);
      }
    }

    // Si hay filtros, agregarlos como query 'q'
    if (filters.length > 0) {
      params.append("q", filters.join(" "));
    }

    const url = `${baseUrl}?${params.toString()}`;
    console.log("📋 URL de búsqueda:", url);

    // Hacer la petición directa con fetch nativo (más rápido)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos

    const response = await fetch(url, {
      // Sin API key para evitar límites - la API pública es gratis
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ Datos recibidos:", {
      page: currentPage.value,
      totalCount: data.totalCount,
      cardsReceived: data.data?.length || 0,
      isLoadingMore,
    });

    if (currentPage.value === 1) {
      // Nueva búsqueda - reemplazar cartas
      cards.value = data.data || [];
    } else {
      // Cargar más - agregar cartas
      cards.value.push(...(data.data || []));
    }

    totalCards.value = data.totalCount || 0;
    hasMore.value = currentPage.value * 8 < totalCards.value; // Actualizado para pageSize 8

    console.log("🎯 Estado final:", {
      totalCardsLoaded: cards.value.length,
      totalCardsAvailable: totalCards.value,
      hasMore: hasMore.value,
      currentPage: currentPage.value,
    });
  } catch (err) {
    console.error("❌ Error en búsqueda:", err);
    if (err.name === "AbortError") {
      error.value =
        "La búsqueda tardó demasiado. Intenta con términos más específicos.";
    } else {
      error.value = "Error cargando cartas desde la API. Verifica tu conexión.";
    }
    
    // Si es la primera página, no hay cartas para mostrar
    // Si no, mantenemos las cartas existentes y solo mostramos el error
    if (currentPage.value === 1) {
      cards.value = [];
      hasMore.value = false;
    }
  } finally {
    loading.value = false;
  }
}

function quickFilter(type) {
  activeFilter.value = activeFilter.value === type ? "" : type;
  console.log("⚡ Filtro rápido aplicado:", type);

  // Limpiar cualquier búsqueda pendiente
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  isSearchPending.value = false;

  resetSearch();
  searchCards();
}

function clearFilters() {
  activeFilter.value = "";
  selectedRarity.value = "";
  selectedType.value = "";
  searchTerm.value = "";

  console.log("🧹 Todos los filtros limpiados");

  // Limpiar cualquier búsqueda pendiente
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  isSearchPending.value = false;

  resetSearch();
  searchCards();
}

function loadMore() {
  if (loading.value || !hasMore.value) {
    console.log("⚠️ No se puede cargar más:", {
      loading: loading.value,
      hasMore: hasMore.value,
    });
    return;
  }

  console.log("📄 Cargando página siguiente:", currentPage.value + 1, "Auto-carga activada");
  currentPage.value++;
  searchCards();
}

async function loadAllCards() {
  if (loading.value || !hasMore.value || totalCards.value > 1000) {
    console.log("⚠️ No se puede cargar todas las cartas");
    return;
  }

  console.log(`🚀 Iniciando carga masiva de ${totalCards.value} cartas...`);
  isLoadingAll.value = true;
  loading.value = true;
  error.value = "";

  try {
    // Calcular cuántas páginas necesitamos cargar
    const remainingCards = totalCards.value - cards.value.length;
    const pagesNeeded = Math.ceil(remainingCards / 8);

    console.log(
      `📊 Cargando ${pagesNeeded} páginas adicionales para obtener ${remainingCards} cartas restantes`
    );

    // Cargar todas las páginas en paralelo para máxima velocidad
    const promises = [];
    for (
      let page = currentPage.value + 1;
      page <= currentPage.value + pagesNeeded;
      page++
    ) {
      promises.push(loadPage(page));
    }

    const results = await Promise.all(promises);

    // Combinar todos los resultados
    const allNewCards = results.flat().filter((card) => card); // Filtrar nulls
    cards.value.push(...allNewCards);

    console.log(
      `✅ Carga masiva completada: ${allNewCards.length} cartas adicionales cargadas`
    );
    console.log(
      `🎯 Total de cartas ahora: ${cards.value.length} de ${totalCards.value}`
    );

    hasMore.value = false;
    currentPage.value = currentPage.value + pagesNeeded;
  } catch (err) {
    console.error("❌ Error en carga masiva:", err);
    error.value = "Error cargando todas las cartas. Intenta cargar de a poco.";
  } finally {
    loading.value = false;
    isLoadingAll.value = false;
  }
}

async function loadPage(pageNumber) {
  try {
    console.log(`📄 Cargando página ${pageNumber}...`);

    // Construir URL igual que en searchCards pero para página específica
    const baseUrl = "https://api.pokemontcg.io/v2/cards";
    const params = new URLSearchParams();

    params.append("pageSize", "8");
    params.append("page", pageNumber.toString());
    params.append("orderBy", "-set.releaseDate");

    // Usar los mismos filtros que la búsqueda actual
    const filters = [];

    if (searchTerm.value.trim()) {
      filters.push(`name:${searchTerm.value.trim()}`);
    }

    if (selectedRarity.value) {
      filters.push(`rarity:"${selectedRarity.value}"`);
    }

    if (selectedType.value) {
      filters.push(`types:${selectedType.value}`);
    }

    if (activeFilter.value) {
      if (activeFilter.value === "Pokémon") {
        filters.push("supertype:Pokémon");
      } else if (activeFilter.value === "Trainer") {
        filters.push("supertype:Trainer");
      } else if (activeFilter.value === "Energy") {
        filters.push("supertype:Energy");
      } else if (activeFilter.value.includes("Rare")) {
        filters.push(`rarity:"${activeFilter.value}"`);
      }
    }

    if (filters.length > 0) {
      params.append("q", filters.join(" "));
    }

    const url = `${baseUrl}?${params.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Timeout más largo para carga masiva

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} en página ${pageNumber}`);
    }

    const data = await response.json();
    console.log(
      `✅ Página ${pageNumber} cargada: ${data.data?.length || 0} cartas`
    );

    return data.data || [];
  } catch (err) {
    console.error(`❌ Error cargando página ${pageNumber}:`, err);
    return []; // Retornar array vacío en caso de error
  }
}

function selectCard(card) {
  selectedCard.value = card;
}

function closeModal() {
  selectedCard.value = null;
}

function toggleManualControls() {
  showManualControls.value = !showManualControls.value;
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

/* Animaciones mejoradas */
.transition-all {
  transition: all 0.3s ease;
}

/* Animación suave para cartas que aparecen */
.grid > div {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animación escalonada para múltiples cartas */
.grid > div:nth-child(1) { animation-delay: 0.05s; }
.grid > div:nth-child(2) { animation-delay: 0.1s; }
.grid > div:nth-child(3) { animation-delay: 0.15s; }
.grid > div:nth-child(4) { animation-delay: 0.2s; }
.grid > div:nth-child(5) { animation-delay: 0.25s; }
.grid > div:nth-child(6) { animation-delay: 0.3s; }
.grid > div:nth-child(7) { animation-delay: 0.35s; }
.grid > div:nth-child(8) { animation-delay: 0.4s; }

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

/* Controles manuales expandibles */
.manual-controls-enter-active,
.manual-controls-leave-active {
  transition: all 0.3s ease;
}

.manual-controls-enter-from,
.manual-controls-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Menú móvil animaciones */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Botón hamburguesa animación */
.hamburger-button {
  transition: transform 0.2s ease;
}

.hamburger-button:active {
  transform: scale(0.95);
}
</style>
