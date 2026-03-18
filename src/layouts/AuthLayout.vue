<script setup>
import { ref, onMounted, computed } from 'vue'
import LightPillar from '@/components/vue-bits/LightPillar.vue'
import MagicRings from '@/components/vue-bits/MagicRings.vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
})

const visible = ref(false)
onMounted(() => {
  requestAnimationFrame(() => { visible.value = true })
})

const titleChars = computed(() => props.title.split(''))
const subtitleChars = computed(() => props.subtitle.split(''))

/* Tilt 3D effect for the glass card */
const cardRef = ref(null)
const tiltX = ref(0)
const tiltY = ref(0)
const cardScale = ref(1)

function handleCardMouse(e) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  tiltX.value = (y / (rect.height / 2)) * -6
  tiltY.value = (x / (rect.width / 2)) * 6
}

function handleCardEnter() {
  cardScale.value = 1.02
}

function handleCardLeave() {
  tiltX.value = 0
  tiltY.value = 0
  cardScale.value = 1
}
</script>

<template>
  <main class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060d1b]">
    <!-- LightPillar background -->
    <div class="absolute inset-0">
      <LightPillar
        topColor="#1e3a5f"
        bottomColor="#2563eb"
        :intensity="0.8"
        :rotationSpeed="0.2"
        :glowAmount="0.003"
        :pillarWidth="4"
        :pillarHeight="0.35"
        :noiseIntensity="0.4"
        :pillarRotation="20"
        mixBlendMode="screen"
      />
    </div>

    <!-- MagicRings decoration (full-screen, no clipping) -->
    <div class="pointer-events-none absolute inset-0 opacity-40">
      <MagicRings
        color="#3b82f6"
        colorTwo="#93c5fd"
        :ringCount="5"
        :speed="0.6"
        :attenuation="12"
        :lineThickness="1.5"
        :baseRadius="0.3"
        :radiusStep="0.08"
        :scaleRate="0.08"
        :opacity="0.7"
        :noiseAmount="0.05"
        :ringGap="1.4"
        :fadeIn="0.8"
        :fadeOut="0.6"
        :followMouse="true"
        :mouseInfluence="0.15"
        :hoverScale="1.1"
        :parallax="0.04"
        :clickBurst="true"
      />
    </div>

    <!-- Content card with slide-up animation -->
    <div
      class="relative z-10 mx-4 w-full max-w-[26rem] transition-all duration-700 ease-out"
      :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
    >
      <!-- Brand header -->
      <div class="mb-6 text-center">
        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
          <i class="pi pi-shop text-2xl text-[#93c5fd]"></i>
        </div>
        <h1 class="m-0 text-xl font-bold tracking-wide text-white">Louis Vittão</h1>
      </div>

      <!-- Glass card with tilt 3D -->
      <section
        ref="cardRef"
        class="tilt-card rounded-2xl border border-white/[0.12] bg-white/[0.07] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8"
        :style="{
          transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${cardScale})`,
        }"
        @mousemove="handleCardMouse"
        @mouseenter="handleCardEnter"
        @mouseleave="handleCardLeave"
      >
        <header class="mb-5">
          <!-- Split Text title -->
          <h2 class="m-0 text-[1.35rem] font-semibold text-white">
            <span
              v-for="(char, i) in titleChars"
              :key="'t' + i"
              class="split-char inline-block"
              :style="{ animationDelay: i * 35 + 'ms' }"
            >{{ char === ' ' ? '\u00A0' : char }}</span>
          </h2>
          <!-- Split Text subtitle -->
          <p class="mt-1.5 text-sm text-white/60">
            <span
              v-for="(char, i) in subtitleChars"
              :key="'s' + i"
              class="split-char inline-block"
              :style="{ animationDelay: (titleChars.length * 35) + (i * 20) + 'ms' }"
            >{{ char === ' ' ? '\u00A0' : char }}</span>
          </p>
        </header>
        <slot />
      </section>
    </div>
  </main>
</template>

<style scoped>
/* Split text animation */
.split-char {
  opacity: 0;
  transform: translateY(8px);
  animation: splitReveal 0.4s ease forwards;
}

@keyframes splitReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tilt 3D card */
.tilt-card {
  transition: transform 0.3s ease;
  will-change: transform;
}

/* Dark transparent inputs for glassmorphism auth pages */
:deep(.p-inputtext),
:deep(.p-password-input) {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
}

:deep(.p-inputtext::placeholder),
:deep(.p-password-input::placeholder) {
  color: rgba(255, 255, 255, 0.35) !important;
}

:deep(.p-inputtext:focus),
:deep(.p-password-input:focus) {
  border-color: rgba(147, 197, 253, 0.5) !important;
  box-shadow: 0 0 0 2px rgba(147, 197, 253, 0.15) !important;
}

:deep(.p-checkbox .p-checkbox-box) {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

:deep(.p-password-overlay) {
  background: #1a2332 !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Button matching navy palette */
:deep(.p-button) {
  background: #2563eb !important;
  border-color: #2563eb !important;
}

:deep(.p-button:hover) {
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

:deep(.p-button:focus) {
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3) !important;
}

/* Divider line and content background */
:deep(.p-divider-content) {
  background: transparent !important;
}

:deep(.p-divider::before) {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Shiny hover effect — only on auth page buttons */
:deep(.p-button) {
  overflow: hidden;
}

:deep(.p-button::after) {
  content: '';
  position: absolute;
  top: -50%;
  left: -75%;
  width: 80%;
  height: 200%;
  background: linear-gradient(
    105deg,
    transparent 35%,
    rgba(255, 255, 255, 0.35) 42%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.35) 58%,
    transparent 65%
  );
  transform: skewX(-20deg);
  pointer-events: none;
}

:deep(.p-button:hover::after) {
  animation: shiny 1s ease forwards;
}

@keyframes shiny {
  from { left: -75%; }
  to { left: 125%; }
}
</style>
