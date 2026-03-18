<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/api/user.service'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import AuthLayout from '../layouts/AuthLayout.vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  acceptTerms: false,
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  try {
    await userService.create({
      name: form.name,
      email: form.email,
      password: form.password,
      role: 'USER',
    })
    await authStore.login(form.email, form.password)
    router.push('/products')
  } catch (e) {
    error.value = 'Falha ao criar conta. Verifique os dados e tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout
    title="Criar nova conta"
    subtitle="Cadastre-se para acompanhar suas compras."
  >
    <form class="grid gap-4" @submit.prevent="handleRegister">
      <label class="grid gap-2">
        <span class="text-[0.92rem] font-semibold text-white/80">Nome completo</span>
        <InputText v-model="form.name" placeholder="Seu nome" autocomplete="name" required fluid />
      </label>

      <label class="grid gap-2">
        <span class="text-[0.92rem] font-semibold text-white/80">E-mail</span>
        <InputText
          v-model="form.email"
          type="email"
          placeholder="voce@exemplo.com"
          autocomplete="email"
          required
          fluid
        />
      </label>

      <label class="grid gap-2">
        <span class="text-[0.92rem] font-semibold text-white/80">Senha</span>
        <Password
          v-model="form.password"
          placeholder="Crie uma senha segura"
          promptLabel="Escolha uma senha"
          weakLabel="Fraca"
          mediumLabel="Média"
          strongLabel="Forte"
          toggleMask
          required
          fluid
        />
      </label>

      <label class="inline-flex items-start gap-2 text-[0.92rem] text-white/50">
        <Checkbox v-model="form.acceptTerms" binary inputId="acceptTerms" required />
        <span>Aceito os termos de uso e política de privacidade.</span>
      </label>

      <p v-if="error" class="m-0 text-sm text-red-400">{{ error }}</p>

      <Button
        type="submit"
        label="Criar conta"
        icon="pi pi-user-plus"
        class="mt-1"
        :disabled="!form.acceptTerms"
        :loading="loading"
        fluid
      />

      <Divider align="center" class="!border-white/10">
        <span class="text-xs text-white/40">ou</span>
      </Divider>

      <p class="m-0 text-center text-white/50">
        Já possui cadastro?
        <RouterLink to="/login" class="font-bold text-[#93c5fd] no-underline hover:underline">
          Entrar
        </RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>
