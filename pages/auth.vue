<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
          🃏 TCG Manager
        </h1>
        <p class="text-white/80">{{ isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta nueva' }}</p>
      </div>

      <!-- Tabs -->
      <div class="flex mb-6 bg-white/10 rounded-lg p-1">
        <button 
          @click="isLogin = true"
          :class="isLogin ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'"
          class="flex-1 py-2 px-4 rounded-md transition-all duration-200 font-medium"
        >
          Iniciar Sesión
        </button>
        <button 
          @click="isLogin = false"
          :class="!isLogin ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'"
          class="flex-1 py-2 px-4 rounded-md transition-all duration-200 font-medium"
        >
          Registrarse
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email (solo registro) -->
        <div v-if="!isLogin">
          <label class="block text-white font-medium mb-2">Email</label>
          <input 
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="tu@email.com"
          />
        </div>

        <!-- Username o Email/Username -->
        <div>
          <label class="block text-white font-medium mb-2">
            {{ isLogin ? 'Email o Username' : 'Username' }}
          </label>
          <input 
            v-model="form.username"
            :type="isLogin ? 'text' : 'text'"
            required
            class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            :placeholder="isLogin ? 'email@example.com o username' : 'username'"
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label class="block text-white font-medium mb-2">Contraseña</label>
          <div class="relative">
            <input 
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-12"
              placeholder="Tu contraseña"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Confirmar contraseña (solo registro) -->
        <div v-if="!isLogin">
          <label class="block text-white font-medium mb-2">Confirmar Contraseña</label>
          <input 
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Confirma tu contraseña"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p class="text-red-200 text-sm">{{ error }}</p>
        </div>

        <!-- Success -->
        <div v-if="success" class="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
          <p class="text-green-200 text-sm">{{ success }}</p>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <div class="loading loading-spinner loading-sm mr-2"></div>
            Procesando...
          </span>
          <span v-else>
            {{ isLogin ? '🔓 Iniciar Sesión' : '🆕 Crear Cuenta' }}
          </span>
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-white/70 text-sm">
          {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
          <button 
            @click="toggleMode"
            class="text-blue-400 hover:text-blue-300 font-medium ml-1"
          >
            {{ isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí' }}
          </button>
        </p>
      </div>

      <!-- Volver al inicio -->
      <div class="mt-4 text-center">
        <NuxtLink 
          to="/"
          class="text-white/70 hover:text-white text-sm flex items-center justify-center gap-2"
        >
          ⬅️ Volver al inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Estados reactivos
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)

// Store de autenticación
const authStore = useAuthStore()
const router = useRouter()

// Formulario
const form = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
})

// Verificar si ya está autenticado
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})

// Cambiar entre login y registro
function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
  success.value = ''
  
  // Limpiar formulario
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}

// Manejar envío del formulario
async function handleSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    // Validaciones frontend
    if (!isLogin.value) {
      if (form.password !== form.confirmPassword) {
        error.value = 'Las contraseñas no coinciden'
        loading.value = false
        return
      }
      
      if (form.password.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres'
        loading.value = false
        return
      }
    }

    let result

    if (isLogin.value) {
      // Login
      result = await authStore.login(form.username, form.password)
    } else {
      // Registro
      result = await authStore.register(
        form.email,
        form.username,
        form.password,
        form.confirmPassword
      )
    }

    if (result.success) {
      success.value = result.message
      
      // Redireccionar después de 1 segundo
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'Error de conexión. Intenta de nuevo.'
    console.error('Error en formulario:', err)
  } finally {
    loading.value = false
  }
}

// Metadata
useHead({
  title: 'Login - TCG Manager',
  meta: [
    { name: 'description', content: 'Inicia sesión o regístrate en TCG Manager para gestionar tus cartas y mazos.' }
  ]
})

// Layout
definePageMeta({
  layout: false
})
</script>

<style scoped>
/* Efectos de focus personalizados */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
