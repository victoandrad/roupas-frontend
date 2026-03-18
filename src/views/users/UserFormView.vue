<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { userService } from '@/api/user.service'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  role: '',
  password: '',
})

const roleOptions = ['ADMIN', 'USER']

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await userService.getById(route.params.id)
      form.value = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        role: data.role || '',
        password: '',
      }
    } catch {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Usuário não encontrado', life: 3000 })
      router.push('/users')
    }
  }
})

async function handleSubmit() {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (isEdit.value) {
      delete payload.password
      await userService.update(route.params.id, payload)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado', life: 3000 })
    } else {
      await userService.create(payload)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado', life: 3000 })
    }
    router.push('/users')
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
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/users')" />
      <h1 class="m-0 text-2xl text-[#0f1b2d]">
        {{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}
      </h1>
    </div>

    <div class="mx-auto max-w-2xl rounded-xl border border-[#c8d6e5]/60 bg-white p-6 shadow-sm">
      <form class="grid gap-5" @submit.prevent="handleSubmit">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">Nome</span>
          <InputText v-model="form.name" placeholder="Nome completo" required fluid />
        </label>

        <label class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">E-mail</span>
          <InputText v-model="form.email" type="email" placeholder="email@exemplo.com" required fluid />
        </label>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Telefone</span>
            <InputText v-model="form.phone" placeholder="(00) 00000-0000" fluid />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[#1a2744]">Perfil</span>
            <Select v-model="form.role" :options="roleOptions" placeholder="Selecione" fluid />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">Endereço</span>
          <InputText v-model="form.address" placeholder="Endereço completo" fluid />
        </label>

        <label v-if="!isEdit" class="grid gap-2">
          <span class="text-sm font-semibold text-[#1a2744]">Senha</span>
          <Password v-model="form.password" placeholder="Crie uma senha" toggleMask required fluid :feedback="false" />
        </label>

        <div class="mt-2 flex justify-end gap-3">
          <Button label="Cancelar" severity="secondary" outlined @click="router.push('/users')" />
          <Button
            type="submit"
            :label="isEdit ? 'Salvar alterações' : 'Criar usuário'"
            icon="pi pi-check"
            :loading="saving"
          />
        </div>
      </form>
    </div>
  </div>
</template>
