<template>
  <header class="navbar bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
    <div class="navbar-start">
      <!-- Mobile menu button -->
      <div class="dropdown lg:hidden">
        <label tabindex="0" class="btn btn-ghost">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><NuxtLink to="/">🏠 Inicio</NuxtLink></li>
          <li><NuxtLink to="/decks">🎲 Mis Mazos</NuxtLink></li>
          <li><NuxtLink to="/cards">🔍 Explorar Cartas</NuxtLink></li>
        </ul>
      </div>
      
      <!-- Logo -->
      <NuxtLink to="/" class="btn btn-ghost text-xl font-bold">
        <span class="text-2xl mr-2">⚡</span>
        PokéDeck Master
      </NuxtLink>
    </div>
    
    <!-- Desktop Navigation -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><NuxtLink to="/" class="text-base">🏠 Inicio</NuxtLink></li>
        <li><NuxtLink to="/decks" class="text-base">🎲 Mis Mazos</NuxtLink></li>
        <li><NuxtLink to="/cards" class="text-base">🔍 Explorar Cartas</NuxtLink></li>
      </ul>
    </div>
    
    <!-- Right side actions -->
    <div class="navbar-end">
      <!-- Theme toggle -->
      <label class="swap swap-rotate mr-2">
        <input type="checkbox" class="theme-controller" value="dark" />
        <svg class="swap-off fill-current w-6 h-6" viewBox="0 0 24 24">
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
        </svg>
        <svg class="swap-on fill-current w-6 h-6" viewBox="0 0 24 24">
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
        </svg>
      </label>
      
      <!-- Quick actions -->
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
          </svg>
        </label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><a @click="createNewDeck">🎲 Nuevo Mazo</a></li>
          <li><a @click="searchCards">🔍 Buscar Cartas</a></li>
          <li><a @click="importDeck">📁 Importar Mazo</a></li>
          <li class="divider"></li>
          <li><a href="https://github.com/cvecina/pokemon-tcg-project" target="_blank">🔗 GitHub</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const createNewDeck = () => {
  router.push('/decks?create=true')
}

const searchCards = () => {
  router.push('/cards')
}

const importDeck = () => {
  // TODO: Implementar funcionalidad de importar mazo
  console.log('Import deck functionality')
}
</script>
