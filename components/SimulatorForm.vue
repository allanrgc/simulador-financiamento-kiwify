<template>
  <form @submit.prevent="runSimulation">
    <div class="space-y-6">
      <div>
        <label for="propertyValue" class="block text-sm font-medium text-slate-700">Valor do Imóvel</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span class="text-gray-500 sm:text-sm">R$</span>
          </div>
          <input 
            type="text" 
            :value="form.propertyValue"
            @input="updateCurrencyField('propertyValue', $event)" 
            id="propertyValue" 
            class="block w-full rounded-md border-slate-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
            placeholder="300.000,00"
          >
        </div>
      </div>

      <div>
        <label for="downPayment" class="block text-sm font-medium text-slate-700">Valor da Entrada</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span class="text-gray-500 sm:text-sm">R$</span>
          </div>
          <input 
            type="text" 
            :value="form.downPayment"
            @input="updateCurrencyField('downPayment', $event)" 
            id="downPayment" 
            class="block w-full rounded-md border-slate-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
            placeholder="60.000,00"
          >
        </div>
        <p v-if="downPaymentError" class="mt-2 text-sm text-red-600">{{ downPaymentError }}</p>
      </div>
      
      <div>
        <label for="term" class="block text-sm font-medium text-slate-700">Prazo (em meses)</label>
        <input 
          type="number" 
          v-model.number="form.term" 
          id="term" 
          class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
          placeholder="360"
          max="420"
        >
      </div>
    </div>
    <div class="mt-8">
      <button type="submit" :disabled="!isFormValid" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all">
        Simular Financiamento
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCurrency } from '~/composables/useCurrency';
import { useSimulation } from '~/composables/useSimulation';

const emit = defineEmits(['simulate']);

const { formatInputAsCurrency, parseCurrency, formatBRL } = useCurrency();
const { calculateFinancing } = useSimulation();

const form = ref({
  propertyValue: '',
  downPayment: '',
  term: 360,
});

const downPaymentError = ref('');

const updateCurrencyField = (fieldName, event) => {
  form.value[fieldName] = formatInputAsCurrency(event.target.value);
};

const propertyValueNum = computed(() => parseCurrency(form.value.propertyValue));
const downPaymentNum = computed(() => parseCurrency(form.value.downPayment));

watch([propertyValueNum, downPaymentNum], () => {
  if (propertyValueNum.value > 0 && downPaymentNum.value > 0) {
    const minDownPayment = propertyValueNum.value * 0.20;
    if (downPaymentNum.value < minDownPayment) {
      downPaymentError.value = `A entrada mínima é de 20% (${formatBRL(minDownPayment)}).`;
    } else {
      downPaymentError.value = '';
    }
  } else {
    downPaymentError.value = '';
  }
});

// Watcher para limitar o valor do prazo
watch(() => form.value.term, (newValue) => {
  if (newValue > 420) {
    form.value.term = 420;
  }
  if (newValue && String(newValue).length > 3) {
    form.value.term = parseInt(String(newValue).slice(0, 3), 10);
  }
});

const isFormValid = computed(() => {
  return propertyValueNum.value > 0 &&
         downPaymentNum.value > 0 &&
         form.value.term > 0 &&
         form.value.term <= 420 &&
         !downPaymentError.value;
});

const runSimulation = () => {
  if (!isFormValid.value) return;
  
  const result = calculateFinancing(
    propertyValueNum.value,
    downPaymentNum.value,
    form.value.term
  );

  if (result) {
    emit('simulate', result);
  }
};
</script>