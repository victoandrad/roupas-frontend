<script setup>
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import AuthLayout from '../layouts/AuthLayout.vue'

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const handleLogin = () => {
  console.log('Login submit', { ...form })
}
</script>

<template>
  <AuthLayout
    title="Entrar na conta"
    subtitle="Use seu e-mail e senha para continuar sua experiencia de compra."
  >
    <form class="grid gap-4" @submit.prevent="handleLogin">
      <label class="grid gap-2">
        <span class="text-[0.92rem] font-semibold text-[#40291d]">E-mail</span>
        <InputText v-model="form.email" type="email" placeholder="voce@exemplo.com" required fluid />
      </label>

      <label class="grid gap-2">
        <span class="text-[0.92rem] font-semibold text-[#40291d]">Senha</span>
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
        <label class="inline-flex items-center gap-2 text-[0.92rem] text-[#624e42]">
          <Checkbox v-model="form.remember" binary inputId="rememberMe" />
          <span>Manter conectado</span>
        </label>
        <a href="#" class="text-[0.92rem] font-semibold text-[#9f4f12] no-underline hover:underline">
          Esqueci minha senha
        </a>
      </div>

      <Button type="submit" label="Entrar" icon="pi pi-sign-in" class="mt-1" fluid />

      <Divider align="center">ou</Divider>

      <p class="m-0 text-center text-[#634d40]">
        Ainda nao possui conta?
        <RouterLink to="/register" class="font-bold text-[#2f1d13] no-underline hover:underline">
          Criar conta
        </RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>
