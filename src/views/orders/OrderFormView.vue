<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { orderService } from '@/api/order.service'
import { userService } from '@/api/user.service'
import { ensureArray } from '@/api/http'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id && route.path.endsWith('/edit'))
const loading = ref(false)
const saving = ref(false)
const users = ref([])

const form = ref({
  createdAt: '',
  status: '',
  totalAmount: null,
  discountPercent: null,
  notes: '',
  userId: null,
})

const statusOptions = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']

onMounted(async () => {
  try {
    const { data } = await userService.getAll()
    users.value = ensureArray(data)
  } catch {
    /* ignore */
  }

  if (isEdit.value) {
    loading.value = true
    try {
      const { data } = await orderService.getById(route.params.id)
      form.value = {
        createdAt: data.createdAt || '',
        status: data.status || '',
        totalAmount: data.totalAmount ?? null,
        discountPercent: data.totalAmount && data.discount
          ? Math.round((data.discount / data.totalAmount) * 100 * 100) / 100
          : null,
        notes: data.notes || '',
        userId: data.user?.userId || null,
      }
    } catch {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Pedido não encontrado', life: 3000 })
      router.push('/orders')
    } finally {
      loading.value = false
    }
  } else {
    form.value.createdAt = new Date().toISOString().split('T')[0]
    form.value.status = 'PENDENTE'
  }
})

async function handleSubmit() {
  saving.value = true
  try {
    const discountValue = isEdit.value && form.value.discountPercent && form.value.totalAmount
      ? (form.value.discountPercent / 100) * form.value.totalAmount
      : 0

    const payload = {
      createdAt: form.value.createdAt,
      status: form.value.status,
      totalAmount: form.value.totalAmount || 0,
      discount: discountValue,
      notes: form.value.notes,
      user: { userId: form.value.userId },
    }

    if (isEdit.value) {
      await orderService.update(route.params.id, payload)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido atualizado', life: 3000 })
      router.push('/orders')
    } else {
      const { data } = await orderService.create(payload)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido criado! Adicione os itens.', life: 4000 })
      router.push(`/orders/${data.orderId}`)
      return
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar pedido', life: 3000 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center gap-3">
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/orders')" />
      <h1 class="m-0 text-2xl text-[#0f1b2d]">
        {{ isEdit ? 'Editar Pedido' : 'Novo Pedido' }}
      </h1>
    </div>

    <div class="mx-auto max-w-2xl rounded-xl border border-[#c8d6e5]/60 bg-white p-6 shadow-sm">
      <form class="grid gap-5" @submit.prevent="handleSubmit">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">Cliente</span>
          <Select
            v-model="form.userId"
            :options="users"
            optionLabel="name"
            optionValue="userId"
            placeholder="Selecione o cliente"
            filter
            fluid
          />
        </label>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Data</span>
            <InputText v-model="form.createdAt" type="date" fluid />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Status</span>
            <Select v-model="form.status" :options="statusOptions" placeholder="Selecione" fluid />
          </label>
        </div>

        <div v-if="isEdit" class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Total (R$)</span>
            <InputNumber v-model="form.totalAmount" mode="currency" currency="BRL" locale="pt-BR" fluid disabled />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Desconto (%)</span>
            <InputNumber v-model="form.discountPercent" suffix="%" :min="0" :max="100" :minFractionDigits="0" :maxFractionDigits="2" fluid />
          </label>
        </div>

        <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Observações</span>
          <Textarea v-model="form.notes" rows="3" placeholder="Notas adicionais" fluid />
        </label>

        <div class="mt-2 flex justify-end gap-3">
          <Button label="Cancelar" severity="secondary" outlined @click="router.push('/orders')" />
          <Button
            type="submit"
            :label="isEdit ? 'Salvar alterações' : 'Criar pedido'"
            icon="pi pi-check"
            :loading="saving"
          />
        </div>
      </form>
    </div>
  </div>
</template>
