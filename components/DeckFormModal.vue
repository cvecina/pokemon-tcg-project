<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <form @submit.prevent="handleSubmit">
        <h3 class="font-bold text-lg mb-4">
          {{ deck ? 'Editar Mazo' : 'Crear Nuevo Mazo' }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nombre -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nombre del mazo *</span>
            </label>
            <input 
              v-model="formData.name"
              type="text" 
              placeholder="Ej: Pikachu Control" 
              class="input input-bordered"
              required
            />
          </div>

          <!-- Formato -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Formato</span>
            </label>
            <select v-model="formData.format" class="select select-bordered">
              <option value="Standard">Standard</option>
              <option value="Expanded">Expanded</option>
              <option value="Unlimited">Unlimited</option>
            </select>
          </div>
        </div>

        <!-- Descripción -->
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text">Descripción</span>
          </label>
          <textarea 
            v-model="formData.description"
            class="textarea textarea-bordered h-24" 
            placeholder="Describe la estrategia de tu mazo..."
          ></textarea>
        </div>

        <!-- Etiquetas -->
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text">Etiquetas</span>
          </label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span 
              v-for="(tag, index) in formData.tags" 
              :key="index"
              class="badge badge-outline gap-1"
            >
              {{ tag }}
              <button 
                type="button"
                @click="removeTag(index)"
                class="text-error hover:text-error-focus"
              >
                ✕
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input 
              v-model="newTag"
              @keyup.enter="addTag"
              type="text" 
              placeholder="Agregar etiqueta..." 
              class="input input-bordered flex-1"
            />
            <button 
              type="button"
              @click="addTag"
              class="btn btn-ghost"
              :disabled="!newTag.trim()"
            >
              Agregar
            </button>
          </div>
        </div>

        <!-- Etiquetas predefinidas -->
        <div class="mt-2">
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Etiquetas sugeridas:</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="suggestedTag in suggestedTags"
              :key="suggestedTag"
              type="button"
              @click="addSuggestedTag(suggestedTag)"
              class="badge badge-ghost hover:badge-primary cursor-pointer"
              :disabled="formData.tags.includes(suggestedTag)"
            >
              + {{ suggestedTag }}
            </button>
          </div>
        </div>

        <!-- Tema de color -->
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text">Tema de color</span>
          </label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="theme in colorThemes"
              :key="theme.value"
              type="button"
              @click="formData.theme = theme.value"
              :class="[
                'btn btn-sm',
                formData.theme === theme.value ? 'btn-active' : 'btn-outline'
              ]"
              :style="{ backgroundColor: formData.theme === theme.value ? theme.color : 'transparent', borderColor: theme.color }"
            >
              {{ theme.name }}
            </button>
          </div>
        </div>

        <!-- Configuración adicional -->
        <div class="form-control mt-4">
          <label class="cursor-pointer label justify-start gap-2">
            <input 
              v-model="formData.isFavorite" 
              type="checkbox" 
              class="checkbox checkbox-warning"
            />
            <span class="label-text">⭐ Marcar como favorito</span>
          </label>
        </div>

        <!-- Botones -->
        <div class="modal-action">
          <button 
            type="button" 
            @click="$emit('close')"
            class="btn"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="btn btn-primary"
            :disabled="!formData.name.trim()"
          >
            {{ deck ? 'Actualizar' : 'Crear Mazo' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  deck: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

// Datos del formulario
const formData = reactive({
  name: '',
  description: '',
  format: 'Standard',
  tags: [],
  theme: 'default',
  isFavorite: false
})

// Estado local
const newTag = ref('')

// Temas de color disponibles
const colorThemes = [
  { name: 'Default', value: 'default', color: '#3b82f6' },
  { name: 'Fire', value: 'fire', color: '#ef4444' },
  { name: 'Water', value: 'water', color: '#06b6d4' },
  { name: 'Grass', value: 'grass', color: '#22c55e' },
  { name: 'Electric', value: 'electric', color: '#eab308' },
  { name: 'Psychic', value: 'psychic', color: '#a855f7' },
  { name: 'Fighting', value: 'fighting', color: '#f97316' },
  { name: 'Dark', value: 'dark', color: '#374151' },
  { name: 'Metal', value: 'metal', color: '#6b7280' },
  { name: 'Fairy', value: 'fairy', color: '#ec4899' },
  { name: 'Dragon', value: 'dragon', color: '#7c3aed' },
  { name: 'Colorless', value: 'colorless', color: '#9ca3af' }
]

// Etiquetas sugeridas
const suggestedTags = [
  'Aggro', 'Control', 'Combo', 'Midrange', 'Ramp',
  'Meta', 'Budget', 'Fun', 'Experimental', 'Tournament',
  'VMAX', 'GX', 'TAG TEAM', 'Single Prize', 'Toolbox'
]

// Inicializar formulario si estamos editando
if (props.deck) {
  Object.assign(formData, {
    name: props.deck.name || '',
    description: props.deck.description || '',
    format: props.deck.format || 'Standard',
    tags: [...(props.deck.tags || [])],
    theme: props.deck.theme || 'default',
    isFavorite: props.deck.isFavorite || false
  })
}

// Funciones
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    newTag.value = ''
  }
}

const addSuggestedTag = (tag) => {
  if (!formData.tags.includes(tag)) {
    formData.tags.push(tag)
  }
}

const removeTag = (index) => {
  formData.tags.splice(index, 1)
}

const handleSubmit = () => {
  const deckData = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    format: formData.format,
    tags: formData.tags,
    theme: formData.theme,
    isFavorite: formData.isFavorite
  }
  
  emit('save', deckData)
}
</script>
