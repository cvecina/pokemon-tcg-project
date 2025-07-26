<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
    <!-- Global Header -->
    <GlobalHeader />
    
    <!-- Main Content -->
    <main class="min-h-screen">
      <slot />
    </main>
    
    <!-- Toast Notifications -->
    <Toast />
    
    <!-- Footer -->
    <!-- <Footer /> -->
  </div>
</template>

<script setup>
// Import any global utilities or stores if needed
</script>