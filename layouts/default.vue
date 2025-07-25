<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <!-- <Header /> -->
    
    <!-- Main Content -->
    <main class="min-h-screen">
      <slot />
    </main>
    
    <!-- Toast Notifications -->
    <Toast />
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
// Import any global utilities or stores if needed
</script>