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
import { userService } from '@/api/user.service'
import { ensureArray } from '@/api/http'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const users = ref([])
const loading = ref(true)
const search = ref('')

onMounted(() => loadUsers())

async function loadUsers() {
  loading.value = true
  try {
    const { data } = await userService.getAll()
    users.value = ensureArray(data)
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar usuários', life: 3000 })
  } finally {
    loading.value = false
  }
}

function confirmDelete(user) {
  confirm.require({
    message: `Deseja excluir "${user.name}"?`,
    header: 'Confirmar exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Excluir',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await userService.delete(user.userId)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído', life: 3000 })
        await loadUsers()
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
      <h1 class="m-0 text-2xl text-[#0f1b2d]">Usuários</h1>
      <Button label="Novo Usuário" icon="pi pi-plus" @click="router.push('/users/new')" />
    </div>

    <div class="rounded-xl border border-[#c8d6e5]/60 bg-white shadow-sm">
      <div class="border-b border-[#c8d6e5]/40 p-4">
        <InputText v-model="search" placeholder="Buscar usuário..." class="w-full sm:w-80" />
      </div>
      <DataTable
        :value="users"
        :loading="loading"
        :globalFilterFields="['name', 'email', 'role']"
        :globalFilter="search"
        paginator
        :rows="10"
        stripedRows
        removableSort
      >
        <Column field="name" header="Nome" sortable />
        <Column field="email" header="E-mail" sortable />
        <Column field="phone" header="Telefone" />
        <Column field="role" header="Perfil" sortable>
          <template #body="{ data }">
            <Tag :value="data.role || '—'" :severity="data.role === 'ADMIN' ? 'danger' : 'info'" />
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
                @click="router.push(`/users/${data.userId}/edit`)"
              />
              <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete(data)" />
            </div>
          </template>
        </Column>
        <template #empty>Nenhum usuário encontrado.</template>
      </DataTable>
    </div>
  </div>
</template>
