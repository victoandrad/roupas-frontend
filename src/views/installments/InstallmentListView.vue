<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { installmentService } from '@/api/installment.service'
import { ensureArray } from '@/api/http'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const installments = ref([])
const loading = ref(true)

onMounted(() => loadInstallments())

async function loadInstallments() {
  loading.value = true
  try {
    const { data } = await installmentService.getAll()
    installments.value = ensureArray(data)
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar parcelas', life: 3000 })
  } finally {
    loading.value = false
  }
}

async function markAsPaid(item) {
  try {
    await installmentService.update(item.id, {
      ...item,
      paid: true,
      paymentDate: new Date().toISOString().split('T')[0],
    })
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parcela marcada como paga', life: 3000 })
    await loadInstallments()
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar', life: 3000 })
  }
}

function confirmDelete(item) {
  confirm.require({
    message: 'Deseja excluir esta parcela?',
    header: 'Confirmar exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Excluir',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await installmentService.delete(item.id)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parcela excluída', life: 3000 })
        await loadInstallments()
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

function paymentStatus(item) {
  if (item.paid) return { label: 'Pago', severity: 'success' }
  if (item.maturity && new Date(item.maturity) < new Date()) return { label: 'Vencido', severity: 'danger' }
  return { label: 'Pendente', severity: 'warn' }
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between">
      <h1 class="m-0 text-2xl text-[#0f1b2d]">Parcelas</h1>
      <Button label="Nova Parcela" icon="pi pi-plus" @click="router.push('/installments/new')" />
    </div>

    <div class="rounded-xl border border-[#c8d6e5]/60 bg-white shadow-sm">
      <DataTable :value="installments" :loading="loading" paginator :rows="10" stripedRows removableSort>
        <Column field="installmentNumber" header="Nº Parcela" sortable />
        <Column field="orderId" header="Pedido">
          <template #body="{ data }">
            <span class="font-mono text-xs">{{ data.orderId ? String(data.orderId).substring(0, 8) + '…' : '—' }}</span>
          </template>
        </Column>
        <Column field="amount" header="Valor" sortable>
          <template #body="{ data }">{{ formatPrice(data.amount) }}</template>
        </Column>
        <Column field="maturity" header="Vencimento" sortable />
        <Column field="method" header="Método" />
        <Column field="paid" header="Status" sortable>
          <template #body="{ data }">
            <Tag :value="paymentStatus(data).label" :severity="paymentStatus(data).severity" />
          </template>
        </Column>
        <Column header="Ações" style="width: 14rem">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                v-if="!data.paid"
                icon="pi pi-check"
                severity="success"
                text
                rounded
                v-tooltip="'Marcar como pago'"
                @click="markAsPaid(data)"
              />
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="router.push(`/installments/${data.id}/edit`)"
              />
              <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(data)" />
            </div>
          </template>
        </Column>
        <template #empty>Nenhuma parcela encontrada.</template>
      </DataTable>
    </div>
  </div>
</template>
