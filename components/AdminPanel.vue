<template>
  <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6 text-center">Painel de Administração</h2>
    <div v-if="pending" class="text-center">
      <p class="text-slate-600">Carregando submissões...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
        <p>Ocorreu um erro ao carregar as submissões: {{ error.message }}</p>
    </div>
    <div v-else-if="!submissions || submissions.length === 0" class="text-center">
      <p class="text-slate-600">Nenhuma submissão encontrada.</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Imóvel</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Entrada</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prazo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parcela</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="sub in submissions" :key="sub.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ new Date(sub.createdAt.seconds * 1000).toLocaleString('pt-BR') }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ formatBRL(sub.propertyValue) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ formatBRL(sub.downPayment) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ sub.term }} meses</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{{ formatBRL(sub.monthlyPayment) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useCurrency } from '~/composables/useCurrency';
const { formatBRL } = useCurrency();

// Busca os dados da nossa API interna do Nuxt
const { data: submissions, pending, error } = await useFetch('/api/submissions', {
  lazy: true, // Carrega os dados de forma não bloqueante
  server: false, // Busca apenas no lado do cliente para este painel
});
</script>