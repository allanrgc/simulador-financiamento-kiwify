<template>
  <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
    <div v-if="!simulationResult">
      <h2 class="text-2xl font-semibold mb-6 text-center">Insira os dados do imóvel</h2>
      <SimulatorForm @simulate="onSimulate" />
    </div>

    <div v-else>
      <SimulationResult 
        :result="simulationResult" 
        @reset="resetSimulation" 
        @accept="openSignatureModal" 
      />
    </div>
  </div>

  <!-- Envolve o modal com <ClientOnly> para evitar renderização no servidor -->
  <ClientOnly>
    <SignatureModal 
      v-if="isSignatureModalOpen"
      :simulationResult="simulationResult"
      @close="isSignatureModalOpen = false"
      @success="handleSignatureSuccess"
    />
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue';
import SimulatorForm from '~/components/SimulatorForm.vue';
import SimulationResult from '~/components/SimulationResult.vue';
import SignatureModal from '~/components/SignatureModal.vue';

const simulationResult = ref(null);
const isSignatureModalOpen = ref(false);

const onSimulate = (result) => {
  simulationResult.value = result;
};

const resetSimulation = () => {
  simulationResult.value = null;
};

const openSignatureModal = () => {
  isSignatureModalOpen.value = true;
};

const handleSignatureSuccess = () => {
  isSignatureModalOpen.value = false;
  resetSimulation();
  alert('Proposta enviada e PDF baixado com sucesso!');
};
</script>