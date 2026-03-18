<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import { orderService } from '@/api/order.service'
import { orderItemService } from '@/api/order-item.service'
import { productService } from '@/api/product.service'
import { ensureArray } from '@/api/http'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirmSvc = useConfirm()

const order = ref(null)
const items = ref([])
const allProducts = ref([])
const products = ref([])
const loading = ref(true)
const showItemDialog = ref(false)
const savingItem = ref(false)

const itemForm = ref({ productId: null, quantity: 1, unitPrice: null })

onMounted(async () => {
  try {
    const [orderRes, productsRes] = await Promise.all([
      orderService.getById(route.params.id),
      productService.getAll(),
    ])
    order.value = orderRes.data
    allProducts.value = ensureArray(productsRes.data)
    products.value = allProducts.value.filter((p) => p.active !== false)
    await loadItems()
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Pedido não encontrado', life: 3000 })
    router.push('/orders')
  } finally {
    loading.value = false
  }
})

async function loadItems() {
  try {
    const { data } = await orderItemService.getByOrder(route.params.id)
    items.value = ensureArray(data)
  } catch {
    items.value = []
  }
}

function openAddItem() {
  itemForm.value = { productId: null, quantity: 1, unitPrice: null }
  showItemDialog.value = true
}

function onProductSelect() {
  const prod = products.value.find((p) => p.productId === itemForm.value.productId)
  if (prod) itemForm.value.unitPrice = prod.price
}

async function saveItem() {
  savingItem.value = true
  try {
    await orderItemService.create({
      order: { orderId: route.params.id },
      product: { productId: itemForm.value.productId },
      quantity: itemForm.value.quantity,
      unitPrice: itemForm.value.unitPrice,
    })
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item adicionado', life: 3000 })
    showItemDialog.value = false
    await loadItems()
    await recalcTotal()
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao adicionar item', life: 3000 })
  } finally {
    savingItem.value = false
  }
}

function confirmDeleteItem(item) {
  confirmSvc.require({
    message: 'Deseja remover este item?',
    header: 'Confirmar exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Remover',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await orderItemService.delete(item.orderItemId)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item removido', life: 3000 })
        await loadItems()
        await recalcTotal()
      } catch {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao remover item', life: 3000 })
      }
    },
  })
}

function formatPrice(value) {
  if (value == null) return '—'
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function recalcTotal() {
  const total = items.value.reduce((sum, i) => sum + (Number(i.subtotal) || 0), 0)
  try {
    await orderService.update(route.params.id, {
      ...order.value,
      totalAmount: total,
      user: { userId: order.value.user?.userId },
    })
    order.value.totalAmount = total
  } catch { /* ignore */ }
}

function statusSeverity(status) {
  const map = { PENDENTE: 'warn', CONCLUIDO: 'success', CANCELADO: 'danger', EM_ANDAMENTO: 'info' }
  return map[status] || 'secondary'
}
</script>

<template>
  <div v-if="!loading && order">
    <div class="mb-5 flex items-center gap-3">
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/orders')" />
      <h1 class="m-0 text-2xl text-[#0f1b2d]">Detalhes do Pedido</h1>
    </div>

    <!-- Order Info -->
    <div class="mb-6 rounded-xl border border-[#c8d6e5]/60 bg-white p-6 shadow-sm">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div>
          <p class="m-0 text-xs text-[#5a6b80]">ID</p>
          <p class="m-0 mt-1 font-mono text-sm font-semibold">{{ String(order.orderId).substring(0, 8) }}…</p>
        </div>
        <div>
          <p class="m-0 text-xs text-[#5a6b80]">Data</p>
          <p class="m-0 mt-1 text-sm font-semibold">{{ order.createdAt }}</p>
        </div>
        <div>
          <p class="m-0 text-xs text-[#5a6b80]">Status</p>
          <Tag :value="order.status || '—'" :severity="statusSeverity(order.status)" class="mt-1" />
        </div>
        <div>
          <p class="m-0 text-xs text-[#5a6b80]">Total</p>
          <p class="m-0 mt-1 text-sm font-semibold">{{ formatPrice(order.totalAmount) }}</p>
        </div>
        <div>
          <p class="m-0 text-xs text-[#5a6b80]">Desconto</p>
          <p class="m-0 mt-1 text-sm font-semibold">{{ formatPrice(order.discount) }}</p>
        </div>
        <div>
          <p class="m-0 text-xs text-[#5a6b80]">Cliente</p>
          <p class="m-0 mt-1 text-sm font-semibold">{{ order.user?.name || '—' }}</p>
        </div>
      </div>
      <div v-if="order.notes" class="mt-4 border-t border-[#c8d6e5]/40 pt-3">
        <p class="m-0 text-xs text-[#5a6b80]">Observações</p>
        <p class="m-0 mt-1 text-sm">{{ order.notes }}</p>
      </div>
    </div>

    <!-- Items -->
    <div class="rounded-xl border border-[#c8d6e5]/60 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-[#c8d6e5]/40 p-4">
        <h2 class="m-0 text-lg font-semibold text-[#0f1b2d]">Itens do Pedido</h2>
        <Button label="Adicionar Item" icon="pi pi-plus" size="small" @click="openAddItem" />
      </div>
      <DataTable :value="items" stripedRows>
        <Column header="Produto">
          <template #body="{ data }">{{ data.product?.name || '—' }}</template>
        </Column>
        <Column field="quantity" header="Qtd" />
        <Column field="unitPrice" header="Preço Unit.">
          <template #body="{ data }">{{ formatPrice(data.unitPrice) }}</template>
        </Column>
        <Column field="subtotal" header="Subtotal">
          <template #body="{ data }">{{ formatPrice(data.subtotal) }}</template>
        </Column>
        <Column header="" style="width: 5rem">
          <template #body="{ data }">
            <Button icon="pi pi-trash" severity="danger" text rounded size="small" @click="confirmDeleteItem(data)" />
          </template>
        </Column>
        <template #empty>Nenhum item neste pedido.</template>
      </DataTable>
    </div>

    <!-- Add Item Dialog -->
    <Dialog v-model:visible="showItemDialog" header="Adicionar Item" modal :style="{ width: '28rem' }">
      <form class="grid gap-4" @submit.prevent="saveItem">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">Produto</span>
          <Select
            v-model="itemForm.productId"
            :options="products"
            optionLabel="name"
            optionValue="productId"
            placeholder="Selecione o produto"
            filter
            fluid
            @change="onProductSelect"
          />
        </label>
        <div class="grid grid-cols-2 gap-4">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Quantidade</span>
            <InputNumber v-model="itemForm.quantity" :min="1" fluid />
          </label>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Preço Unit. (R$)</span>
            <InputNumber v-model="itemForm.unitPrice" mode="currency" currency="BRL" locale="pt-BR" fluid />
          </label>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <Button label="Cancelar" severity="secondary" outlined @click="showItemDialog = false" />
          <Button type="submit" label="Adicionar" icon="pi pi-check" :loading="savingItem" />
        </div>
      </form>
    </Dialog>
  </div>

  <div v-else class="flex items-center justify-center py-20">
    <i class="pi pi-spinner pi-spin text-4xl text-[#2563eb]"></i>
  </div>
</template>
