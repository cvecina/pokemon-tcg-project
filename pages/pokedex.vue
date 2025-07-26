<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900"
  >
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
          <!-- Búsqueda por nombre con sugerencias predictivas -->
          <div class="flex gap-2">
            <div class="relative" ref="searchContainer">
              <input
                ref="searchInput"
                v-model="searchTerm"
                @keyup.enter="searchPokemon"
                @keydown="handleSuggestionKeydown"
                @input="validateSearchInput"
                @blur="closeSuggestions"
                @focus="generateSearchSuggestions(searchTerm)"
                placeholder="Buscar Pokémon (ej: pikachu, charizard, 25)"
                class="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-80"
                autocomplete="off"
              />
              
              <!-- Dropdown de sugerencias -->
              <Teleport to="body">
                <div 
                  v-if="showSuggestions && (searchSuggestions.length > 0 || isLoadingSuggestions)"
                  class="fixed bg-gray-800/98 backdrop-blur-md border border-gray-600/50 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
                  :style="{
                    top: dropdownPosition.top + 'px',
                    left: dropdownPosition.left + 'px',
                    width: dropdownPosition.width + 'px',
                    zIndex: 999999
                  }"
                >
                <div class="p-2">
                  <!-- Indicador de carga -->
                  <div v-if="isLoadingSuggestions" class="flex items-center justify-center p-3">
                    <div class="loading loading-spinner loading-sm text-orange-400 mr-2"></div>
                    <span class="text-sm text-gray-400">Buscando sugerencias...</span>
                  </div>
                  
                  <!-- Sugerencias -->
                  <div v-else-if="searchSuggestions.length > 0">
                    <div class="text-xs text-gray-400 mb-2 px-2 flex items-center justify-between">
                      <span>🔍 Sugerencias ({{ searchSuggestions.length }})</span>
                      <span class="text-xs text-gray-500">⭐ Popular • 🕒 Reciente • # Número</span>
                    </div>
                    <div
                      v-for="(suggestion, index) in searchSuggestions"
                      :key="`${suggestion.id}-${suggestion.type}`"
                      @click="selectSuggestion(suggestion)"
                      :class="{
                        'bg-orange-600/80 border-orange-400/50': index === selectedSuggestionIndex,
                        'bg-gray-700/50 hover:bg-gray-600/50 border-transparent': index !== selectedSuggestionIndex
                      }"
                      class="flex items-center gap-3 p-2 rounded cursor-pointer transition-colors border"
                    >
                      <!-- Icono según el tipo -->
                      <div class="flex-shrink-0">
                        <span 
                          v-if="suggestion.type === 'local'"
                          class="text-green-400 text-sm"
                          title="Pokémon popular"
                        >⭐</span>
                        <span 
                          v-else-if="suggestion.type === 'cached'"
                          class="text-blue-400 text-sm"
                          title="Pokémon visitado recientemente"
                        >🕒</span>
                        <span 
                          v-else
                          class="text-yellow-400 text-sm"
                          title="Búsqueda por número"
                        >#</span>
                      </div>
                      
                      <!-- Información del Pokémon -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span 
                            :class="{
                              'text-orange-100 font-bold': index === selectedSuggestionIndex,
                              'text-white font-medium': index !== selectedSuggestionIndex
                            }"
                            class="transition-colors"
                          >{{ suggestion.displayName }}</span>
                          <span 
                            :class="{
                              'text-orange-200': index === selectedSuggestionIndex,
                              'text-gray-400': index !== selectedSuggestionIndex
                            }"
                            class="text-xs transition-colors"
                          >#{{ suggestion.id }}</span>
                          
                          <!-- Badge de prioridad para debugging (solo en desarrollo) -->
                          <span 
                            v-if="false && suggestion.priority"
                            class="text-xs bg-red-500/20 text-red-300 px-1 rounded"
                          >P{{ suggestion.priority }}</span>
                        </div>
                        <div 
                          v-if="suggestion.name !== suggestion.spanishName && suggestion.type !== 'numeric'"
                          :class="{
                            'text-orange-300': index === selectedSuggestionIndex,
                            'text-gray-500': index !== selectedSuggestionIndex
                          }"
                          class="text-xs truncate transition-colors"
                        >
                          {{ suggestion.name }}
                        </div>
                      </div>
                      
                      <!-- Indicador de navegación con teclado -->
                      <div 
                        v-if="index === selectedSuggestionIndex"
                        class="text-orange-300 text-xs font-bold"
                      >
                        ↵
                      </div>
                    </div>
                  </div>
                  
                  <!-- Mensaje cuando no hay sugerencias -->
                  <div v-else class="text-center p-3">
                    <span class="text-sm text-gray-500">🔍 No se encontraron sugerencias</span>
                  </div>
                </div>
                
                <!-- Footer con ayuda -->
                <div class="border-t border-gray-600/50 p-2 bg-gray-900/50">
                  <div class="text-xs text-gray-500 text-center">
                    ↑↓ para navegar • ↵ para seleccionar • Esc para cerrar
                  </div>
                </div>
              </div>
              </Teleport>
            </div>
            
            <button
              @click="searchPokemon"
              :disabled="!searchTerm.trim() || loading"
              class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">⏳</span>
              <span v-else>🔍</span>
              Buscar
            </button>
          </div>

          <!-- Generación aleatoria -->
          <button
            @click="getRandomPokemon"
            :disabled="loading"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">⏳</span>
            <span v-else>🎲</span>
            Pokémon Aleatorio
          </button>

          <!-- Navegación -->
          <div class="flex gap-2 items-center">
            <button
              @click="previousPokemon"
              :disabled="currentId <= 1 || loading"
              class="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">⏳</span>
              <span v-else>⬅️</span>
              Anterior
            </button>
            <span class="text-lg font-bold text-yellow-300"
              >#{{ currentId }}</span
            >
            <button
              @click="nextPokemon"
              :disabled="currentId >= 1025 || loading"
              class="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">⏳</span>
              <span v-else>➡️</span>
              Siguiente
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
                :alt="getPokemonNameInSpanish(pokemon)"
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
              {{ getPokemonNameInSpanish(pokemon) }}
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
                  <div v-if="featuredMovesDetails[move.move.name]" class="flex gap-1 flex-wrap">
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
                    <span 
                      v-if="featuredMovesDetails[move.move.name].level_learned_at"
                      class="bg-green-500 text-white px-1 py-0.5 rounded text-xs font-bold"
                    >
                      Nv.{{ featuredMovesDetails[move.move.name].level_learned_at }}
                    </span>
                    <span 
                      v-else-if="featuredMovesDetails[move.move.name].learn_method !== 'level-up'"
                      class="bg-purple-500 text-white px-1 py-0.5 rounded text-xs font-bold"
                    >
                      {{ getLearnMethodInSpanish(featuredMovesDetails[move.move.name].learn_method) }}
                    </span>
                  </div>
                  
                  <!-- Mostrar solo el nombre si no hay datos disponibles -->
                  <div v-else class="text-xs text-white/60">
                    <span class="text-xs opacity-75">🔄 Datos básicos</span>
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
              </button>
            </div>
          </div>
        </div>

        <!-- Lista completa de movimientos (expandible) - Fuera del grid para ocupar todo el ancho -->
        <div v-if="showAllMoves" class="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h4 class="text-xl font-semibold text-white mb-4 text-center">
            🥊 Todos los Movimientos
            <div class="text-sm text-yellow-300 font-normal mt-1">(Haz clic en cualquier movimiento para ver su descripción)</div>
          </h4>
          
          <!-- Controles de filtrado y ordenamiento -->
          <div class="mb-4 bg-white/10 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Filtrar por tipo de daño -->
              <div>
                <label class="block text-sm font-medium text-white/80 mb-2">Filtrar por Categoría:</label>
                <select 
                  v-model="movesFilterBy"
                  class="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="all" class="bg-gray-800">Todos</option>
                  <option value="physical" class="bg-gray-800">Físico</option>
                  <option value="special" class="bg-gray-800">Especial</option>
                  <option value="status" class="bg-gray-800">Estado</option>
                </select>
              </div>
              
              <!-- Ordenar por -->
              <div>
                <label class="block text-sm font-medium text-white/80 mb-2">Ordenar por:</label>
                <select 
                  v-model="movesSortBy"
                  class="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="level" class="bg-gray-800">Nivel de Aprendizaje</option>
                  <option value="name" class="bg-gray-800">Nombre</option>
                  <option value="type" class="bg-gray-800">Tipo</option>
                  <option value="damage_class" class="bg-gray-800">Categoría de Daño</option>
                  <option value="power" class="bg-gray-800">Poder</option>
                </select>
              </div>
              
              <!-- Orden ascendente/descendente -->
              <div>
                <label class="block text-sm font-medium text-white/80 mb-2">Orden:</label>
                <button
                  @click="movesOrderAsc = !movesOrderAsc"
                  class="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{{ movesOrderAsc ? '⬆️ Ascendente' : '⬇️ Descendente' }}</span>
                </button>
              </div>
            </div>
            
            <!-- Estadísticas de filtrado -->
            <div class="mt-3 flex flex-wrap gap-2 justify-center">
              <span class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                📊 {{ filteredAndSortedMoves.length }} de {{ pokemon?.moves.length || 0 }} movimientos
              </span>
              <span class="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                🇪🇸 Solo en español
              </span>
              <span v-if="movesFilterBy !== 'all'" class="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs">
                🎯 Filtrado por {{ movesFilterBy === 'physical' ? 'Físico' : movesFilterBy === 'special' ? 'Especial' : 'Estado' }}
              </span>
              <span class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                📈 Ordenado por {{ movesSortBy === 'level' ? 'Nivel' : movesSortBy === 'name' ? 'Nombre' : movesSortBy === 'type' ? 'Tipo' : movesSortBy === 'damage_class' ? 'Categoría' : 'Poder' }}
              </span>
            </div>
          </div>
          
          <!-- Indicador de carga -->
          <div v-if="loadingMoves" class="text-center py-8">
            <div class="loading loading-spinner loading-md text-white mb-2"></div>
            <p class="text-white/70">Cargando tipos de movimientos...</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            <div 
              v-for="(move, index) in filteredAndSortedMoves" 
              :key="move.move.name"
              @click="showMoveDetails(move.move.name)"
              class="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-white/30 transition-colors"
            >
              <div class="flex justify-between items-start mb-1">
                <span class="capitalize font-semibold">{{ getMoveNameInSpanish(move.move.name) }}</span>
                <span class="text-xs text-white/60">#{{ index + 1 }}</span>
              </div>
              
              <!-- Detalles del movimiento -->
              <div v-if="move.details" class="flex flex-wrap gap-1 mt-2">
                <span 
                  :class="getTypeColor(move.details.type)"
                  class="px-2 py-1 rounded text-xs font-bold"
                >
                  {{ getTypeInSpanish(move.details.type) }}
                </span>
                
                <!-- Categoría de daño -->
                <span 
                  :class="{
                    'bg-red-600': move.details.damage_class === 'physical',
                    'bg-blue-600': move.details.damage_class === 'special',
                    'bg-gray-600': move.details.damage_class === 'status'
                  }"
                  class="text-white px-2 py-1 rounded text-xs font-bold"
                >
                  {{ move.details.damage_class === 'physical' ? 'Fís' : move.details.damage_class === 'special' ? 'Esp' : 'Est' }}
                </span>
                
                <!-- Poder -->
                <span 
                  v-if="move.details.power !== '-'"
                  class="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  ⚡{{ move.details.power }}
                </span>
                
                <!-- Nivel de aprendizaje -->
                <span 
                  v-if="move.level_learned_at"
                  class="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  Nv.{{ move.level_learned_at }}
                </span>
                
                <!-- Método de aprendizaje (si no es por nivel) -->
                <span 
                  v-else
                  class="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  {{ getLearnMethodInSpanish(move.learn_method) }}
                </span>
              </div>
              
              <!-- Fallback si no hay detalles -->
              <div v-else class="mt-2">
                <span class="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                  Tipo desconocido
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-4 text-center">
            <p class="text-white/70 text-sm">
              Mostrando {{ filteredAndSortedMoves.length }} de {{ pokemon?.moves.length || 0 }} movimientos de {{ getPokemonNameInSpanish(pokemon) }}
            </p>
            <div class="mt-2 flex justify-center gap-2 flex-wrap">
              <span class="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                ⚡ Carga paralela ultrarrápida
              </span>
              <span class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                🧠 Sistema de caché inteligente
              </span>
              <span class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                🎯 Filtrado y ordenamiento avanzado
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
              :alt="getPokemonNameInSpanish(recent)"
              class="w-16 h-16 mx-auto mb-2"
            />
            <div class="text-sm font-medium capitalize text-white">
              {{ getPokemonNameInSpanish(recent) }}
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

            <!-- Método de aprendizaje -->
            <div v-if="selectedMove.level_learned_at || selectedMove.learn_method" class="bg-green-500/20 rounded-lg p-3">
              <div class="text-sm text-green-300 font-semibold mb-1">Método de Aprendizaje:</div>
              <div class="text-white">
                <span v-if="selectedMove.level_learned_at" class="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold mr-2">
                  📈 Nivel {{ selectedMove.level_learned_at }}
                </span>
                <span v-else-if="selectedMove.learn_method" class="bg-purple-600 text-white px-2 py-1 rounded text-sm font-bold">
                  🎓 {{ getLearnMethodInSpanish(selectedMove.learn_method) }}
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

// Filtros y ordenamiento de movimientos
const movesSortBy = ref('level'); // level, name, type, damage_class, power
const movesFilterBy = ref('all'); // all, physical, special, status
const movesOrderAsc = ref(true);

// Modal de descripción de movimientos
const selectedMove = ref(null);
const showMoveModal = ref(false);
const loadingMoveDetails = ref(false);

// Modal de descripción de habilidades
const selectedAbility = ref(null);
const showAbilityModal = ref(false);
const loadingAbilityDetails = ref(false);

// Búsqueda predictiva
const searchSuggestions = ref([]);
const showSuggestions = ref(false);
const selectedSuggestionIndex = ref(-1);
const isLoadingSuggestions = ref(false);
const searchDebounceTimer = ref(null);
const dropdownPosition = ref({ top: 0, left: 0, width: 0 });

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

// Lista de Pokémon para búsqueda predictiva (principales 151 + populares de otras generaciones)
const pokemonList = [
  // Generación 1 - Kanto (los más conocidos)
  { id: 1, name: 'bulbasaur', spanishName: 'Bulbasaur' },
  { id: 2, name: 'ivysaur', spanishName: 'Ivysaur' },
  { id: 3, name: 'venusaur', spanishName: 'Venusaur' },
  { id: 4, name: 'charmander', spanishName: 'Charmander' },
  { id: 5, name: 'charmeleon', spanishName: 'Charmeleon' },
  { id: 6, name: 'charizard', spanishName: 'Charizard' },
  { id: 7, name: 'squirtle', spanishName: 'Squirtle' },
  { id: 8, name: 'wartortle', spanishName: 'Wartortle' },
  { id: 9, name: 'blastoise', spanishName: 'Blastoise' },
  { id: 10, name: 'caterpie', spanishName: 'Caterpie' },
  { id: 11, name: 'metapod', spanishName: 'Metapod' },
  { id: 12, name: 'butterfree', spanishName: 'Butterfree' },
  { id: 16, name: 'pidgey', spanishName: 'Pidgey' },
  { id: 19, name: 'rattata', spanishName: 'Rattata' },
  { id: 25, name: 'pikachu', spanishName: 'Pikachu' },
  { id: 26, name: 'raichu', spanishName: 'Raichu' },
  { id: 27, name: 'sandshrew', spanishName: 'Sandshrew' },
  { id: 29, name: 'nidoran-f', spanishName: 'Nidoran♀' },
  { id: 32, name: 'nidoran-m', spanishName: 'Nidoran♂' },
  { id: 35, name: 'clefairy', spanishName: 'Clefairy' },
  { id: 36, name: 'clefable', spanishName: 'Clefable' },
  { id: 37, name: 'vulpix', spanishName: 'Vulpix' },
  { id: 38, name: 'ninetales', spanishName: 'Ninetales' },
  { id: 39, name: 'jigglypuff', spanishName: 'Jigglypuff' },
  { id: 40, name: 'wigglytuff', spanishName: 'Wigglytuff' },
  { id: 41, name: 'zubat', spanishName: 'Zubat' },
  { id: 42, name: 'golbat', spanishName: 'Golbat' },
  { id: 43, name: 'oddish', spanishName: 'Oddish' },
  { id: 50, name: 'diglett', spanishName: 'Diglett' },
  { id: 52, name: 'meowth', spanishName: 'Meowth' },
  { id: 53, name: 'persian', spanishName: 'Persian' },
  { id: 54, name: 'psyduck', spanishName: 'Psyduck' },
  { id: 55, name: 'golduck', spanishName: 'Golduck' },
  { id: 56, name: 'mankey', spanishName: 'Mankey' },
  { id: 58, name: 'growlithe', spanishName: 'Growlithe' },
  { id: 59, name: 'arcanine', spanishName: 'Arcanine' },
  { id: 60, name: 'poliwag', spanishName: 'Poliwag' },
  { id: 63, name: 'abra', spanishName: 'Abra' },
  { id: 64, name: 'kadabra', spanishName: 'Kadabra' },
  { id: 65, name: 'alakazam', spanishName: 'Alakazam' },
  { id: 66, name: 'machop', spanishName: 'Machop' },
  { id: 67, name: 'machoke', spanishName: 'Machoke' },
  { id: 68, name: 'machamp', spanishName: 'Machamp' },
  { id: 72, name: 'tentacool', spanishName: 'Tentacool' },
  { id: 74, name: 'geodude', spanishName: 'Geodude' },
  { id: 77, name: 'ponyta', spanishName: 'Ponyta' },
  { id: 79, name: 'slowpoke', spanishName: 'Slowpoke' },
  { id: 81, name: 'magnemite', spanishName: 'Magnemite' },
  { id: 83, name: 'farfetchd', spanishName: 'Farfetch\'d' },
  { id: 84, name: 'doduo', spanishName: 'Doduo' },
  { id: 86, name: 'seel', spanishName: 'Seel' },
  { id: 90, name: 'shellder', spanishName: 'Shellder' },
  { id: 92, name: 'gastly', spanishName: 'Gastly' },
  { id: 93, name: 'haunter', spanishName: 'Haunter' },
  { id: 94, name: 'gengar', spanishName: 'Gengar' },
  { id: 95, name: 'onix', spanishName: 'Onix' },
  { id: 96, name: 'drowzee', spanishName: 'Drowzee' },
  { id: 98, name: 'krabby', spanishName: 'Krabby' },
  { id: 100, name: 'voltorb', spanishName: 'Voltorb' },
  { id: 102, name: 'exeggcute', spanishName: 'Exeggcute' },
  { id: 104, name: 'cubone', spanishName: 'Cubone' },
  { id: 105, name: 'marowak', spanishName: 'Marowak' },
  { id: 106, name: 'hitmonlee', spanishName: 'Hitmonlee' },
  { id: 107, name: 'hitmonchan', spanishName: 'Hitmonchan' },
  { id: 108, name: 'lickitung', spanishName: 'Lickitung' },
  { id: 109, name: 'koffing', spanishName: 'Koffing' },
  { id: 111, name: 'rhyhorn', spanishName: 'Rhyhorn' },
  { id: 113, name: 'chansey', spanishName: 'Chansey' },
  { id: 115, name: 'kangaskhan', spanishName: 'Kangaskhan' },
  { id: 116, name: 'horsea', spanishName: 'Horsea' },
  { id: 118, name: 'goldeen', spanishName: 'Goldeen' },
  { id: 120, name: 'staryu', spanishName: 'Staryu' },
  { id: 121, name: 'starmie', spanishName: 'Starmie' },
  { id: 122, name: 'mr-mime', spanishName: 'Mr. Mime' },
  { id: 123, name: 'scyther', spanishName: 'Scyther' },
  { id: 124, name: 'jynx', spanishName: 'Jynx' },
  { id: 125, name: 'electabuzz', spanishName: 'Electabuzz' },
  { id: 126, name: 'magmar', spanishName: 'Magmar' },
  { id: 127, name: 'pinsir', spanishName: 'Pinsir' },
  { id: 128, name: 'tauros', spanishName: 'Tauros' },
  { id: 129, name: 'magikarp', spanishName: 'Magikarp' },
  { id: 130, name: 'gyarados', spanishName: 'Gyarados' },
  { id: 131, name: 'lapras', spanishName: 'Lapras' },
  { id: 132, name: 'ditto', spanishName: 'Ditto' },
  { id: 133, name: 'eevee', spanishName: 'Eevee' },
  { id: 134, name: 'vaporeon', spanishName: 'Vaporeon' },
  { id: 135, name: 'jolteon', spanishName: 'Jolteon' },
  { id: 136, name: 'flareon', spanishName: 'Flareon' },
  { id: 137, name: 'porygon', spanishName: 'Porygon' },
  { id: 138, name: 'omanyte', spanishName: 'Omanyte' },
  { id: 140, name: 'kabuto', spanishName: 'Kabuto' },
  { id: 142, name: 'aerodactyl', spanishName: 'Aerodactyl' },
  { id: 143, name: 'snorlax', spanishName: 'Snorlax' },
  { id: 144, name: 'articuno', spanishName: 'Articuno' },
  { id: 145, name: 'zapdos', spanishName: 'Zapdos' },
  { id: 146, name: 'moltres', spanishName: 'Moltres' },
  { id: 147, name: 'dratini', spanishName: 'Dratini' },
  { id: 148, name: 'dragonair', spanishName: 'Dragonair' },
  { id: 149, name: 'dragonite', spanishName: 'Dragonite' },
  { id: 150, name: 'mewtwo', spanishName: 'Mewtwo' },
  { id: 151, name: 'mew', spanishName: 'Mew' },
  
  // Generación 2 - Johto (más populares)
  { id: 152, name: 'chikorita', spanishName: 'Chikorita' },
  { id: 155, name: 'cyndaquil', spanishName: 'Cyndaquil' },
  { id: 158, name: 'totodile', spanishName: 'Totodile' },
  { id: 169, name: 'crobat', spanishName: 'Crobat' },
  { id: 172, name: 'pichu', spanishName: 'Pichu' },
  { id: 179, name: 'mareep', spanishName: 'Mareep' },
  { id: 183, name: 'marill', spanishName: 'Marill' },
  { id: 190, name: 'aipom', spanishName: 'Aipom' },
  { id: 194, name: 'wooper', spanishName: 'Wooper' },
  { id: 196, name: 'espeon', spanishName: 'Espeon' },
  { id: 197, name: 'umbreon', spanishName: 'Umbreon' },
  { id: 208, name: 'steelix', spanishName: 'Steelix' },
  { id: 215, name: 'sneasel', spanishName: 'Sneasel' },
  { id: 220, name: 'swinub', spanishName: 'Swinub' },
  { id: 236, name: 'tyrogue', spanishName: 'Tyrogue' },
  { id: 243, name: 'raikou', spanishName: 'Raikou' },
  { id: 244, name: 'entei', spanishName: 'Entei' },
  { id: 245, name: 'suicune', spanishName: 'Suicune' },
  { id: 246, name: 'larvitar', spanishName: 'Larvitar' },
  { id: 248, name: 'tyranitar', spanishName: 'Tyranitar' },
  { id: 249, name: 'lugia', spanishName: 'Lugia' },
  { id: 250, name: 'ho-oh', spanishName: 'Ho-Oh' },
  { id: 251, name: 'celebi', spanishName: 'Celebi' },
  
  // Generación 3 - Hoenn (más populares)
  { id: 252, name: 'treecko', spanishName: 'Treecko' },
  { id: 255, name: 'torchic', spanishName: 'Torchic' },
  { id: 258, name: 'mudkip', spanishName: 'Mudkip' },
  { id: 280, name: 'ralts', spanishName: 'Ralts' },
  { id: 282, name: 'gardevoir', spanishName: 'Gardevoir' },
  { id: 302, name: 'sableye', spanishName: 'Sableye' },
  { id: 303, name: 'mawile', spanishName: 'Mawile' },
  { id: 304, name: 'aron', spanishName: 'Aron' },
  { id: 306, name: 'aggron', spanishName: 'Aggron' },
  { id: 333, name: 'swablu', spanishName: 'Swablu' },
  { id: 334, name: 'altaria', spanishName: 'Altaria' },
  { id: 355, name: 'duskull', spanishName: 'Duskull' },
  { id: 371, name: 'bagon', spanishName: 'Bagon' },
  { id: 373, name: 'salamence', spanishName: 'Salamence' },
  { id: 374, name: 'beldum', spanishName: 'Beldum' },
  { id: 376, name: 'metagross', spanishName: 'Metagross' },
  { id: 380, name: 'latias', spanishName: 'Latias' },
  { id: 381, name: 'latios', spanishName: 'Latios' },
  { id: 382, name: 'kyogre', spanishName: 'Kyogre' },
  { id: 383, name: 'groudon', spanishName: 'Groudon' },
  { id: 384, name: 'rayquaza', spanishName: 'Rayquaza' },
  
  // Generación 4 - Sinnoh (más populares)
  { id: 387, name: 'turtwig', spanishName: 'Turtwig' },
  { id: 390, name: 'chimchar', spanishName: 'Chimchar' },
  { id: 393, name: 'piplup', spanishName: 'Piplup' },
  { id: 447, name: 'riolu', spanishName: 'Riolu' },
  { id: 448, name: 'lucario', spanishName: 'Lucario' },
  { id: 470, name: 'leafeon', spanishName: 'Leafeon' },
  { id: 471, name: 'glaceon', spanishName: 'Glaceon' },
  { id: 483, name: 'dialga', spanishName: 'Dialga' },
  { id: 484, name: 'palkia', spanishName: 'Palkia' },
  { id: 487, name: 'giratina', spanishName: 'Giratina' },
  { id: 493, name: 'arceus', spanishName: 'Arceus' },
  
  // Generación 5 - Unova (más populares)
  { id: 501, name: 'oshawott', spanishName: 'Oshawott' },
  { id: 570, name: 'zorua', spanishName: 'Zorua' },
  { id: 571, name: 'zoroark', spanishName: 'Zoroark' },
  
  // Generación 6 - Kalos (más populares)
  { id: 650, name: 'chespin', spanishName: 'Chespin' },
  { id: 653, name: 'fennekin', spanishName: 'Fennekin' },
  { id: 656, name: 'froakie', spanishName: 'Froakie' },
  { id: 658, name: 'greninja', spanishName: 'Greninja' },
  { id: 700, name: 'sylveon', spanishName: 'Sylveon' },
  
  // Generación 7 - Alola (más populares)
  { id: 722, name: 'rowlet', spanishName: 'Rowlet' },
  { id: 725, name: 'litten', spanishName: 'Litten' },
  { id: 728, name: 'popplio', spanishName: 'Popplio' },
  
  // Generación 8 - Galar (más populares)
  { id: 810, name: 'grookey', spanishName: 'Grookey' },
  { id: 813, name: 'scorbunny', spanishName: 'Scorbunny' },
  { id: 816, name: 'sobble', spanishName: 'Sobble' },
  
  // Generación 9 - Paldea (más populares)
  { id: 906, name: 'sprigatito', spanishName: 'Sprigatito' },
  { id: 909, name: 'fuecoco', spanishName: 'Fuecoco' },
  { id: 912, name: 'quaxly', spanishName: 'Quaxly' }
];

// Cache para búsqueda predictiva
const suggestionCache = ref(getFromLocalStorage('suggestions-cache', {}));
const recentSearches = ref(getFromLocalStorage('recent-searches', []));

// Cargar Pokémon inicial
onMounted(() => {
  loadPokemon(1);
});

// Limpiar timers y listeners al desmontar el componente
onUnmounted(() => {
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value);
  }
  
  // Limpiar listeners de scroll
  if (process.client) {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
  }
});

// Función principal para cargar Pokémon
async function loadPokemon(id) {
  loading.value = true;
  error.value = "";
  
  // Guardar estado actual por si falla la carga
  const previousPokemon = pokemon.value;
  const previousFeaturedMovesDetails = featuredMovesDetails.value;
  const previousMovesDetails = movesDetails.value;
  const previousShowAllMoves = showAllMoves.value;

  try {
    // Verificar si ya tenemos este Pokémon en caché
    const cacheKey = id.toString();
    if (pokemonCache.value[cacheKey]) {
      console.log(`🎯 Pokémon #${id} cargado desde caché - instantáneo!`);
      pokemon.value = pokemonCache.value[cacheKey];
      currentId.value = pokemon.value.id;
      
      // Si no tiene nombre en español en caché, cargarlo
      if (!pokemon.value.spanishName) {
        await loadPokemonNameInSpanish(pokemon.value);
        // Actualizar caché con el nombre en español
        pokemonCache.value[cacheKey] = pokemon.value;
      }
      
      // Actualizar recientes
      await updateRecentPokemon(pokemon.value);
      
      // Cargar movimientos destacados desde caché también
      featuredMovesDetails.value = await loadFeaturedMovesDetails();
      console.log('📊 Featured moves details loaded from cache:', Object.keys(featuredMovesDetails.value).length);
      
      // Cargar automáticamente los nombres de las habilidades en español
      await loadAbilitiesDetails();
      
      // Limpiar detalles anteriores solo si la carga desde caché fue exitosa
      showAllMoves.value = false;
      movesDetails.value = {};
      
      loading.value = false;
      return;
    }

    console.log(`🌐 Cargando Pokémon #${id} desde API...`);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(`Pokémon #${id} no encontrado`);
    }

    const data = await response.json();
    
    // Cargar nombre en español
    await loadPokemonNameInSpanish(data);
    
    // Guardar en caché
    pokemonCache.value[cacheKey] = data;
    console.log(`💾 Pokémon #${id} guardado en caché`);
    
    pokemon.value = data;
    currentId.value = data.id;

    // Actualizar recientes
    await updateRecentPokemon(data);
    
    // Cargar automáticamente los tipos de los movimientos destacados
    featuredMovesDetails.value = await loadFeaturedMovesDetails();
    console.log('📊 Featured moves details loaded from API:', Object.keys(featuredMovesDetails.value).length);
    
    // Cargar automáticamente los nombres de las habilidades en español
    await loadAbilitiesDetails();
    
    // Solo cerrar movimientos y limpiar detalles si la carga fue exitosa
    showAllMoves.value = false;
    movesDetails.value = {};
    
  } catch (err) {
    error.value = err.message;
    console.error("Error cargando Pokémon:", err);
    
    // Restaurar estado anterior si falla la carga
    pokemon.value = previousPokemon;
    featuredMovesDetails.value = previousFeaturedMovesDetails;
    movesDetails.value = previousMovesDetails;
    showAllMoves.value = previousShowAllMoves;
    
    console.log('🔄 Estado anterior restaurado debido a error en la carga');
  } finally {
    loading.value = false;
    loadingMoves.value = false; // Asegurar que no quede en estado de carga
  }
}

// Función auxiliar para actualizar lista de Pokémon recientes
async function updateRecentPokemon(pokemonData) {
  // Cargar nombre en español si no lo tiene
  if (!pokemonData.spanishName) {
    await loadPokemonNameInSpanish(pokemonData);
  }
  
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




// Función para validar input en tiempo real
function validateSearchInput(event) {
  // Usar la nueva función que incluye búsqueda predictiva
  validateSearchInputWithSuggestions(event);
}

// Función para validar texto de búsqueda
function isValidSearchText(text) {
  // Permitir letras, números, espacios, guiones, puntos y apostrofes
  const validPattern = /^[a-zA-Z0-9\s\-'\.]+$/;
  return validPattern.test(text);
}

// Buscar por nombre (simple con búsqueda parcial)
async function searchPokemon() {
  if (!searchTerm.value.trim()) return;

  // Verificar si ya está cargando algo
  if (loading.value) {
    error.value = "Ya se está cargando un Pokémon, espera un momento...";
    
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      if (error.value === "Ya se está cargando un Pokémon, espera un momento...") {
        error.value = "";
      }
    }, 3000);
    
    return;
  }

  const term = searchTerm.value.toLowerCase().trim();
  
  // Validar que solo contenga caracteres válidos
  if (!isValidSearchText(term)) {
    error.value = "Solo se permiten letras, números, espacios y guiones en la búsqueda";
    return;
  }
  
  try {
    // Ocultar sugerencias al buscar
    showSuggestions.value = false;
    selectedSuggestionIndex.value = -1;
    
    await loadPokemon(term);
    // No limpiar el término de búsqueda para permitir búsquedas similares
  } catch (err) {
    error.value = `Pokémon "${term}" no encontrado`;
    // Ya no limpiamos el estado aquí porque loadPokemon() se encarga de mantener el estado anterior
  }
}

// Pokémon aleatorio
function getRandomPokemon() {
  // Verificar si ya está cargando algo
  if (loading.value) {
    error.value = "Ya se está cargando un Pokémon, espera un momento...";
    
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      if (error.value === "Ya se está cargando un Pokémon, espera un momento...") {
        error.value = "";
      }
    }, 3000);
    
    return;
  }
  
  const randomId = Math.floor(Math.random() * 1025) + 1;
  loadPokemon(randomId);
}

// Navegación
function nextPokemon() {
  // Verificar si ya está cargando algo
  if (loading.value) {
    error.value = "Ya se está cargando un Pokémon, espera un momento...";
    
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      if (error.value === "Ya se está cargando un Pokémon, espera un momento...") {
        error.value = "";
      }
    }, 3000);
    
    return;
  }
  
  if (currentId.value < 1025) {
    loadPokemon(currentId.value + 1);
  }
}

function previousPokemon() {
  // Verificar si ya está cargando algo
  if (loading.value) {
    error.value = "Ya se está cargando un Pokémon, espera un momento...";
    
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      if (error.value === "Ya se está cargando un Pokémon, espera un momento...") {
        error.value = "";
      }
    }, 3000);
    
    return;
  }
  
  if (currentId.value > 1) {
    loadPokemon(currentId.value - 1);
  }
}

// ======= FUNCIONES DE BÚSQUEDA PREDICTIVA =======

// Función para generar sugerencias de búsqueda mejorada
async function generateSearchSuggestions(searchTerm) {
  if (!searchTerm || searchTerm.length < 1) {
    searchSuggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  isLoadingSuggestions.value = true;
  const term = searchTerm.toLowerCase().trim();
  const suggestions = new Map(); // Usar Map para evitar duplicados por ID

  try {
    // 1. Buscar en la lista local primero (más rápido)
    const localMatches = pokemonList.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(term);
      const spanishNameMatch = pokemon.spanishName.toLowerCase().includes(term);
      const idMatch = pokemon.id.toString() === term;
      return nameMatch || spanishNameMatch || idMatch;
    });

    // Agregar coincidencias locales con prioridad alta
    localMatches.forEach(pokemon => {
      if (!suggestions.has(pokemon.id)) {
        suggestions.set(pokemon.id, {
          id: pokemon.id,
          name: pokemon.name,
          spanishName: pokemon.spanishName,
          displayName: pokemon.spanishName,
          type: 'local',
          priority: getSearchPriority(pokemon, term)
        });
      }
    });

    // 2. Buscar en caché de Pokémon visitados
    Object.values(pokemonCache.value).forEach(pokemon => {
      if (pokemon && pokemon.id && !suggestions.has(pokemon.id)) {
        const nameMatch = pokemon.name?.toLowerCase().includes(term);
        const spanishNameMatch = pokemon.spanishName?.toLowerCase().includes(term);
        const idMatch = pokemon.id.toString() === term;
        
        if (nameMatch || spanishNameMatch || idMatch) {
          suggestions.set(pokemon.id, {
            id: pokemon.id,
            name: pokemon.name,
            spanishName: pokemon.spanishName || pokemon.name,
            displayName: pokemon.spanishName || pokemon.name,
            type: 'cached',
            priority: getSearchPriority(pokemon, term)
          });
        }
      }
    });

    // 3. Si es un número válido, agregarlo como sugerencia directa
    const numericId = parseInt(term);
    if (!isNaN(numericId) && numericId > 0 && numericId <= 1025) {
      if (!suggestions.has(numericId)) {
        suggestions.set(numericId, {
          id: numericId,
          name: `pokemon-${numericId}`,
          spanishName: `Pokémon #${numericId}`,
          displayName: `Pokémon #${numericId}`,
          type: 'numeric',
          priority: 50 // Prioridad media para búsquedas numéricas
        });
      }
    }

    // Convertir Map a Array y ordenar por relevancia
    const sortedSuggestions = Array.from(suggestions.values())
      .sort((a, b) => {
        // Primero por prioridad (menor valor = mayor prioridad)
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        
        // Luego por tipo: local > cached > numeric
        const typeOrder = { local: 0, cached: 1, numeric: 2 };
        return typeOrder[a.type] - typeOrder[b.type];
      })
      .slice(0, 10); // Aumentar a 10 sugerencias para mejor experiencia

    searchSuggestions.value = sortedSuggestions;
    showSuggestions.value = sortedSuggestions.length > 0;
    selectedSuggestionIndex.value = -1;
    
    // Actualizar posición del dropdown cuando se muestran sugerencias
    if (sortedSuggestions.length > 0) {
      nextTick(() => {
        updateDropdownPosition();
      });
    }

    console.log(`🔍 Generadas ${sortedSuggestions.length} sugerencias para "${term}"`);

  } catch (error) {
    console.error('Error generando sugerencias:', error);
    searchSuggestions.value = [];
    showSuggestions.value = false;
  } finally {
    isLoadingSuggestions.value = false;
  }
}

// Función auxiliar para calcular prioridad de búsqueda
function getSearchPriority(pokemon, term) {
  const nameMatch = pokemon.name?.toLowerCase() || '';
  const spanishNameMatch = pokemon.spanishName?.toLowerCase() || '';
  const idMatch = pokemon.id?.toString() || '';
  
  // Coincidencia exacta = máxima prioridad
  if (nameMatch === term || spanishNameMatch === term || idMatch === term) {
    return 1;
  }
  
  // Comienza con el término = alta prioridad
  if (nameMatch.startsWith(term) || spanishNameMatch.startsWith(term)) {
    return 2;
  }
  
  // Contiene el término = prioridad media
  if (nameMatch.includes(term) || spanishNameMatch.includes(term)) {
    return 10;
  }
  
  // Por defecto = baja prioridad
  return 20;
}

// Función mejorada de validación que incluye búsqueda predictiva con debouncing
function validateSearchInputWithSuggestions(event) {
  const inputValue = event.target.value;
  
  // Filtrar caracteres no válidos (solo letras, números, espacios y guiones)
  const cleanValue = inputValue.replace(/[^a-zA-Z0-9\s\-'\.]/g, '');
  
  // Si el valor cambió, actualizar el input
  if (cleanValue !== inputValue) {
    searchTerm.value = cleanValue;
    error.value = "Se eliminaron caracteres especiales no permitidos";
    
    // Limpiar el mensaje de error después de 3 segundos
    setTimeout(() => {
      if (error.value === "Se eliminaron caracteres especiales no permitidos") {
        error.value = "";
      }
    }, 3000);
  } else {
    // Limpiar error si el texto es válido
    if (error.value === "Se eliminaron caracteres especiales no permitidos" || 
        error.value === "Solo se permiten letras, números y espacios en la búsqueda") {
      error.value = "";
    }
  }
  
  // Limpiar timer anterior si existe
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value);
  }
  
  // Generar sugerencias con debouncing (300ms de retraso)
  searchDebounceTimer.value = setTimeout(() => {
    generateSearchSuggestions(cleanValue);
  }, 150); // Reducido a 150ms para mejor experiencia de usuario
}

// Función para seleccionar una sugerencia
function selectSuggestion(suggestion) {
  searchTerm.value = suggestion.spanishName;
  showSuggestions.value = false;
  selectedSuggestionIndex.value = -1;
  
  // Guardar en búsquedas recientes
  addToRecentSearches(suggestion);
  
  loadPokemon(suggestion.id);
}

// Función para agregar a búsquedas recientes
function addToRecentSearches(suggestion) {
  // Remover si ya existe
  const existingIndex = recentSearches.value.findIndex(s => s.id === suggestion.id);
  if (existingIndex >= 0) {
    recentSearches.value.splice(existingIndex, 1);
  }
  
  // Agregar al principio
  recentSearches.value.unshift({
    id: suggestion.id,
    name: suggestion.name,
    spanishName: suggestion.spanishName,
    displayName: suggestion.displayName,
    timestamp: Date.now()
  });
  
  // Mantener solo los últimos 20
  if (recentSearches.value.length > 20) {
    recentSearches.value = recentSearches.value.slice(0, 20);
  }
  
  // Guardar en localStorage
  saveToLocalStorage('recent-searches', recentSearches.value);
}

// Función para calcular la posición del dropdown
function updateDropdownPosition() {
  if (process.client) {
    const searchInput = document.querySelector('input[placeholder*="Buscar Pokémon"]');
    if (searchInput) {
      const rect = searchInput.getBoundingClientRect();
      dropdownPosition.value = {
        top: rect.bottom + 4, // Sin window.scrollY para position fixed
        left: rect.left,      // Sin window.scrollX para position fixed
        width: rect.width
      };
    }
  }
}

// Agregar listener de scroll para actualizar posición
function handleScroll() {
  if (showSuggestions.value) {
    updateDropdownPosition();
  }
}

// Agregar/quitar listeners de scroll
watch(showSuggestions, (newValue) => {
  if (process.client) {
    if (newValue) {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    }
  }
});

// Función para manejar navegación con teclado en sugerencias
function handleSuggestionKeydown(event) {
  if (!showSuggestions.value || searchSuggestions.value.length === 0) return;
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedSuggestionIndex.value = Math.min(
        selectedSuggestionIndex.value + 1,
        searchSuggestions.value.length - 1
      );
      break;
      
    case 'ArrowUp':
      event.preventDefault();
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1);
      break;
      
    case 'Enter':
      event.preventDefault();
      if (selectedSuggestionIndex.value >= 0) {
        selectSuggestion(searchSuggestions.value[selectedSuggestionIndex.value]);
      } else {
        searchPokemon();
      }
      break;
      
    case 'Escape':
      showSuggestions.value = false;
      selectedSuggestionIndex.value = -1;
      break;
  }
}

// Función para cerrar sugerencias al hacer clic fuera
function closeSuggestions() {
  setTimeout(() => {
    showSuggestions.value = false;
    selectedSuggestionIndex.value = -1;
  }, 150); // Pequeño delay para permitir clics en sugerencias
}

// ======= FIN FUNCIONES DE BÚSQUEDA PREDICTIVA =======

// Cargar detalles de movimientos destacados (primeros 8)
async function loadFeaturedMovesDetails() {
  if (!pokemon.value) return {};
  
  console.log('🎯 Iniciando carga de movimientos destacados...');
  
  const featuredMoves = pokemon.value.moves.slice(0, 8);
  const details = {};
  
  // Verificar caché primero
  for (const move of featuredMoves) {
    if (movesCache.value[move.move.name]) {
      details[move.move.name] = movesCache.value[move.move.name];
    }
  }
  
  console.log(`📋 Movimientos destacados: ${Object.keys(details).length} en caché de ${featuredMoves.length} total`);
  
  // Si ya tenemos todos en caché, terminar
  if (Object.keys(details).length === featuredMoves.length) {
    console.log('✅ Todos los movimientos destacados estaban en caché');
    return details;
  }
  
  // Cargar los que faltan en paralelo
  const missingMoves = featuredMoves.filter(move => !movesCache.value[move.move.name]);
  console.log(`🌐 Cargando ${missingMoves.length} movimientos destacados nuevos...`);
  
  const movePromises = missingMoves.map(async (move) => {
    try {
      const response = await fetch(move.move.url);
      if (response.ok) {
        const moveData = await response.json();
        
        // Buscar nombre en español SOLAMENTE
        const spanishName = moveData.names.find(name => 
          name.language.name === 'es'
        )?.name;
        
        // Si no hay nombre en español, usar el nombre en inglés con indicación
        const finalMoveName = spanishName || `${move.move.name.replace('-', ' ')} (en inglés - no disponible en español)`;
        
        // Obtener información del nivel de aprendizaje
        const moveEntry = move.version_group_details.find(entry => 
          entry.move_learn_method.name === 'level-up'
        );
        const learnLevel = moveEntry ? moveEntry.level_learned_at : null;
        const learnMethod = move.version_group_details[0]?.move_learn_method.name || 'unknown';
        
        const moveInfo = {
          type: moveData.type?.name || 'normal',
          power: moveData.power || '-',
          accuracy: moveData.accuracy || '-',
          pp: moveData.pp || '-',
          spanishName: finalMoveName,
          damage_class: moveData.damage_class?.name || 'status',
          level_learned_at: learnLevel,
          learn_method: learnMethod,
          priority: moveData.priority || 0
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
        spanishName: `${move.move.name.replace('-', ' ')} (en inglés - error al cargar)`,
        damage_class: 'status',
        level_learned_at: null,
        learn_method: 'unknown',
        priority: 0
      };
      movesCache.value[move.move.name] = fallbackInfo;
      return { name: move.move.name, data: fallbackInfo };
    }
  });
  
  const results = await Promise.all(movePromises);
  results.forEach(result => {
    if (result && result.data) {
      details[result.name] = result.data;
    }
  });
  
  console.log(`✅ Movimientos destacados cargados: ${Object.keys(details).length} total`);
  return details;
}

// Cargar nombres de habilidades en español
async function loadAbilitiesDetails() {
  if (!pokemon.value) return;
  
  const abilities = pokemon.value.abilities;
  
  // Verificar si ya tenemos todas las habilidades en caché
  const missingAbilities = abilities.filter(ability => 
    !abilitiesCache.value[ability.ability.name]?.spanishName
  );
  
  if (missingAbilities.length === 0) {
    console.log(`🎯 Todas las habilidades ya están en caché`);
    return;
  }
  
  console.log(`🌐 Cargando ${missingAbilities.length} nombres de habilidades en español...`);
  
  // Cargar nombres de habilidades en paralelo
  const abilityPromises = missingAbilities.map(async (ability) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability.ability.name}`);
      if (response.ok) {
        const abilityData = await response.json();
        
        // Buscar nombre en español SOLAMENTE
        const spanishName = abilityData.names.find(name => 
          name.language.name === 'es'
        )?.name;
        
        // Si no hay nombre en español, usar fallback con nombre en inglés
        if (!spanishName) {
          console.warn(`Habilidad ${ability.ability.name} no tiene nombre en español`);
          const fallbackInfo = {
            spanishName: `${ability.ability.name.replace('-', ' ')} (en inglés - no disponible en español)`,
            is_hidden: ability.is_hidden || false
          };
          abilitiesCache.value[ability.ability.name] = fallbackInfo;
          return { name: ability.ability.name, data: fallbackInfo };
        }
        
        const abilityInfo = {
          spanishName: spanishName,
          is_hidden: ability.is_hidden || false
        };
        
        // Guardar en caché (solo nombre por ahora, descripción se carga al hacer clic)
        abilitiesCache.value[ability.ability.name] = abilityInfo;
        return { name: ability.ability.name, data: abilityInfo };
      }
    } catch (err) {
      console.error(`Error cargando ${ability.ability.name}:`, err);
      const fallbackInfo = {
        spanishName: `${ability.ability.name.replace('-', ' ')} (en inglés - error al cargar)`,
        is_hidden: ability.is_hidden || false
      };
      abilitiesCache.value[ability.ability.name] = fallbackInfo;
      return { name: ability.ability.name, data: fallbackInfo };
    }
  });
  
  await Promise.all(abilityPromises);
  console.log(`✅ Nombres de habilidades cargados en español`);
}

// Cargar detalles de movimientos de forma optimizada - TODOS los movimientos
async function loadMovesDetails() {
  if (!pokemon.value) return;
  
  loadingMoves.value = true;
  const details = {};
  
  try {
    // Cargar TODOS los movimientos del Pokémon
    const movesToLoad = pokemon.value.moves;
    console.log(`🎯 Cargando ${movesToLoad.length} movimientos de ${getPokemonNameInSpanish(pokemon.value)}`);
    
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
          
          // Buscar nombre en español SOLAMENTE
          const spanishName = moveData.names.find(name => 
            name.language.name === 'es'
          )?.name;
          
          // Si no hay nombre en español, usar el nombre en inglés con indicación
          const finalMoveName = spanishName || `${move.move.name.replace('-', ' ')} (en inglés - no disponible en español)`;
          
          // Obtener información del nivel de aprendizaje
          const moveEntry = move.version_group_details.find(entry => 
            entry.move_learn_method.name === 'level-up'
          );
          const learnLevel = moveEntry ? moveEntry.level_learned_at : null;
          const learnMethod = move.version_group_details[0]?.move_learn_method.name || 'unknown';
          
          const moveInfo = {
            type: moveData.type?.name || 'normal',
            power: moveData.power || '-',
            accuracy: moveData.accuracy || '-',
            pp: moveData.pp || '-',
            spanishName: finalMoveName,
            damage_class: moveData.damage_class?.name || 'status',
            level_learned_at: learnLevel,
            learn_method: learnMethod,
            priority: moveData.priority || 0
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
          spanishName: `${move.move.name.replace('-', ' ')} (en inglés - error al cargar)`,
          damage_class: 'status',
          level_learned_at: null,
          learn_method: 'unknown',
          priority: 0
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
      if (result && result.data) {
        details[result.name] = result.data;
      }
    });
    
    movesDetails.value = details;
    console.log(`✅ ¡Cargados ${Object.keys(details).length} movimientos en español! (${newMoves.length} nuevos, ${cachedMoves.length} de caché)`);
    
    const totalMoves = pokemon.value.moves.length;
    const spanishMoves = Object.keys(details).length + cachedMoves.length;
    if (spanishMoves < totalMoves) {
      console.log(`ℹ️ Se omitieron ${totalMoves - spanishMoves} movimientos sin traducción al español`);
    }
    
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
    
    // Buscar el movimiento en la lista del Pokémon para obtener la URL y nivel
    const moveData = pokemon.value.moves.find(m => m.move.name === moveName);
    if (!moveData) {
      throw new Error('Movimiento no encontrado');
    }
    
    // Obtener información del nivel de aprendizaje
    const moveEntry = moveData.version_group_details.find(entry => 
      entry.move_learn_method.name === 'level-up'
    );
    const learnLevel = moveEntry ? moveEntry.level_learned_at : null;
    const learnMethod = moveData.version_group_details[0]?.move_learn_method.name || 'unknown';
    
    // Cargar detalles completos del movimiento
    const response = await fetch(moveData.move.url);
    if (!response.ok) {
      throw new Error('Error al cargar detalles del movimiento');
    }
    
    const fullMoveData = await response.json();
    
    // Buscar nombre en español SOLAMENTE
    const spanishName = fullMoveData.names.find(name => 
      name.language.name === 'es'
    )?.name;
    
    // Si no hay nombre en español, usar el nombre en inglés con indicación
    const finalMoveName = spanishName || `${fullMoveData.name.replace('-', ' ')} (en inglés - no disponible en español)`;
    
    // Buscar descripción SOLO en español
    const description = fullMoveData.effect_entries.find(entry => 
      entry.language.name === 'es'
    )?.effect || '';
    
    // Buscar descripción corta SOLO en español
    const shortDescription = fullMoveData.flavor_text_entries.find(entry => 
      entry.language.name === 'es'
    )?.flavor_text || '';
    
    // Si no hay descripción en español, usar descripción en inglés con indicación
    let finalDescription = '';
    if (shortDescription && shortDescription.trim() !== '') {
      finalDescription = shortDescription;
    } else if (description && description.trim() !== '') {
      finalDescription = description;
    } else {
      // Buscar descripción en inglés como fallback
      const englishDescription = fullMoveData.flavor_text_entries.find(entry => 
        entry.language.name === 'en'
      )?.flavor_text || '';
      
      finalDescription = englishDescription ? 
        `${englishDescription} (en inglés - no disponible en español)` : 
        'Descripción no disponible';
    }
    
    // Traducir categoría de daño
    const damageClassTranslations = {
      'physical': 'Físico',
      'special': 'Especial', 
      'status': 'Estado'
    };
    
    // Crear objeto con todos los detalles
    const moveDetails = {
      name: fullMoveData.name,
      spanishName: finalMoveName,
      type: fullMoveData.type?.name || 'normal',
      power: fullMoveData.power || '-',
      accuracy: fullMoveData.accuracy || '-',
      pp: fullMoveData.pp || '-',
      priority: fullMoveData.priority || 0,
      damage_class: fullMoveData.damage_class?.name || 'unknown',
      damage_class_spanish: damageClassTranslations[fullMoveData.damage_class?.name] || 'Desconocido',
      description: finalDescription.replace(/\$effect_chance/g, fullMoveData.effect_chance || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
      shortDescription: shortDescription,
      effect_chance: fullMoveData.effect_chance || null,
      level_learned_at: learnLevel,
      learn_method: learnMethod
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
      spanishName: `${moveName.replace('-', ' ')} (en inglés - error al cargar)`,
      type: 'normal',
      power: '-',
      accuracy: '-',
      pp: '-',
      description: 'Error al cargar descripción del movimiento.',
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
    
    // Buscar nombre en español SOLAMENTE (usar del caché si ya lo tenemos)
    let spanishName = abilitiesCache.value[abilityName]?.spanishName || 
                     fullAbilityData.names.find(name => 
                       name.language.name === 'es'
                     )?.name;
    
    // Si no hay nombre en español, usar el nombre en inglés con indicación
    const finalAbilityName = spanishName || `${abilityName.replace('-', ' ')} (en inglés - no disponible en español)`;
    
    // Buscar descripción SOLO en español
    const description = fullAbilityData.flavor_text_entries.find(entry => 
      entry.language.name === 'es'
    )?.flavor_text || '';
    
    // Si no hay descripción en español, buscar en inglés como fallback
    let finalDescription = '';
    if (description && description.trim() !== '') {
      finalDescription = description;
    } else {
      const englishDescription = fullAbilityData.flavor_text_entries.find(entry => 
        entry.language.name === 'en'
      )?.flavor_text || '';
      
      finalDescription = englishDescription ? 
        `${englishDescription} (en inglés - no disponible en español)` : 
        'Descripción no disponible';
    }
    
    // Buscar efecto detallado SOLO en español
    const spanishEffect = fullAbilityData.effect_entries.find(entry => 
      entry.language.name === 'es'
    )?.effect || '';
    
    // Si no hay efecto en español, buscar en inglés como fallback
    let finalEffect = '';
    if (spanishEffect && spanishEffect.trim() !== '') {
      finalEffect = spanishEffect;
    } else {
      const englishEffect = fullAbilityData.effect_entries.find(entry => 
        entry.language.name === 'en'
      )?.effect || '';
      
      finalEffect = englishEffect ? 
        `${englishEffect} (en inglés - no disponible en español)` : '';
    }
    
    // Crear objeto con todos los detalles
    const abilityDetails = {
      name: fullAbilityData.name,
      spanishName: finalAbilityName,
      description: finalDescription.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
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

// Función computada para filtrar y ordenar movimientos
const filteredAndSortedMoves = computed(() => {
  if (!pokemon.value || !showAllMoves.value) return [];
  
  let moves = pokemon.value.moves.map(move => {
    const details = movesDetails.value[move.move.name];
    const moveEntry = move.version_group_details.find(entry => 
      entry.move_learn_method.name === 'level-up'
    );
    const learnLevel = moveEntry ? moveEntry.level_learned_at : null;
    const learnMethod = move.version_group_details[0]?.move_learn_method.name || 'unknown';
    
    return {
      ...move,
      details,
      level_learned_at: learnLevel,
      learn_method: learnMethod
    };
  }).filter(move => {
    // Mostrar todos los movimientos que tienen datos (ahora incluyen nombres en inglés cuando no hay español)
    return move.details && move.details.spanishName;
  });
  
  // Filtrar por tipo de daño
  if (movesFilterBy.value !== 'all') {
    moves = moves.filter(move => {
      if (!move.details) return false;
      return move.details.damage_class === movesFilterBy.value;
    });
  }
  
  // Ordenar
  moves.sort((a, b) => {
    let valueA, valueB;
    
    switch (movesSortBy.value) {
      case 'level':
        valueA = a.level_learned_at || 999; // Los que no se aprenden por nivel al final
        valueB = b.level_learned_at || 999;
        break;
      case 'name':
        valueA = getMoveNameInSpanish(a.move.name).toLowerCase();
        valueB = getMoveNameInSpanish(b.move.name).toLowerCase();
        break;
      case 'type':
        valueA = getTypeInSpanish(a.details?.type || 'normal').toLowerCase();
        valueB = getTypeInSpanish(b.details?.type || 'normal').toLowerCase();
        break;
      case 'damage_class':
        valueA = a.details?.damage_class || 'status';
        valueB = b.details?.damage_class || 'status';
        break;
      case 'power':
        valueA = a.details?.power === '-' ? 0 : parseInt(a.details?.power || 0);
        valueB = b.details?.power === '-' ? 0 : parseInt(b.details?.power || 0);
        break;
      default:
        return 0;
    }
    
    if (valueA < valueB) return movesOrderAsc.value ? -1 : 1;
    if (valueA > valueB) return movesOrderAsc.value ? 1 : -1;
    return 0;
  });
  
  return moves;
});

// Función para obtener método de aprendizaje en español
function getLearnMethodInSpanish(method) {
  const methodTranslations = {
    'level-up': 'Por Nivel',
    'machine': 'MT/MO',
    'egg': 'Por Huevo',
    'tutor': 'Tutor',
    'light-ball-egg': 'Huevo Especial',
    'colosseum-purification': 'Purificación',
    'xd-shadow': 'Sombra XD',
    'xd-purification': 'Purificación XD',
    'form-change': 'Cambio de Forma'
  };
  
  return methodTranslations[method] || method;
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
  
  // Si no hay nombre en español, mostrar el nombre en inglés con indicación
  return `${moveName.replace('-', ' ')} (en inglés - no disponible en español)`;
}

// Función para obtener nombres de Pokémon en español
function getPokemonNameInSpanish(pokemon) {
  // Si ya tenemos el nombre en español, usarlo
  if (pokemon.spanishName) {
    return pokemon.spanishName;
  }
  
  // Fallback al nombre original mientras se carga
  return pokemon.name;
}

// Función para cargar nombre de Pokémon en español
async function loadPokemonNameInSpanish(pokemonData) {
  try {
    // Si ya tiene nombre en español, no hacer nada
    if (pokemonData.spanishName) {
      return pokemonData;
    }
    
    // Cargar información de especies para obtener el nombre en español
    const speciesResponse = await fetch(pokemonData.species.url);
    if (speciesResponse.ok) {
      const speciesData = await speciesResponse.json();
      
      // Buscar nombre en español
      const spanishName = speciesData.names.find(name => 
        name.language.name === 'es'
      )?.name;
      
      // Si encontramos nombre en español, agregarlo al objeto
      if (spanishName) {
        pokemonData.spanishName = spanishName;
        console.log(`✅ Nombre en español para ${pokemonData.name}: ${spanishName}`);
      } else {
        console.warn(`❌ No se encontró nombre en español para ${pokemonData.name}`);
        pokemonData.spanishName = `${pokemonData.name} (en inglés - no disponible en español)`; // Fallback con indicación
      }
    }
  } catch (error) {
    console.error(`Error cargando nombre en español para ${pokemonData.name}:`, error);
    pokemonData.spanishName = `${pokemonData.name} (en inglés - no disponible en español)`; // Fallback con indicación
  }
  
  return pokemonData;
}

// Función para obtener nombres de habilidades en español
function getAbilityNameInSpanish(abilityName) {
  // Si ya tenemos el nombre en español en el caché, usarlo
  if (abilitiesCache.value[abilityName]?.spanishName) {
    return abilitiesCache.value[abilityName].spanishName;
  }
  
  // Si no hay nombre en caché, usar traducciones manuales como fallback
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
  
  return abilityTranslations[abilityName] || `${abilityName.replace('-', ' ')} (en inglés - no disponible en español)`;
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
