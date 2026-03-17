<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <main
    class="min-h-screen bg-[radial-gradient(circle_at_10%_20%,#f6d8b7_0%,transparent_25%),radial-gradient(circle_at_90%_10%,#fce3cf_0%,transparent_22%),linear-gradient(130deg,#fff3e9_0%,#fff_45%,#fff_100%)]"
  >
    <div class="grid min-h-screen grid-cols-1 md:mx-auto md:max-w-[1200px] md:grid-cols-[1fr_30rem] md:gap-8 md:px-8 lg:px-12">
      <section class="flex flex-col justify-center px-5 pb-3 pt-8 text-center text-[#2f1d13] md:px-6 md:py-16 md:pr-2 md:text-left">
        <span
          class="mx-auto mb-5 w-fit rounded-full bg-[#2f1d13] px-3 py-1 text-[0.75rem] font-semibold tracking-[0.12em] text-white md:mx-0"
        >
          NOVA COLECAO
        </span>
        <h1 class="m-0 mx-auto max-w-[14ch] font-['Sora'] text-[clamp(1.8rem,4vw,3.3rem)] leading-[1.1] md:mx-0 md:max-w-[14ch]">
          Roupa certa, no clique certo.
        </h1>
        <p class="mx-auto mt-4 max-w-[44ch] text-[1.05rem] leading-7 text-[#5e4a3f] md:mx-0">
          Entre na sua conta para acompanhar pedidos, salvar favoritos e acelerar seu checkout.
        </p>
      </section>

      <section
        class="mx-auto my-auto w-[92%] rounded-[1.25rem] border border-[#f0dbca] bg-white/90 p-6 shadow-[0_15px_40px_rgba(72,34,8,0.12)] backdrop-blur-[2px] md:w-full md:p-8"
      >
        <header class="mb-6">
          <h2 class="m-0 font-['Sora'] text-2xl text-[#21140c]">{{ title }}</h2>
          <p class="mt-2 text-[#6a5345]">{{ subtitle }}</p>
        </header>
        <slot />
      </section>
    </div>
  </main>
</template>
