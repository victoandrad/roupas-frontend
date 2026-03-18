<script setup>
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <Toast />
  <ConfirmDialog />
    <div class="flex min-h-screen bg-[#f0f4f8]">
    <AppSidebar />
    <div class="flex flex-1 flex-col">
      <AppHeader />
      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
