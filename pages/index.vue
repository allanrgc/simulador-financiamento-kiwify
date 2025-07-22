<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <header class="w-full max-w-4xl mx-auto mb-4 text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900">Simulador de Financiamento</h1>
      <p class="text-slate-600 mt-2">Teste Prático para Kiwify - AI Engineer (Nuxt.js)</p>
      <nav class="mt-4">
        <button @click="currentView = 'simulator'" :class="{'bg-indigo-600 text-white': currentView === 'simulator', 'bg-white text-slate-700': currentView !== 'simulator'}" class="px-4 py-2 rounded-md shadow-sm font-semibold transition-all">Simulador</button>
        <button @click="currentView = 'admin'" :class="{'bg-indigo-600 text-white': currentView === 'admin', 'bg-white text-slate-700': currentView !== 'admin'}" class="ml-2 px-4 py-2 rounded-md shadow-sm font-semibold transition-all">Painel Admin</button>
      </nav>
    </header>

    <main class="w-full">
      <Transition name="fade" mode="out-in">
        <div v-if="currentView === 'simulator'" key="simulator">
          <Simulator />
        </div>
        <div v-else key="admin">
          <AdminPanel />
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Simulator from '~/components/Simulator.vue';
import AdminPanel from '~/components/AdminPanel.vue';

const currentView = ref('simulator');
</script>