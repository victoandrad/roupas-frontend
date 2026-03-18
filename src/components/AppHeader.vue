<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="flex items-center justify-between border-b border-[#e2e8f0] bg-white px-6 py-3">
    <div></div>
    <div class="flex items-center gap-4">
      <span class="text-sm text-[#3d5a80]">
        <i class="pi pi-user mr-1"></i>
        {{ authStore.userEmail }}
      </span>
      <Button
        icon="pi pi-sign-out"
        label="Sair"
        severity="secondary"
        text
        size="small"
        class="logout-btn"
        @click="handleLogout"
      />
    </div>
  </header>
</template>

<style scoped>
.logout-btn:hover :deep(.p-button-label),
.logout-btn:hover :deep(.p-button-icon) {
  color: #dc2626 !important;
}

.logout-btn:hover {
  background: #fee2e2 !important;
}
</style>
