<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { installmentService } from '@/api/installment.service'
import { orderService } from '@/api/order.service'
import { ensureArray } from '@/api/http'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const orders = ref([])

const form = ref({
  id: '',
  orderId: '',
  installmentNumber: 1,
  amount: null,
  maturity: '',
  paid: false,
  paymentDate: '',
  method: '',
})

const methodOptions = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Dinheiro', 'Transferência']

onMounted(async () => {
  try {
    const { data } = await orderService.getAll()
    orders.value = ensureArray(data)
  } catch {
    /* ignore */
  }

  if (isEdit.value) {
    try {
      const { data } = await installmentService.getById(route.params.id)
      form.value = {
        id: data.id || '',
        orderId: data.orderId || '',
        installmentNumber: data.installmentNumber ?? 1,
        amount: data.amount ?? null,
        maturity: data.maturity || '',
        paid: data.paid ?? false,
        paymentDate: data.paymentDate || '',
        method: data.method || '',
      }
    } catch {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Parcela não encontrada', life: 3000 })
      router.push('/installments')
    }
  } else {
    form.value.id = crypto.randomUUID()
  }
})

async function handleSubmit() {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (!payload.paymentDate) delete payload.paymentDate

    if (isEdit.value) {
      await installmentService.update(route.params.id, payload)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parcela atualizada', life: 3000 })
    } else {
      await installmentService.create(payload)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parcela criada', life: 3000 })
    }
    router.push('/installments')
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
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/installments')" />
      <h1 class="m-0 text-2xl text-[#0f1b2d]">
        {{ isEdit ? 'Editar Parcela' : 'Nova Parcela' }}
      </h1>
    </div>

    <div class="mx-auto max-w-2xl rounded-xl border border-[#c8d6e5]/60 bg-white p-6 shadow-sm">
      <form class="grid gap-5" @submit.prevent="handleSubmit">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">Pedido</span>
          <Select
            v-model="form.orderId"
            :options="orders"
            optionValue="orderId"
            placeholder="Selecione o pedido"
            filter
            fluid
          >
            <template #option="{ option }">
              {{ String(option.orderId).substring(0, 8) }}… — {{ option.user?.name || 'Sem cliente' }}
            </template>
            <template #value="{ value }">
              {{ value ? String(value).substring(0, 8) + '…' : 'Selecione o pedido' }}
            </template>
          </Select>
        </label>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Nº da Parcela</span>
            <InputNumber v-model="form.installmentNumber" :min="1" fluid />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Valor (R$)</span>
            <InputNumber v-model="form.amount" mode="currency" currency="BRL" locale="pt-BR" fluid />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Vencimento</span>
            <InputText v-model="form.maturity" type="date" fluid />
          </label>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Método de Pagamento</span>
            <Select v-model="form.method" :options="methodOptions" placeholder="Selecione" editable fluid />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Data do Pagamento</span>
            <InputText v-model="form.paymentDate" type="date" fluid />
          </label>
        </div>

        <label class="flex items-center gap-3">
          <Checkbox v-model="form.paid" binary />
          <span class="text-sm font-semibold text-[#1a2744]">Parcela paga</span>
        </label>

        <div class="mt-2 flex justify-end gap-3">
          <Button label="Cancelar" severity="secondary" outlined @click="router.push('/installments')" />
          <Button type="submit" :label="isEdit ? 'Salvar' : 'Criar parcela'" icon="pi pi-check" :loading="saving" />
        </div>
      </form>
    </div>
  </div>
</template>
