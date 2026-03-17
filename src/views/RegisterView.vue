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
  name: '',
  email: '',
  password: '',
  acceptTerms: false,
})

const handleRegister = () => {
  console.log('Register submit', { ...form })
}
</script>

<template>
  <AuthLayout
    title="Criar nova conta"
    subtitle="Cadastre-se para acompanhar colecoes, salvar favoritos e finalizar compras com mais rapidez."
  >
    <form class="grid gap-4" @submit.prevent="handleRegister">
      <label class="grid gap-2">
        <span class="text-[0.92rem] font-semibold text-[#40291d]">Nome completo</span>
        <InputText v-model="form.name" placeholder="Seu nome" autocomplete="name" required fluid />
      </label>

      <label class="grid gap-2">
        <span class="text-[0.92rem] font-semibold text-[#40291d]">E-mail</span>
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
        <span class="text-[0.92rem] font-semibold text-[#40291d]">Senha</span>
        <Password
          v-model="form.password"
          placeholder="Crie uma senha segura"
          promptLabel="Escolha uma senha"
          weakLabel="Fraca"
          mediumLabel="Media"
          strongLabel="Forte"
          toggleMask
          required
          fluid
        />
      </label>

      <label class="inline-flex items-start gap-2 text-[0.92rem] text-[#624e42]">
        <Checkbox v-model="form.acceptTerms" binary inputId="acceptTerms" required />
        <span>Aceito os termos de uso e politica de privacidade.</span>
      </label>

      <Button
        type="submit"
        label="Criar conta"
        icon="pi pi-user-plus"
        class="mt-1"
        :disabled="!form.acceptTerms"
        fluid
      />

      <Divider align="center">ou</Divider>

      <p class="m-0 text-center text-[#634d40]">
        Ja possui cadastro?
        <RouterLink to="/login" class="font-bold text-[#2f1d13] no-underline hover:underline">
          Entrar
        </RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>
