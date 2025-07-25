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
        
        <!-- Estadísticas de caché y controles -->
        <div class="mt-4 pt-4 border-t border-white/20">
          <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <!-- Estadísticas del caché -->
            <div class="flex flex-wrap gap-2 items-center">
              <span class="text-sm text-white/80">📊 Caché:</span>
              <span class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-semibold">
                🐾 {{ getCacheStats().pokemon }} Pokémon
              </span>
              <span class="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-semibold">
                🥊 {{ getCacheStats().moves }} Movimientos
              </span>
              <span class="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs font-semibold">
                ⚡ {{ getCacheStats().abilities }} Habilidades
              </span>
              <span class="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-semibold">
                📈 {{ getCacheStats().total }} Total
              </span>
            </div>
            
            <!-- Controles del caché -->
            <div class="flex gap-2">
              <button 
                @click="preloadPopularPokemon"
                :disabled="loading"
                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
              >
                🚀 Precargar Populares
              </button>
              <button 
                @click="clearAllCache"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                🧹 Limpiar Caché
              </button>
            </div>
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
        class="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8"
      >
        <div class="grid md:grid-cols-2 gap-8 items-start">
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
                class="px-4 py-2 rounded-full text-white font-bold text-sm"
              >
                {{ getTypeInSpanish(type.type.name) }}
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
                <div class="w-32 text-sm font-medium text-white/80">
                  {{ getStatNameInSpanish(stat.stat.name) }}:
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
              <span class="text-xs text-yellow-300 font-normal">(Haz clic para ver detalles)</span>
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="ability in pokemon.abilities"
                :key="ability.slot"
                @click="showAbilityDetails(ability.ability.name)"
                :class="
                  ability.is_hidden
                    ? 'bg-purple-600 text-white'
                    : 'bg-blue-600 text-white'
                "
                class="px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-opacity-80 transition-colors"
              >
                {{ getAbilityNameInSpanish(ability.ability.name) }}
                <span v-if="ability.is_hidden" class="text-xs">(Oculta)</span>
              </span>
            </div>

            <!-- Movimientos destacados -->
            <h3 class="text-2xl font-bold text-white mb-4 mt-6">
              🥊 Movimientos
            </h3>
            
            <!-- Movimientos destacados (primeros 8) -->
            <div class="mb-4">
              <h4 class="text-lg font-semibold text-white/90 mb-2">
                Algunos Movimientos:
                <span class="text-xs text-yellow-300 font-normal">(Haz clic para ver detalles)</span>
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="move in pokemon.moves.slice(0, 8)"
                  :key="move.move.name"
                  @click="showMoveDetails(move.move.name)"
                  class="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium cursor-pointer hover:bg-white/30 transition-colors"
                >
                  <div class="capitalize font-semibold mb-1">
                    {{ getMoveNameInSpanish(move.move.name) }}
                  </div>
                  
                  <!-- Mostrar tipo si está disponible -->
                  <div v-if="featuredMovesDetails[move.move.name]" class="flex gap-1">
                    <span 
                      :class="getTypeColor(featuredMovesDetails[move.move.name].type)"
                      class="px-1 py-0.5 rounded text-xs font-bold"
                    >
                      {{ getTypeInSpanish(featuredMovesDetails[move.move.name].type) }}
                    </span>
                    <span 
                      v-if="featuredMovesDetails[move.move.name].power !== '-'"
                      class="bg-red-500 text-white px-1 py-0.5 rounded text-xs font-bold"
                    >
                      ⚡{{ featuredMovesDetails[move.move.name].power }}
                    </span>
                  </div>
                  
                  <!-- Loading para movimientos que aún se están cargando -->
                  <div v-else class="text-xs text-white/60">
                    Cargando tipo...
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón para mostrar todos los movimientos -->
            <div class="mb-4">
              <button 
                @click="toggleAllMoves"
                :disabled="loadingMoves"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <span v-if="loadingMoves">⏳</span>
                <span v-else>{{ showAllMoves ? '🔽' : '▶️' }}</span>
                <span>{{ showAllMoves ? 'Ocultar' : 'Ver' }} Todos los Movimientos ({{ pokemon.moves.length }})</span>
                <span v-if="loadingMoves" class="text-xs">Cargando tipos...</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Lista completa de movimientos (expandible) - Fuera del grid para ocupar todo el ancho -->
        <div v-if="showAllMoves" class="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 max-h-96 overflow-y-auto">
          <h4 class="text-xl font-semibold text-white mb-4 text-center">
            🥊 Todos los Movimientos
            <div class="text-sm text-yellow-300 font-normal mt-1">(Haz clic en cualquier movimiento para ver su descripción)</div>
          </h4>
          
          <!-- Indicador de carga -->
          <div v-if="loadingMoves" class="text-center py-8">
            <div class="loading loading-spinner loading-md text-white mb-2"></div>
            <p class="text-white/70">Cargando tipos de movimientos...</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div 
              v-for="(move, index) in pokemon.moves" 
              :key="move.move.name"
              @click="showMoveDetails(move.move.name)"
              class="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-white/30 transition-colors"
            >
              <div class="flex justify-between items-start mb-1">
                <span class="capitalize font-semibold">{{ getMoveNameInSpanish(move.move.name) }}</span>
                <span class="text-xs text-white/60">#{{ index + 1 }}</span>
              </div>
              
              <!-- Detalles del movimiento -->
              <div v-if="movesDetails[move.move.name]" class="flex flex-wrap gap-1 mt-2">
                <span 
                  :class="getTypeColor(movesDetails[move.move.name].type)"
                  class="px-2 py-1 rounded text-xs font-bold"
                >
                  {{ getTypeInSpanish(movesDetails[move.move.name].type) }}
                </span>
                <span 
                  v-if="movesDetails[move.move.name].power !== '-'"
                  class="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  ⚡{{ movesDetails[move.move.name].power }}
                </span>
              </div>
              
              <!-- Fallback si no hay detalles -->
              <div v-else class="mt-2">
                <span class="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                  Cargando...
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-4 text-center">
            <p class="text-white/70 text-sm">
              Mostrando TODOS los {{ pokemon.moves.length }} movimientos de {{ pokemon.name }}
            </p>
            <div class="mt-2 flex justify-center gap-2 flex-wrap">
              <span class="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                ⚡ Carga paralela ultrarrápida
              </span>
              <span class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                🧠 Sistema de caché inteligente
              </span>
              <span class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                🎯 TODOS los movimientos mostrados
              </span>
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

    <!-- Modal de detalles de movimiento -->
    <div v-if="showMoveModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="closeMoveModal">
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden" @click.stop>
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold text-white capitalize">
              {{ selectedMove?.spanishName || selectedMove?.name?.replace('-', ' ') || 'Cargando...' }}
            </h3>
            <p v-if="selectedMove?.spanishName && selectedMove?.name !== selectedMove?.spanishName" class="text-sm text-orange-100 capitalize">
              {{ selectedMove?.name?.replace('-', ' ') }}
            </p>
          </div>
          <button @click="closeMoveModal" class="text-white hover:text-gray-300 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Contenido del modal -->
        <div class="p-6">
          <div v-if="loadingMoveDetails" class="text-center py-8">
            <div class="loading loading-spinner loading-md text-white mb-2"></div>
            <p class="text-white/70">Cargando detalles del movimiento...</p>
          </div>

          <div v-else-if="selectedMove" class="space-y-4">
            <!-- Información básica -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white/10 rounded-lg p-3 text-center">
                <div class="text-sm text-white/70 mb-1">Tipo</div>
                <span :class="getTypeColor(selectedMove.type)" class="px-3 py-1 rounded-full text-white font-bold text-sm">
                  {{ getTypeInSpanish(selectedMove.type) }}
                </span>
              </div>
              <div class="bg-white/10 rounded-lg p-3 text-center">
                <div class="text-sm text-white/70 mb-1">Categoría</div>
                <span class="text-white font-semibold">
                  {{ selectedMove.damage_class_spanish || 'Desconocido' }}
                </span>
              </div>
            </div>

            <!-- Stats del movimiento -->
            <div class="grid grid-cols-3 gap-2">
              <div class="bg-white/10 rounded-lg p-2 text-center">
                <div class="text-xs text-white/70">Poder</div>
                <div class="text-lg font-bold text-red-400">{{ selectedMove.power }}</div>
              </div>
              <div class="bg-white/10 rounded-lg p-2 text-center">
                <div class="text-xs text-white/70">Precisión</div>
                <div class="text-lg font-bold text-blue-400">{{ selectedMove.accuracy }}%</div>
              </div>
              <div class="bg-white/10 rounded-lg p-2 text-center">
                <div class="text-xs text-white/70">PP</div>
                <div class="text-lg font-bold text-green-400">{{ selectedMove.pp }}</div>
              </div>
            </div>

            <!-- Prioridad (si no es 0) -->
            <div v-if="selectedMove.priority !== 0" class="bg-yellow-500/20 rounded-lg p-3">
              <div class="text-sm text-yellow-300 font-semibold">
                Prioridad: {{ selectedMove.priority > 0 ? '+' : '' }}{{ selectedMove.priority }}
              </div>
            </div>

            <!-- Descripción -->
            <div class="bg-white/10 rounded-lg p-4">
              <div class="text-sm text-white/70 mb-2">Descripción:</div>
              <p class="text-white text-sm leading-relaxed">
                {{ selectedMove.description }}
              </p>
            </div>

            <!-- Probabilidad de efecto (si existe) -->
            <div v-if="selectedMove.effect_chance" class="bg-purple-500/20 rounded-lg p-3">
              <div class="text-sm text-purple-300">
                Probabilidad de efecto: {{ selectedMove.effect_chance }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles de habilidad -->
    <div v-if="showAbilityModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="closeAbilityModal">
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden" @click.stop>
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold text-white">
              {{ selectedAbility?.spanishName || selectedAbility?.name?.replace('-', ' ') || 'Cargando...' }}
            </h3>
            <p v-if="selectedAbility?.spanishName && selectedAbility?.name !== selectedAbility?.spanishName" class="text-sm text-blue-100">
              {{ selectedAbility?.name?.replace('-', ' ') }}
            </p>
            <p v-if="selectedAbility?.is_hidden" class="text-xs text-yellow-300 font-semibold">
              ✨ Habilidad Oculta
            </p>
          </div>
          <button @click="closeAbilityModal" class="text-white hover:text-gray-300 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Contenido del modal -->
        <div class="p-6">
          <div v-if="loadingAbilityDetails" class="text-center py-8">
            <div class="loading loading-spinner loading-md text-white mb-2"></div>
            <p class="text-white/70">Cargando detalles de la habilidad...</p>
          </div>

          <div v-else-if="selectedAbility" class="space-y-4">
            <!-- Descripción principal -->
            <div class="bg-white/10 rounded-lg p-4">
              <div class="text-sm text-white/70 mb-2">Descripción:</div>
              <p class="text-white text-sm leading-relaxed">
                {{ selectedAbility.description }}
              </p>
            </div>

            <!-- Efecto detallado (solo si existe en español y es diferente de la descripción) -->
            <div v-if="selectedAbility.effect && selectedAbility.effect.trim() !== '' && selectedAbility.effect !== selectedAbility.description && selectedAbility.effect.length > 20" class="bg-blue-500/20 rounded-lg p-4">
              <div class="text-sm text-blue-300 mb-2 font-semibold">Efecto Detallado:</div>
              <p class="text-white text-sm leading-relaxed">
                {{ selectedAbility.effect }}
              </p>
            </div>

            <!-- Información adicional -->
            <div class="bg-white/10 rounded-lg p-3">
              <div class="text-sm text-white/70 mb-2">Información:</div>
              <div class="space-y-1">
                <div class="text-white text-xs">
                  <span class="text-white/70">Tipo:</span>
                  <span class="ml-2 font-semibold">
                    {{ selectedAbility.is_hidden ? 'Habilidad Oculta' : 'Habilidad Normal' }}
                  </span>
                </div>
                <div v-if="selectedAbility.generation" class="text-white text-xs">
                  <span class="text-white/70">Introducida en:</span>
                  <span class="ml-2 font-semibold capitalize">
                    {{ getGenerationInSpanish(selectedAbility.generation) }}
                  </span>
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
// Store de autenticación
const authStore = useAuthStore();

const pokemon = ref(null);
const loading = ref(false);
const error = ref("");
const searchTerm = ref("");
const currentId = ref(1);
const recentPokemon = ref([]);
const showAllMoves = ref(false);
const movesDetails = ref({});
const loadingMoves = ref(false);
const featuredMovesDetails = ref({});

// Modal de descripción de movimientos
const selectedMove = ref(null);
const showMoveModal = ref(false);
const loadingMoveDetails = ref(false);

// Modal de descripción de habilidades
const selectedAbility = ref(null);
const showAbilityModal = ref(false);
const loadingAbilityDetails = ref(false);

// Sistema de caché avanzado
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
const MAX_CACHE_SIZE = 1000; // Máximo número de elementos en caché

// Función para obtener datos del localStorage de forma segura
function getFromLocalStorage(key, defaultValue = {}) {
  if (process.client) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verificar si tiene estructura de caché con timestamp
        if (parsed.timestamp && (Date.now() - parsed.timestamp < CACHE_EXPIRY_TIME)) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn(`Error leyendo caché ${key}:`, error);
    }
  }
  return defaultValue;
}

// Función para guardar en localStorage de forma segura
function saveToLocalStorage(key, data) {
  if (process.client) {
    try {
      const cacheEntry = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn(`Error guardando caché ${key}:`, error);
      // Si el localStorage está lleno, limpiar cachés antiguos
      clearOldCache();
    }
  }
}

// Función para limpiar cachés antiguos
function clearOldCache() {
  if (process.client) {
    const cacheKeys = ['pokemon-cache', 'moves-cache', 'abilities-cache'];
    cacheKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Error limpiando caché ${key}:`, error);
      }
    });
  }
}

// Función para limpiar caché si excede el tamaño máximo
function trimCache(cache, maxSize = MAX_CACHE_SIZE) {
  const keys = Object.keys(cache);
  if (keys.length > maxSize) {
    // Eliminar los elementos más antiguos (asumiendo que los más recientes están al final)
    const toRemove = keys.length - maxSize;
    for (let i = 0; i < toRemove; i++) {
      delete cache[keys[i]];
    }
  }
}

// Cachés reactivos inicializados desde localStorage
const pokemonCache = ref(getFromLocalStorage('pokemon-cache', {}));
const movesCache = ref(getFromLocalStorage('moves-cache', {}));
const abilitiesCache = ref(getFromLocalStorage('abilities-cache', {}));

// Observar cambios en los cachés y guardarlos automáticamente
watch(pokemonCache, (newCache) => {
  trimCache(newCache);
  saveToLocalStorage('pokemon-cache', newCache);
}, { deep: true });

watch(movesCache, (newCache) => {
  trimCache(newCache);
  saveToLocalStorage('moves-cache', newCache);
}, { deep: true });

watch(abilitiesCache, (newCache) => {
  trimCache(newCache);
  saveToLocalStorage('abilities-cache', newCache);
}, { deep: true });

// Cargar Pokémon inicial
onMounted(() => {
  loadPokemon(1);
});

// Función principal para cargar Pokémon
async function loadPokemon(id) {
  loading.value = true;
  error.value = "";
  showAllMoves.value = false; // Cerrar la lista de movimientos
  movesDetails.value = {}; // Limpiar detalles anteriores
  featuredMovesDetails.value = {}; // Limpiar movimientos destacados

  try {
    // Verificar si ya tenemos este Pokémon en caché
    const cacheKey = id.toString();
    if (pokemonCache.value[cacheKey]) {
      console.log(`🎯 Pokémon #${id} cargado desde caché - instantáneo!`);
      pokemon.value = pokemonCache.value[cacheKey];
      currentId.value = pokemon.value.id;
      
      // Actualizar recientes
      updateRecentPokemon(pokemon.value);
      
      // Cargar movimientos destacados desde caché también
      featuredMovesDetails.value = await loadFeaturedMovesDetails();
      loading.value = false;
      return;
    }

    console.log(`🌐 Cargando Pokémon #${id} desde API...`);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(`Pokémon #${id} no encontrado`);
    }

    const data = await response.json();
    
    // Guardar en caché
    pokemonCache.value[cacheKey] = data;
    console.log(`💾 Pokémon #${id} guardado en caché`);
    
    pokemon.value = data;
    currentId.value = data.id;

    // Actualizar recientes
    updateRecentPokemon(data);
    
    // Cargar automáticamente los tipos de los movimientos destacados
    featuredMovesDetails.value = await loadFeaturedMovesDetails();
  } catch (err) {
    error.value = err.message;
    console.error("Error cargando Pokémon:", err);
  } finally {
    loading.value = false;
  }
}

// Función auxiliar para actualizar lista de Pokémon recientes
function updateRecentPokemon(pokemonData) {
  const existing = recentPokemon.value.findIndex((p) => p.id === pokemonData.id);
  if (existing === -1) {
    recentPokemon.value.unshift(pokemonData);
    if (recentPokemon.value.length > 12) {
      recentPokemon.value.pop();
    }
  } else {
    // Mover al principio si ya existía
    recentPokemon.value.splice(existing, 1);
    recentPokemon.value.unshift(pokemonData);
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

// Cargar detalles de movimientos destacados (primeros 8)
async function loadFeaturedMovesDetails() {
  if (!pokemon.value) return;
  
  const featuredMoves = pokemon.value.moves.slice(0, 8);
  const details = {};
  
  // Verificar caché primero
  for (const move of featuredMoves) {
    if (movesCache.value[move.move.name]) {
      details[move.move.name] = movesCache.value[move.move.name];
    }
  }
  
  // Si ya tenemos todos en caché, terminar
  if (Object.keys(details).length === featuredMoves.length) {
    return details;
  }
  
  // Cargar los que faltan en paralelo
  const missingMoves = featuredMoves.filter(move => !movesCache.value[move.move.name]);
  
  const movePromises = missingMoves.map(async (move) => {
    try {
      const response = await fetch(move.move.url);
      if (response.ok) {
        const moveData = await response.json();
        
        // Buscar nombre en español
        const spanishName = moveData.names.find(name => 
          name.language.name === 'es'
        )?.name || moveData.names.find(name => 
          name.language.name === 'en'
        )?.name || moveData.name;
        
        const moveInfo = {
          type: moveData.type?.name || 'normal',
          power: moveData.power || '-',
          accuracy: moveData.accuracy || '-',
          pp: moveData.pp || '-',
          spanishName: spanishName
        };
        
        // Guardar en caché
        movesCache.value[move.move.name] = moveInfo;
        return { name: move.move.name, data: moveInfo };
      }
    } catch (err) {
      console.error(`Error cargando ${move.move.name}:`, err);
      const fallbackInfo = {
        type: 'normal',
        power: '-',
        accuracy: '-',
        pp: '-',
        spanishName: move.move.name.replace(/-/g, ' ')
      };
      movesCache.value[move.move.name] = fallbackInfo;
      return { name: move.move.name, data: fallbackInfo };
    }
  });
  
  const results = await Promise.all(movePromises);
  results.forEach(result => {
    if (result) {
      details[result.name] = result.data;
    }
  });
  
  return details;
}

// Cargar detalles de movimientos de forma optimizada - TODOS los movimientos
async function loadMovesDetails() {
  if (!pokemon.value) return;
  
  loadingMoves.value = true;
  const details = {};
  
  try {
    // Cargar TODOS los movimientos del Pokémon
    const movesToLoad = pokemon.value.moves;
    console.log(`🎯 Cargando ${movesToLoad.length} movimientos de ${pokemon.value.name}`);
    
    // Separar movimientos que ya están en caché vs nuevos
    const newMoves = [];
    const cachedMoves = [];
    
    for (const move of movesToLoad) {
      if (movesCache.value[move.move.name]) {
        cachedMoves.push(move);
        details[move.move.name] = movesCache.value[move.move.name];
      } else {
        newMoves.push(move);
      }
    }
    
    console.log(`📋 Movimientos: ${cachedMoves.length} en caché, ${newMoves.length} nuevos`);
    
    // Si todos están en caché, terminar rápido
    if (newMoves.length === 0) {
      movesDetails.value = details;
      loadingMoves.value = false;
      console.log(`✅ Todos los movimientos estaban en caché - instantáneo!`);
      return;
    }
    
    // Cargar nuevos movimientos EN PARALELO (mucho más rápido)
    const movePromises = newMoves.map(async (move) => {
      try {
        const response = await fetch(move.move.url);
        if (response.ok) {
          const moveData = await response.json();
          
          // Buscar nombre en español
          const spanishName = moveData.names.find(name => 
            name.language.name === 'es'
          )?.name || moveData.names.find(name => 
            name.language.name === 'en'
          )?.name || moveData.name;
          
          const moveInfo = {
            type: moveData.type?.name || 'normal',
            power: moveData.power || '-',
            accuracy: moveData.accuracy || '-',
            pp: moveData.pp || '-',
            spanishName: spanishName // Agregar nombre en español
          };
          
          // Guardar en caché
          movesCache.value[move.move.name] = moveInfo;
          return { name: move.move.name, data: moveInfo };
        }
      } catch (err) {
        console.error(`Error cargando ${move.move.name}:`, err);
        // Fallback con valores por defecto
        const fallbackInfo = {
          type: 'normal',
          power: '-',
          accuracy: '-',
          pp: '-',
          spanishName: move.move.name.replace(/-/g, ' ')
        };
        movesCache.value[move.move.name] = fallbackInfo;
        return { name: move.move.name, data: fallbackInfo };
      }
    });
    
    // Esperar a que terminen TODAS las peticiones en paralelo
    console.log(`⚡ Iniciando carga paralela de ${newMoves.length} movimientos...`);
    const results = await Promise.all(movePromises);
    
    // Agregar resultados nuevos
    results.forEach(result => {
      if (result) {
        details[result.name] = result.data;
      }
    });
    
    movesDetails.value = details;
    console.log(`✅ ¡Cargados TODOS los ${Object.keys(details).length} movimientos! (${newMoves.length} nuevos, ${cachedMoves.length} de caché)`);
    
  } catch (error) {
    console.error('Error cargando detalles de movimientos:', error);
  } finally {
    loadingMoves.value = false;
  }
}

// Función para mostrar detalles de un movimiento específico
async function showMoveDetails(moveName) {
  loadingMoveDetails.value = true;
  showMoveModal.value = true;
  
  try {
    // Verificar si ya tenemos los detalles completos en caché
    if (movesCache.value[moveName] && movesCache.value[moveName].description) {
      console.log(`🎯 Movimiento ${moveName} cargado desde caché - instantáneo!`);
      selectedMove.value = movesCache.value[moveName];
      loadingMoveDetails.value = false;
      return;
    }
    
    // Buscar el movimiento en la lista del Pokémon para obtener la URL
    const moveData = pokemon.value.moves.find(m => m.move.name === moveName);
    if (!moveData) {
      throw new Error('Movimiento no encontrado');
    }
    
    // Cargar detalles completos del movimiento
    const response = await fetch(moveData.move.url);
    if (!response.ok) {
      throw new Error('Error al cargar detalles del movimiento');
    }
    
    const fullMoveData = await response.json();
    
    // Buscar nombre en español
    const spanishName = fullMoveData.names.find(name => 
      name.language.name === 'es'
    )?.name || fullMoveData.names.find(name => 
      name.language.name === 'en'
    )?.name || fullMoveData.name;
    
    // Buscar descripción en español primero, luego inglés
    const description = fullMoveData.effect_entries.find(entry => 
      entry.language.name === 'es'
    )?.effect || fullMoveData.effect_entries.find(entry => 
      entry.language.name === 'en'
    )?.effect || 'Descripción no disponible';
    
    // Buscar descripción corta en español para efectos más claros
    const shortDescription = fullMoveData.flavor_text_entries.find(entry => 
      entry.language.name === 'es'
    )?.flavor_text || fullMoveData.flavor_text_entries.find(entry => 
      entry.language.name === 'en'
    )?.flavor_text || '';
    
    // Si tenemos descripción corta en español, usarla; si no, usar la descripción larga
    const finalDescription = shortDescription && shortDescription.trim() !== '' ? 
      shortDescription : description;
    
    // Traducir categoría de daño
    const damageClassTranslations = {
      'physical': 'Físico',
      'special': 'Especial', 
      'status': 'Estado'
    };
    
    // Crear objeto con todos los detalles
    const moveDetails = {
      name: fullMoveData.name,
      spanishName: spanishName,
      type: fullMoveData.type?.name || 'normal',
      power: fullMoveData.power || '-',
      accuracy: fullMoveData.accuracy || '-',
      pp: fullMoveData.pp || '-',
      priority: fullMoveData.priority || 0,
      damage_class: fullMoveData.damage_class?.name || 'unknown',
      damage_class_spanish: damageClassTranslations[fullMoveData.damage_class?.name] || 'Desconocido',
      description: finalDescription.replace(/\$effect_chance/g, fullMoveData.effect_chance || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
      shortDescription: shortDescription,
      effect_chance: fullMoveData.effect_chance || null
    };
    
    // Actualizar caché con información completa
    movesCache.value[moveName] = moveDetails;
    selectedMove.value = moveDetails;
    
    console.log(`💾 Movimiento ${moveName} guardado en caché`);
    
    // Forzar actualización de la UI para que se muestren los nombres en español
    nextTick(() => {
      // Esto garantiza que las listas se actualicen con los nombres en español
    });
    
  } catch (error) {
    console.error('Error cargando detalles del movimiento:', error);
    selectedMove.value = {
      name: moveName,
      spanishName: moveName,
      type: 'normal',
      power: '-',
      accuracy: '-',
      pp: '-',
      description: 'Error al cargar la descripción del movimiento.',
      damage_class: 'unknown',
      damage_class_spanish: 'Desconocido'
    };
  } finally {
    loadingMoveDetails.value = false;
  }
}

// Función para cerrar el modal
function closeMoveModal() {
  showMoveModal.value = false;
  selectedMove.value = null;
}

// Función para mostrar detalles de una habilidad específica
async function showAbilityDetails(abilityName) {
  loadingAbilityDetails.value = true;
  showAbilityModal.value = true;
  
  try {
    // Verificar si ya tenemos los detalles completos en caché
    if (abilitiesCache.value[abilityName] && abilitiesCache.value[abilityName].description) {
      console.log(`🎯 Habilidad ${abilityName} cargada desde caché - instantáneo!`);
      selectedAbility.value = abilitiesCache.value[abilityName];
      loadingAbilityDetails.value = false;
      return;
    }
    
    // Buscar la habilidad en la lista del Pokémon para obtener información adicional
    const abilityData = pokemon.value.abilities.find(a => a.ability.name === abilityName);
    
    // Cargar detalles completos de la habilidad desde la API
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    if (!response.ok) {
      throw new Error('Error al cargar detalles de la habilidad');
    }
    
    const fullAbilityData = await response.json();
    
    // Buscar nombre en español
    const spanishName = fullAbilityData.names.find(name => 
      name.language.name === 'es'
    )?.name || fullAbilityData.names.find(name => 
      name.language.name === 'en'
    )?.name || fullAbilityData.name;
    
    // Buscar descripción en español
    const description = fullAbilityData.flavor_text_entries.find(entry => 
      entry.language.name === 'es'
    )?.flavor_text || fullAbilityData.flavor_text_entries.find(entry => 
      entry.language.name === 'en'
    )?.flavor_text || 'Descripción no disponible';
    
    // Buscar efecto detallado SOLO en español
    const spanishEffect = fullAbilityData.effect_entries.find(entry => 
      entry.language.name === 'es'
    )?.effect || '';
    
    // Si no hay efecto en español, no mostrar el efecto detallado
    const finalEffect = spanishEffect && spanishEffect.trim() !== '' ? spanishEffect : '';
    
    // Crear objeto con todos los detalles
    const abilityDetails = {
      name: fullAbilityData.name,
      spanishName: spanishName,
      description: description.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
      effect: finalEffect.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
      is_hidden: abilityData?.is_hidden || false,
      generation: fullAbilityData.generation?.name || null
    };
    
    // Actualizar caché con información completa
    abilitiesCache.value[abilityName] = abilityDetails;
    selectedAbility.value = abilityDetails;
    
    console.log(`💾 Habilidad ${abilityName} guardada en caché`);
    
  } catch (error) {
    console.error('Error cargando detalles de la habilidad:', error);
    selectedAbility.value = {
      name: abilityName,
      spanishName: getAbilityNameInSpanish(abilityName),
      description: 'Error al cargar la descripción de la habilidad.',
      effect: '',
      is_hidden: false,
      generation: null
    };
  } finally {
    loadingAbilityDetails.value = false;
  }
}

// Función para cerrar el modal de habilidades
function closeAbilityModal() {
  showAbilityModal.value = false;
  selectedAbility.value = null;
}

// Función para mostrar/ocultar movimientos
async function toggleAllMoves() {
  showAllMoves.value = !showAllMoves.value;
  
  if (showAllMoves.value) {
    await loadMovesDetails();
  }
}

// Función para obtener estadísticas del caché
function getCacheStats() {
  return {
    pokemon: Object.keys(pokemonCache.value).length,
    moves: Object.keys(movesCache.value).length,
    abilities: Object.keys(abilitiesCache.value).length,
    total: Object.keys(pokemonCache.value).length + Object.keys(movesCache.value).length + Object.keys(abilitiesCache.value).length
  };
}

// Función para limpiar todo el caché
function clearAllCache() {
  pokemonCache.value = {};
  movesCache.value = {};
  abilitiesCache.value = {};
  
  if (process.client) {
    clearOldCache();
  }
  
  console.log('🧹 Todo el caché ha sido limpiado');
}

// Función para precargar Pokémon populares
async function preloadPopularPokemon() {
  const popularIds = [1, 25, 6, 9, 3, 150, 151, 249, 250, 383, 384, 483, 484, 487, 644, 645, 646, 716, 717, 718];
  console.log(`🚀 Precargando ${popularIds.length} Pokémon populares...`);
  
  loading.value = true;
  let loaded = 0;
  
  for (const id of popularIds) {
    if (!pokemonCache.value[id.toString()]) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (response.ok) {
          const data = await response.json();
          pokemonCache.value[id.toString()] = data;
          loaded++;
        }
      } catch (error) {
        console.warn(`Error precargando Pokémon #${id}:`, error);
      }
    }
  }
  
  loading.value = false;
  console.log(`✅ Precargados ${loaded} Pokémon nuevos`);
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

// Traducciones de tipos al español
function getTypeInSpanish(type) {
  const typeTranslations = {
    normal: "Normal",
    fire: "Fuego",
    water: "Agua", 
    electric: "Eléctrico",
    grass: "Planta",
    ice: "Hielo",
    fighting: "Lucha",
    poison: "Veneno",
    ground: "Tierra",
    flying: "Volador",
    psychic: "Psíquico",
    bug: "Bicho",
    rock: "Roca",
    ghost: "Fantasma",
    dragon: "Dragón",
    dark: "Siniestro",
    steel: "Acero",
    fairy: "Hada"
  };
  return typeTranslations[type] || type;
}

// Función para obtener nombres de movimientos en español
function getMoveNameInSpanish(moveName) {
  // Si ya tenemos el nombre en español en el caché, usarlo
  if (movesCache.value[moveName]?.spanishName) {
    return movesCache.value[moveName].spanishName;
  }
  
  // Mientras tanto, mostrar una versión formateada del nombre en inglés
  return moveName.replace(/-/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Función para obtener nombres de habilidades en español
function getAbilityNameInSpanish(abilityName) {
  const abilityTranslations = {
    // Habilidades comunes
    'overgrow': 'Espesura',
    'blaze': 'Mar Llamas',
    'torrent': 'Torrente',
    'swarm': 'Enjambre',
    'keen-eye': 'Vista Lince',
    'tangled-feet': 'Tumbos',
    'big-pecks': 'Sacpecho',
    'guts': 'Agallas',
    'hustle': 'Entusiasmo',
    'intimidate': 'Intimidación',
    'shed-skin': 'Mudar',
    'marvel-scale': 'Escama Especial',
    'limber': 'Flexibilidad',
    'imposter': 'Impostor',
    'static': 'Electricidad Estática',
    'lightning-rod': 'Pararrayos',
    'sand-veil': 'Velo Arena',
    'poison-point': 'Punto Tóxico',
    'rivalry': 'Rivalidad',
    'sheer-force': 'Potencia Bruta',
    'cute-charm': 'Gran Encanto',
    'magic-guard': 'Muro Mágico',
    'friend-guard': 'Compiescolta',
    'healer': 'Alma Cura',
    'regenerator': 'Regeneración',
    'natural-cure': 'Cura Natural',
    'serene-grace': 'Dicha',
    'super-luck': 'Afortunado',
    'early-bird': 'Madrugar',
    'flame-body': 'Cuerpo Llama',
    'run-away': 'Fuga',
    'flash-fire': 'Absorbe Fuego',
    'water-absorb': 'Absorbe Agua',
    'damp': 'Humedad',
    'cloud-nine': 'Aclimatación',
    'compound-eyes': 'Ojo Compuesto',
    'shield-dust': 'Polvo Escudo',
    'tinted-lens': 'Cromolente',
    'sturdy': 'Robustez',
    'rock-head': 'Cabeza Roca',
    'magnet-pull': 'Imán',
    'sand-force': 'Poder Arena',
    'pressure': 'Presión',
    'thick-fat': 'Sebo',
    'inner-focus': 'Foco Interno',
    'oblivious': 'Despiste',
    'own-tempo': 'Ritmo Propio',
    'suction-cups': 'Ventosas',
    'clear-body': 'Cuerpo Puro',
    'liquid-ooze': 'Viscosidad',
    'effect-spore': 'Efecto Espora',
    'dry-skin': 'Piel Seca',
    'download': 'Descarga',
    'trace': 'Calco',
    'synchronize': 'Sincronía',
    'chlorophyll': 'Clorofila',
    'solar-power': 'Poder Solar',
    'leaf-guard': 'Defensa Hoja',
    'technician': 'Experto',
    'skill-link': 'Encadenado',
    'poison-heal': 'Antídoto',
    'adaptability': 'Adaptable',
    'pickup': 'Recogida',
    'gluttony': 'Gula',
    'unburden': 'Liviano',
    'heatproof': 'Ignífugo',
    'simple': 'Simple',
    'unaware': 'Ignorante',
    'arena-trap': 'Trampa Arena',
    'vital-spirit': 'Espíritu Vital',
    'white-smoke': 'Humo Blanco',
    'pure-power': 'Potencia Pura',
    'shell-armor': 'Caparazón',
    'air-lock': 'Esfera Aérea'
  };
  
  return abilityTranslations[abilityName] || abilityName.replace(/-/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Función para obtener nombres de estadísticas en español
function getStatNameInSpanish(statName) {
  const statTranslations = {
    'hp': 'PS',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'At. Especial',
    'special-defense': 'Def. Especial',
    'speed': 'Velocidad'
  };
  
  return statTranslations[statName] || statName.replace(/-/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Función para obtener nombres de generaciones en español
function getGenerationInSpanish(generationName) {
  const generationTranslations = {
    'generation-i': 'Primera Generación (Kanto)',
    'generation-ii': 'Segunda Generación (Johto)',
    'generation-iii': 'Tercera Generación (Hoenn)',
    'generation-iv': 'Cuarta Generación (Sinnoh)',
    'generation-v': 'Quinta Generación (Teselia)',
    'generation-vi': 'Sexta Generación (Kalos)',
    'generation-vii': 'Séptima Generación (Alola)',
    'generation-viii': 'Octava Generación (Galar)',
    'generation-ix': 'Novena Generación (Paldea)'
  };
  
  return generationTranslations[generationName] || generationName.replace(/-/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
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
