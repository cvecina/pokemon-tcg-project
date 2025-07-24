<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-4xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">{{ card.name }}</h3>
        <button @click="$emit('close')" class="btn btn-ghost btn-circle">✕</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Card Image -->
        <div class="flex justify-center">
          <img 
            :src="card.images?.large || card.images?.small" 
            :alt="card.name"
            class="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>

        <!-- Card Details -->
        <div class="space-y-4">
          <!-- Basic Info -->
          <div>
            <h4 class="font-bold text-lg mb-2">{{ card.name }}</h4>
            <div class="flex flex-wrap gap-2 mb-4">
              <div class="badge badge-primary">{{ card.supertype }}</div>
              <div v-if="card.subtypes" class="badge badge-secondary">
                {{ card.subtypes.join(', ') }}
              </div>
              <div v-if="card.rarity" class="badge badge-accent">{{ card.rarity }}</div>
            </div>
          </div>

          <!-- Types -->
          <div v-if="card.types && card.types.length > 0">
            <h5 class="font-semibold mb-2">Tipos:</h5>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="type in card.types" 
                :key="type"
                class="badge badge-outline"
              >
                {{ type }}
              </span>
            </div>
          </div>

          <!-- HP (for Pokémon) -->
          <div v-if="card.hp" class="flex items-center gap-2">
            <span class="font-semibold">HP:</span>
            <span class="text-xl font-bold text-red-500">{{ card.hp }}</span>
          </div>

          <!-- Attacks (for Pokémon) -->
          <div v-if="card.attacks && card.attacks.length > 0">
            <h5 class="font-semibold mb-2">Ataques:</h5>
            <div class="space-y-3">
              <div 
                v-for="attack in card.attacks" 
                :key="attack.name"
                class="border rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
              >
                <div class="flex justify-between items-start mb-2">
                  <span class="font-semibold">{{ attack.name }}</span>
                  <span v-if="attack.damage" class="text-lg font-bold text-red-500">
                    {{ attack.damage }}
                  </span>
                </div>
                <div v-if="attack.cost && attack.cost.length > 0" class="mb-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Costo: </span>
                  <span 
                    v-for="energy in attack.cost" 
                    :key="energy"
                    class="badge badge-ghost badge-xs mr-1"
                  >
                    {{ energy }}
                  </span>
                </div>
                <p v-if="attack.text" class="text-sm">{{ attack.text }}</p>
              </div>
            </div>
          </div>

          <!-- Abilities (for Pokémon) -->
          <div v-if="card.abilities && card.abilities.length > 0">
            <h5 class="font-semibold mb-2">Habilidades:</h5>
            <div class="space-y-3">
              <div 
                v-for="ability in card.abilities" 
                :key="ability.name"
                class="border rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
              >
                <div class="flex justify-between items-start mb-2">
                  <span class="font-semibold">{{ ability.name }}</span>
                  <span class="badge badge-outline badge-sm">{{ ability.type }}</span>
                </div>
                <p class="text-sm">{{ ability.text }}</p>
              </div>
            </div>
          </div>

          <!-- Rules (for Trainer cards) -->
          <div v-if="card.rules && card.rules.length > 0">
            <h5 class="font-semibold mb-2">Reglas:</h5>
            <div class="space-y-2">
              <p 
                v-for="rule in card.rules" 
                :key="rule"
                class="text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                {{ rule }}
              </p>
            </div>
          </div>

          <!-- Weakness & Resistance (for Pokémon) -->
          <div v-if="card.weaknesses || card.resistances" class="grid grid-cols-2 gap-4">
            <div v-if="card.weaknesses">
              <h5 class="font-semibold mb-2">Debilidades:</h5>
              <div class="space-y-1">
                <div 
                  v-for="weakness in card.weaknesses" 
                  :key="weakness.type"
                  class="flex justify-between text-sm"
                >
                  <span>{{ weakness.type }}</span>
                  <span>{{ weakness.value }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="card.resistances">
              <h5 class="font-semibold mb-2">Resistencias:</h5>
              <div class="space-y-1">
                <div 
                  v-for="resistance in card.resistances" 
                  :key="resistance.type"
                  class="flex justify-between text-sm"
                >
                  <span>{{ resistance.type }}</span>
                  <span>{{ resistance.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Retreat Cost (for Pokémon) -->
          <div v-if="card.retreatCost && card.retreatCost.length > 0">
            <h5 class="font-semibold mb-2">Costo de Retirada:</h5>
            <div class="flex gap-1">
              <span 
                v-for="energy in card.retreatCost" 
                :key="energy"
                class="badge badge-ghost badge-sm"
              >
                {{ energy }}
              </span>
            </div>
          </div>

          <!-- Set Information -->
          <div v-if="card.set">
            <h5 class="font-semibold mb-2">Set:</h5>
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <img 
                  v-if="card.set.images?.symbol" 
                  :src="card.set.images.symbol" 
                  :alt="card.set.name"
                  class="w-6 h-6"
                />
                <span class="font-semibold">{{ card.set.name }}</span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <span>{{ card.number }}/{{ card.set.printedTotal || card.set.total }}</span>
                <span v-if="card.set.releaseDate"> • {{ card.set.releaseDate }}</span>
              </div>
            </div>
          </div>

          <!-- Market Information -->
          <div v-if="card.tcgplayer || card.cardmarket">
            <h5 class="font-semibold mb-2">Precios de Mercado:</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div v-if="card.tcgplayer?.prices" class="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <span class="font-semibold">TCGPlayer:</span>
                <div v-if="card.tcgplayer.prices.normal">
                  Normal: ${{ card.tcgplayer.prices.normal.market }}
                </div>
                <div v-if="card.tcgplayer.prices.holofoil">
                  Holofoil: ${{ card.tcgplayer.prices.holofoil.market }}
                </div>
              </div>
              <div v-if="card.cardmarket?.prices" class="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <span class="font-semibold">Cardmarket:</span>
                <div>Promedio: €{{ card.cardmarket.prices.averageSellPrice }}</div>
              </div>
            </div>
          </div>

          <!-- Add to Deck Actions -->
          <div class="card-actions justify-end pt-4 border-t">
            <div class="flex gap-2">
              <button 
                @click="addToDeck(1)"
                class="btn btn-primary"
              >
                + 1 al mazo
              </button>
              <button 
                @click="addToDeck(2)"
                class="btn btn-secondary"
              >
                + 2 al mazo
              </button>
              <button 
                @click="addToDeck(4)"
                class="btn btn-accent"
              >
                + 4 al mazo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'add-to-deck'])

const addToDeck = (quantity) => {
  emit('add-to-deck', props.card, quantity)
}
</script>
