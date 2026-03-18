<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
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
  email: '',
  password: '',
  remember: false,
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.email, form.password)
    router.push('/products')
  } catch (e) {
    error.value = e.response?.status === 401
      ? 'E-mail ou senha incorretos.'
      : 'Erro ao conectar. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout
    title="Entrar na conta"
    subtitle="Use seu e-mail e senha para continuar."
  >
    <form class="grid gap-4" @submit.prevent="handleLogin">
      <label class="grid gap-2">
        <span class="text-[0.92rem] font-semibold text-white/80">E-mail</span>
        <InputText v-model="form.email" type="email" placeholder="voce@exemplo.com" required fluid />
      </label>

      <label class="grid gap-2">
        <span class="text-[0.92rem] font-semibold text-white/80">Senha</span>
        <Password
          v-model="form.password"
          placeholder="Digite sua senha"
          :feedback="false"
          toggleMask
          required
          fluid
        />
      </label>

      <div class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <label class="inline-flex items-center gap-2 text-[0.92rem] text-white/50">
          <Checkbox v-model="form.remember" binary inputId="rememberMe" />
          <span>Manter conectado</span>
        </label>
        <a href="#" class="text-[0.92rem] font-semibold text-[#93c5fd] no-underline hover:underline">
          Esqueci minha senha
        </a>
      </div>

      <p v-if="error" class="m-0 text-sm text-red-400">{{ error }}</p>

      <Button type="submit" label="Entrar" icon="pi pi-sign-in" class="mt-1" :loading="loading" fluid />

      <Divider align="center" class="!border-white/10">
        <span class="text-xs text-white/40">ou</span>
      </Divider>

      <p class="m-0 text-center text-white/50">
        Ainda não possui conta?
        <RouterLink to="/register" class="font-bold text-[#93c5fd] no-underline hover:underline">
          Criar conta
        </RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>
