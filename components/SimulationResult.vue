<template>
  <div class="text-center">
    <h2 class="text-2xl font-bold mb-4 text-indigo-600">Proposta de Financiamento</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left p-4 bg-slate-50 rounded-lg">
      <div class="p-4 rounded-lg">
        <p class="text-sm text-slate-500">Valor da Parcela Mensal</p>
        <p class="text-2xl font-bold text-slate-900">{{ formatBRL(result.monthlyPayment) }}</p>
      </div>
      <div class="p-4 rounded-lg">
        <p class="text-sm text-slate-500">Valor Financiado</p>
        <p class="text-xl font-semibold text-slate-800">{{ formatBRL(result.loanAmount) }}</p>
      </div>
      <div class="p-4 rounded-lg">
        <p class="text-sm text-slate-500">Total Pago ao Final</p>
        <p class="text-xl font-semibold text-slate-800">{{ formatBRL(result.totalPaid) }}</p>
      </div>
      <div class="p-4 rounded-lg">
        <p class="text-sm text-slate-500">Total de Juros</p>
        <p class="text-xl font-semibold text-red-600">{{ formatBRL(result.totalInterest) }}</p>
      </div>
    </div>
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <button @click="$emit('reset')" class="w-full sm:w-auto flex justify-center py-3 px-6 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
        Simular Novamente
      </button>
      <button @click="$emit('accept')" class="w-full sm:w-auto flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
        Aceitar e Assinar Proposta
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCurrency } from '~/composables/useCurrency';
const { formatBRL } = useCurrency();

defineProps({
  result: {
    type: Object,
    required: true
  }
});

defineEmits(['reset', 'accept']);
</script>