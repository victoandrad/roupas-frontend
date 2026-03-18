<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import { productService } from '@/api/product.service'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)

const form = ref({
  name: '',
  category: '',
  color: '',
  size: '',
  price: null,
  active: true,
})

const sizeOptions = ['PP', 'P', 'M', 'G', 'GG', 'XG']
const categoryOptions = ['Camiseta', 'Calça', 'Vestido', 'Jaqueta', 'Saia', 'Bermuda', 'Camisa', 'Moletom', 'Outro']

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true
    try {
      const { data } = await productService.getById(route.params.id)
      form.value = {
        name: data.name || '',
        category: data.category || '',
        color: data.color || '',
        size: data.size || '',
        price: data.price ?? null,
        active: data.active ?? true,
      }
    } catch {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Produto não encontrado', life: 3000 })
      router.push('/products')
    } finally {
      loading.value = false
    }
  }
})

async function handleSubmit() {
  saving.value = true
  try {
    if (isEdit.value) {
      await productService.update(route.params.id, form.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto atualizado', life: 3000 })
    } else {
      await productService.create(form.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto criado', life: 3000 })
    }
    router.push('/products')
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar produto', life: 3000 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center gap-3">
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/products')" />
      <h1 class="m-0 text-2xl text-[#0f1b2d]">
        {{ isEdit ? 'Editar Produto' : 'Novo Produto' }}
      </h1>
    </div>

    <div class="mx-auto max-w-2xl rounded-xl border border-[#c8d6e5]/60 bg-white p-6 shadow-sm">
      <form class="grid gap-5" @submit.prevent="handleSubmit">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">Nome</span>
          <InputText v-model="form.name" placeholder="Nome do produto" required fluid />
        </label>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Categoria</span>
            <Select
              v-model="form.category"
              :options="categoryOptions"
              placeholder="Selecione"
              editable
              fluid
            />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Cor</span>
            <InputText v-model="form.color" placeholder="Cor" fluid />
          </label>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Tamanho</span>
            <Select v-model="form.size" :options="sizeOptions" placeholder="Selecione" fluid />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Preço (R$)</span>
            <InputNumber
              v-model="form.price"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              placeholder="0,00"
              fluid
            />
          </label>
        </div>

        <label class="flex items-center gap-3">
          <ToggleSwitch v-model="form.active" />
          <span class="text-sm font-semibold text-[#1a2744]">Produto ativo</span>
        </label>

        <div class="mt-2 flex justify-end gap-3">
          <Button label="Cancelar" severity="secondary" outlined @click="router.push('/products')" />
          <Button
            type="submit"
            :label="isEdit ? 'Salvar alterações' : 'Criar produto'"
            icon="pi pi-check"
            :loading="saving"
          />
        </div>
      </form>
    </div>
  </div>
</template>
