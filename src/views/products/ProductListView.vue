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
import { productService } from '@/api/product.service'
import { ensureArray } from '@/api/http'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const products = ref([])
const loading = ref(true)
const search = ref('')

onMounted(() => loadProducts())

async function loadProducts() {
  loading.value = true
  try {
    const { data } = await productService.getAll()
    products.value = ensureArray(data)
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar produtos', life: 3000 })
  } finally {
    loading.value = false
  }
}

function confirmDelete(product) {
  confirm.require({
    message: `Deseja excluir "${product.name}"?`,
    header: 'Confirmar exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Excluir',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await productService.delete(product.productId)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto excluído', life: 3000 })
        await loadProducts()
      } catch {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir', life: 3000 })
      }
    },
  })
}

function formatPrice(value) {
  if (value == null) return '—'
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between">
      <h1 class="m-0 text-2xl text-[#0f1b2d]">Produtos</h1>
      <Button label="Novo Produto" icon="pi pi-plus" @click="router.push('/products/new')" />
    </div>

    <div class="rounded-xl border border-[#c8d6e5]/60 bg-white shadow-sm">
      <div class="border-b border-[#c8d6e5]/40 p-4">
        <InputText v-model="search" placeholder="Buscar produto..." class="w-full sm:w-80" />
      </div>
      <DataTable
        :value="products"
        :loading="loading"
        :globalFilterFields="['name', 'category', 'color', 'size']"
        :globalFilter="search"
        paginator
        :rows="10"
        stripedRows
        removableSort
      >
        <Column field="name" header="Nome" sortable />
        <Column field="category" header="Categoria" sortable />
        <Column field="color" header="Cor" sortable />
        <Column field="size" header="Tamanho" sortable />
        <Column field="price" header="Preço" sortable>
          <template #body="{ data }">{{ formatPrice(data.price) }}</template>
        </Column>
        <Column field="active" header="Status" sortable>
          <template #body="{ data }">
            <Tag :value="data.active ? 'Ativo' : 'Inativo'" :severity="data.active ? 'success' : 'danger'" />
          </template>
        </Column>
        <Column header="Ações" style="width: 10rem">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="router.push(`/products/${data.productId}/edit`)"
              />
              <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(data)" />
            </div>
          </template>
        </Column>
        <template #empty>Nenhum produto encontrado.</template>
      </DataTable>
    </div>
  </div>
</template>
