<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Select from 'primevue/select'
import { inventoryService } from '@/api/inventory.service'
import { productService } from '@/api/product.service'
import { ensureArray } from '@/api/http'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const movements = ref([])
const productMap = ref({})
const loading = ref(true)
const typeFilter = ref(null)

const typeOptions = [
  { label: 'Todos', value: null },
  { label: 'Entrada', value: 'IN' },
  { label: 'Saída', value: 'OUT' },
]

onMounted(async () => {
  try {
    const { data } = await productService.getAll()
    const prods = ensureArray(data)
    prods.forEach((p) => (productMap.value[p.productId] = p.name))
  } catch { /* ignore */ }
  await loadMovements()
})

async function loadMovements() {
  loading.value = true
  try {
    let res
    if (typeFilter.value) {
      res = await inventoryService.getByType(typeFilter.value)
    } else {
      res = await inventoryService.getAll()
    }
    movements.value = ensureArray(res.data)
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar movimentações', life: 3000 })
  } finally {
    loading.value = false
  }
}

function confirmDelete(item) {
  confirm.require({
    message: 'Deseja excluir esta movimentação?',
    header: 'Confirmar exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Excluir',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await inventoryService.delete(item.id)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimentação excluída', life: 3000 })
        await loadMovements()
      } catch {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir', life: 3000 })
      }
    },
  })
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between">
      <h1 class="m-0 text-2xl text-[#0f1b2d]">Movimentação de Estoque</h1>
      <Button label="Nova Movimentação" icon="pi pi-plus" @click="router.push('/inventory/new')" />
    </div>

    <div class="rounded-xl border border-[#c8d6e5]/60 bg-white shadow-sm">
      <div class="flex items-center gap-4 border-b border-[#c8d6e5]/40 p-4">
        <Select
          v-model="typeFilter"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Filtrar por tipo"
          class="w-48"
          @change="loadMovements"
        />
      </div>
      <DataTable :value="movements" :loading="loading" paginator :rows="10" stripedRows removableSort>
        <Column field="id" header="ID">
          <template #body="{ data }">
            <span class="font-mono text-xs">{{ String(data.id).substring(0, 8) }}…</span>
          </template>
        </Column>
        <Column field="productId" header="Produto">
          <template #body="{ data }">
            <span>{{ productMap[data.productId] || String(data.productId).substring(0, 8) + '…' }}</span>
          </template>
        </Column>
        <Column field="type" header="Tipo" sortable>
          <template #body="{ data }">
            <Tag :value="data.type === 'IN' ? 'Entrada' : 'Saída'" :severity="data.type === 'IN' ? 'success' : 'warn'" />
          </template>
        </Column>
        <Column field="quantity" header="Quantidade" sortable />
        <Column field="date" header="Data" sortable />
        <Column field="reason" header="Motivo" />
        <Column header="Ações" style="width: 10rem">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="router.push(`/inventory/${data.id}/edit`)"
              />
              <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(data)" />
            </div>
          </template>
        </Column>
        <template #empty>Nenhuma movimentação encontrada.</template>
      </DataTable>
    </div>
  </div>
</template>
