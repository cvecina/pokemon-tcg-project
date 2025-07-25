# 🃏 PokéDeck Master

**La herramienta definitiva para construir y gestionar tus mazos de Pokémon TCG**

Una aplicación web moderna construida con Nuxt 3 que te permite crear, gestionar y analizar tus mazos de Pokémon Trading Card Game con acceso a la base de datos oficial.

## ⚡ Características Principales

- **🎲 Gestión de Mazos**: Crea, edita, duplica y organiza tus mazos
- **🔍 Búsqueda de Cartas**: Acceso completo a la API oficial de Pokémon TCG  
- **📊 Estadísticas Avanzadas**: Análisis de tipos, rareza y distribución de cartas
- **🌙 Modo Oscuro**: Cambia entre tema claro y oscuro
- **📱 Responsive**: Funciona perfectamente en móvil y desktop
- **💾 Persistencia Local**: Guarda tus mazos localmente sin necesidad de servidor
- **🎯 Validación de Mazos**: Verifica que cumplan las reglas del formato

## 🚀 Instalación Rápida

```bash
# Clona el repositorio
git clone [tu-repo]
cd pokemon-tcg-project

# Instala las dependencias
pnpm install

# Configura las variables de entorno
cp .env.example .env
# Edita .env y agrega tu API key de Pokemon TCG

# Inicia el servidor de desarrollo
pnpm dev
```

## 🔑 Configuración de API Key

1. **Obtén tu API key gratuita** en [Pokemon TCG Developer Portal](https://dev.pokemontcg.io/)
2. **Copia el archivo de ejemplo**: `cp .env.example .env`
3. **Edita el archivo `.env`** y agrega tu API key:

```env
POKEMON_TCG_API_KEY=tu_api_key_aqui
NUXT_POKEMON_TCG_API_KEY=tu_api_key_aqui
```

> ⚠️ **Importante**: Nunca compartas tu API key públicamente. El archivo `.env` está en `.gitignore` para proteger tus credenciales.

## 🛠️ Tecnologías Utilizadas

- **[Nuxt 3](https://nuxt.com/)** - Framework Vue.js con SSR
- **[Tailwind CSS](https://tailwindcss.com/)** + **[DaisyUI](https://daisyui.com/)** - Estilos y componentes
- **[Pinia](https://pinia.vuejs.org/)** - Gestión de estado
- **[Pokemon TCG SDK](https://github.com/PokemonTCG/pokemon-tcg-sdk-typescript)** - API oficial de Pokémon
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Vue 3](https://vuejs.org/)** - Framework reactivo

## 📖 Estructura del Proyecto

```
├── components/          # Componentes reutilizables
│   ├── Header.vue      # Navegación principal
│   ├── CardDetailModal.vue
│   ├── CardSearchModal.vue
│   └── DeckFormModal.vue
├── pages/              # Páginas de la aplicación
│   ├── index.vue       # Página principal
│   ├── test-cards.vue  # Vista de cartas Pokémon
│   ├── cards/          # Explorador de cartas
│   └── decks/          # Gestión de mazos
├── stores/             # Stores de Pinia
│   ├── cards.store.js  # Gestión de cartas y API
│   ├── decks.store.js  # Gestión de mazos
│   └── alert.store.js  # Sistema de notificaciones
└── assets/             # Recursos estáticos
```

## 🎮 Cómo Usar

### 1. **Explorar Cartas**
- Ve a `/test-cards` para buscar cartas de Pokémon
- Usa la búsqueda o los botones rápidos  
- Haz clic en cualquier carta para ver detalles

### 2. **Crear un Mazo**
- Ve a `/decks` y haz clic en "Nuevo Mazo"
- Llena los datos básicos (nombre, formato, descripción)
- Agrega cartas usando el modal de búsqueda

### 3. **Gestionar Mazos**
- Edita, duplica o elimina mazos existentes
- Ve estadísticas detalladas por mazo
- Exporta mazos en formato JSON

## 🧪 Páginas de Desarrollo

- **`/`** - Página principal con estadísticas
- **`/decks`** - Gestión completa de mazos  
- **`/cards`** - Explorador avanzado con filtros
- **`/test-cards`** - Vista simplificada para probar la API

## 📝 Scripts Disponibles
Hay props obligatorios:
- titulo
- datos
- camposTabla

Datos ha de ser un array de objetos para funcionar.

```javascript
 <TablaDefault
      titulo="Configuración de eventos"
      :datos="eventosStore.allFiltrado"
      :camposTabla="eventosStore.camposTabla"
      :editar="editarEvento"
      :remove="eliminarEvento"
      :totalData="eventosStore.totalData"
      :limit="eventosStore.limit"
      :isActive="true"
      :offset="eventosStore.offset"
      @cambiarPagina="cambiarPagina($event)"
      @cambiarEstadoUser="checkEstadoCambiar"
    >
      <template #zona__izquierda>
        <Buscador @buscarDatos="buscarDatos" />
      </template>
      <template #zona__derecha>
        <button class="boton__empresa p-2 m-2 rounded" @click="insertEvent">
          Insertar
        </button>
      </template>
    </TablaDefault>

// campos tabla ejemplo
const camposTabla = [
[
            { campo: "id", tipo: "text", visible: false, label: "ID", activo: true },
            { campo: "dias_activo", tipo: "text", contar: true, subformat: "array", visible: true, label: "Días", activo: true },
            { campo: "disabled", tipo: "text", formato: "bool", visible: false, label: "Disabled", activo: true },
            { campo: "periodo", tipo: "text", visible: true, label: "Periodo", activo: true },
            { campo: "segundos", formato: "minutos", tipo: "text", visible: true, label: "Duración", activo: true },
            { campo: "tipo_envio", tipo: "text", visible: true, label: "Envío", activo: true },
            { campo: "createdAt", tipo: "text", formato: "datetime", visible: true, label: "Momento", activo: false },
            { campo: "eventos_por_dia", tipo: "text", contar: true, subformat: "array", visible: true, label: "Eventos por día", activo: true },
            { campo: "festivos", tipo: "text", subformat: "array", contar: true, visible: true, label: "Festivos", activo: true },
        ]
];
```

Como se puede observar, hay un template en medio del form. se puede añadir como #extra un template ya que hay ```<slots>``` dentro.

## Ejemplo de uso Formulario dinámico
Hay props obligatorios:
- titulo
- camposFormulario
- store
- buttonsFormulario

```javascript
 <FormularioDinamico
      titulo="Insertar video"
      :camposFormulario="camposForm"
      :store="videosStore.new"
      :buttonsFormulario="buttonsFormulario"
    >
      <template #extra>
        <VideoUploader />
      </template>
    </FormularioDinamico>

// campos form
const camposForm = [
{
    campo_bbdd: "nombre",
    tipo: "text",
    placeholder: "Nombre",
  },
  {
    campo_bbdd: "descripcion",
    tipo: "text",
    placeholder: "Descripción",
  }
];

// store
// en este caso, al usar pinia, se llama a videosStore.new

// buttonsFormulario

// se pueden pasar actions que sean arrowFunction dentro del mismo componente, o se puede ejecutar directamente.
const buttonsFormulario = [
  { text: "Insertar vídeo", action: insertar },
  { text: "Cerrar", action: () => router.push("/admin/videos") },
];
```

Como se puede observar, hay un template en medio del form. se puede añadir como #extra un template ya que hay ```<slots>``` dentro.

## Roadmap

Here’s a glimpse into the exciting journey ahead for our project:

### Próximamente

- **2024 - general**: 
  - [Acabar readme.md]: Terminar toda la documentación.
  - [Repasar bugs y añadir funciones que faltan]: Revisar y testear.

- **2025**: 
  - [Añadir filtros en servidor]: Poder filtrar datos en servidor y mejorar la paginación.
  - [Añadir hoja de estilos default]: Se espera poder tener en 2025 un estilo homogéneo para toda la base web reutilizable.

We’re excited about what’s coming and will keep you updated as we progress. Your feedback and support are crucial as we build the future!

## Changelog

- **v1.0.0** (07-10-2024): Initial release.

## Contacto

Para cualquier duda:

- **Email**: [cvecinav@gmail.com]

Espero que sirva como introducción al template :)