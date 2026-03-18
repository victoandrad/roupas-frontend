<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import { orderService } from '@/api/order.service'
import { ensureArray } from '@/api/http'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const orders = ref([])
const loading = ref(true)
const search = ref('')

onMounted(() => loadOrders())

async function loadOrders() {
  loading.value = true
  try {
    const { data } = await orderService.getAll()
    orders.value = ensureArray(data)
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar pedidos', life: 3000 })
  } finally {
    loading.value = false
  }
}

function confirmDelete(order) {
  confirm.require({
    message: `Deseja excluir este pedido?`,
    header: 'Confirmar exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Excluir',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await orderService.delete(order.orderId)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido excluído', life: 3000 })
        await loadOrders()
      } catch {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir', life: 3000 })
      }
    },
  })
}

function statusSeverity(status) {
  const map = {
    PENDENTE: 'warn',
    CONCLUIDO: 'success',
    CANCELADO: 'danger',
    EM_ANDAMENTO: 'info',
  }
  return map[status] || 'secondary'
}

function formatPrice(value) {
  if (value == null) return '—'
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between">
      <h1 class="m-0 text-2xl text-[#0f1b2d]">Pedidos</h1>
      <Button label="Novo Pedido" icon="pi pi-plus" @click="router.push('/orders/new')" />
    </div>

    <div class="rounded-xl border border-[#c8d6e5]/60 bg-white shadow-sm">
      <div class="border-b border-[#c8d6e5]/40 p-4">
        <InputText v-model="search" placeholder="Buscar pedido..." class="w-full sm:w-80" />
      </div>
      <DataTable
        :value="orders"
        :loading="loading"
        :globalFilterFields="['status', 'notes']"
        :globalFilter="search"
        paginator
        :rows="10"
        stripedRows
        removableSort
      >
        <Column field="orderId" header="ID" sortable>
          <template #body="{ data }">
            <span class="font-mono text-xs">{{ String(data.orderId).substring(0, 8) }}…</span>
          </template>
        </Column>
        <Column field="createdAt" header="Data" sortable />
        <Column field="status" header="Status" sortable>
          <template #body="{ data }">
            <Tag :value="data.status || '—'" :severity="statusSeverity(data.status)" />
          </template>
        </Column>
        <Column field="totalAmount" header="Total" sortable>
          <template #body="{ data }">{{ formatPrice(data.totalAmount) }}</template>
        </Column>
        <Column field="discount" header="Desconto" sortable>
          <template #body="{ data }">{{ formatPrice(data.discount) }}</template>
        </Column>
        <Column field="user" header="Cliente">
          <template #body="{ data }">{{ data.user?.name || '—' }}</template>
        </Column>
        <Column header="Ações" style="width: 12rem">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                icon="pi pi-eye"
                severity="secondary"
                text
                rounded
                @click="router.push(`/orders/${data.orderId}`)"
              />
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="router.push(`/orders/${data.orderId}/edit`)"
              />
              <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(data)" />
            </div>
          </template>
        </Column>
        <template #empty>Nenhum pedido encontrado.</template>
      </DataTable>
    </div>
  </div>
</template>
