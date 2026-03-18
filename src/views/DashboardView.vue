<script setup>
import { ref, onMounted } from 'vue'
import { productService } from '@/api/product.service'
import { orderService } from '@/api/order.service'
import { inventoryService } from '@/api/inventory.service'
import { installmentService } from '@/api/installment.service'
import { ensureArray } from '@/api/http'

const stats = ref([
  { label: 'Produtos', icon: 'pi pi-tag', value: '—', color: '#1e3a5f', bg: '#dbeafe' },
  { label: 'Pedidos', icon: 'pi pi-shopping-cart', value: '—', color: '#1d4e8f', bg: '#d6e8fc' },
  { label: 'Movimentações', icon: 'pi pi-box', value: '—', color: '#0f4c75', bg: '#cce4f7' },
  { label: 'Parcelas Pendentes', icon: 'pi pi-credit-card', value: '—', color: '#8f1d1d', bg: '#fcd6d6' },
])

const loading = ref(true)

onMounted(async () => {
  try {
    const [products, orders, movements, installments] = await Promise.all([
      productService.getAll().then((r) => ensureArray(r.data)),
      orderService.getAll().then((r) => ensureArray(r.data)),
      inventoryService.getAll().then((r) => ensureArray(r.data)),
      installmentService.getAll().then((r) => ensureArray(r.data)),
    ])
    stats.value[0].value = products.length
    stats.value[1].value = orders.length
    stats.value[2].value = movements.length
    stats.value[3].value = installments.filter((i) => !i.paid).length
  } catch {
    // keep placeholders
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="m-0 mb-6 text-2xl text-[#0f1b2d]">Dashboard</h1>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex items-center gap-4 rounded-xl border border-[#c8d6e5]/60 bg-white p-5 shadow-sm"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl"
          :style="{ backgroundColor: stat.bg }"
        >
          <i :class="stat.icon" class="text-xl" :style="{ color: stat.color }"></i>
        </div>
        <div>
          <p class="m-0 text-sm text-[#3d5a80]">{{ stat.label }}</p>
          <p class="m-0 mt-1 text-2xl font-bold text-[#0f1b2d]">
            <template v-if="loading">…</template>
            <template v-else>{{ stat.value }}</template>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
