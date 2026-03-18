<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { inventoryService } from '@/api/inventory.service'
import { productService } from '@/api/product.service'
import { ensureArray } from '@/api/http'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const products = ref([])

const form = ref({
  productId: null,
  type: 'IN',
  quantity: 1,
  date: new Date().toISOString().split('T')[0],
  reason: '',
})

const typeOptions = [
  { label: 'Entrada (IN)', value: 'IN' },
  { label: 'Saída (OUT)', value: 'OUT' },
]

onMounted(async () => {
  try {
    const { data } = await productService.getAll()
    products.value = ensureArray(data)
  } catch {
    /* ignore */
  }

  if (isEdit.value) {
    try {
      const { data } = await inventoryService.getById(route.params.id)
      form.value = {
        productId: data.productId || null,
        type: data.type || 'IN',
        quantity: data.quantity ?? 1,
        date: data.date || '',
        reason: data.reason || '',
      }
    } catch {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Movimentação não encontrada', life: 3000 })
      router.push('/inventory')
    }
  }
})

async function handleSubmit() {
  saving.value = true
  try {
    if (isEdit.value) {
      await inventoryService.update(route.params.id, form.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimentação atualizada', life: 3000 })
    } else {
      await inventoryService.create(form.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimentação registrada', life: 3000 })
    }
    router.push('/inventory')
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar', life: 3000 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center gap-3">
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/inventory')" />
      <h1 class="m-0 text-2xl text-[#0f1b2d]">
        {{ isEdit ? 'Editar Movimentação' : 'Nova Movimentação' }}
      </h1>
    </div>

    <div class="mx-auto max-w-2xl rounded-xl border border-[#c8d6e5]/60 bg-white p-6 shadow-sm">
      <form class="grid gap-5" @submit.prevent="handleSubmit">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">Produto</span>
          <Select
            v-model="form.productId"
            :options="products"
            optionLabel="name"
            optionValue="productId"
            placeholder="Selecione o produto"
            filter
            fluid
          />
        </label>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Tipo</span>
            <Select v-model="form.type" :options="typeOptions" optionLabel="label" optionValue="value" fluid />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Quantidade</span>
            <InputNumber v-model="form.quantity" :min="1" fluid />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Data</span>
            <InputText v-model="form.date" type="date" fluid />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">Motivo</span>
          <Textarea v-model="form.reason" rows="3" placeholder="Motivo da movimentação" fluid />
        </label>

        <div class="mt-2 flex justify-end gap-3">
          <Button label="Cancelar" severity="secondary" outlined @click="router.push('/inventory')" />
          <Button type="submit" :label="isEdit ? 'Salvar' : 'Registrar'" icon="pi pi-check" :loading="saving" />
        </div>
      </form>
    </div>
  </div>
</template>
