<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { to: '/products', icon: 'pi pi-tag', label: 'Produtos' },
  { to: '/orders', icon: 'pi pi-shopping-cart', label: 'Pedidos' },
  { to: '/inventory', icon: 'pi pi-box', label: 'Estoque' },
  { to: '/installments', icon: 'pi pi-credit-card', label: 'Parcelas' },
  { to: '/users', icon: 'pi pi-users', label: 'Usuários' },
]

function isActive(to) {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>

<template>
  <aside class="flex w-64 flex-col bg-[#0f1b2d] text-white">
    <div class="flex items-center gap-3 px-6 py-5">
      <i class="pi pi-shop text-2xl text-[#93c5fd]"></i>
      <span class="text-lg font-bold tracking-wide">Louis Vittão</span>
    </div>

    <nav class="mt-2 flex flex-1 flex-col gap-1 px-3">
      <RouterLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-[0.92rem] transition-colors no-underline"
        :class="
          isActive(item.to)
            ? 'bg-white/15 font-semibold text-[#93c5fd]'
            : 'text-white/70 hover:bg-white/8 hover:text-white'
        "
      >
        <i :class="item.icon" class="text-base"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t border-white/10 px-6 py-4">
      <p class="m-0 text-xs text-white/40">© 2026 Louis Vittão</p>
    </div>
  </aside>
</template>
