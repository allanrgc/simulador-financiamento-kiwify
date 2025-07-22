<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
      <h3 class="text-xl font-semibold mb-4">Assinatura Digital da Proposta</h3>
      <p class="text-sm text-slate-600 mb-4">Por favor, assine no campo abaixo para confirmar sua proposta.</p>
      <div class="w-full aspect-video bg-slate-100 rounded-lg">
        <canvas ref="signaturePadCanvas" class="border-2 dashed border-slate-300 rounded-lg w-full h-full"></canvas>
      </div>
      <div class="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
        <button @click="clearSignature" class="py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">Limpar</button>
        <button @click="saveAndDownloadPDF" :disabled="isSaving" class="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
          <span v-if="isSaving">Salvando...</span>
          <span v-else>Salvar e Baixar PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
// As bibliotecas são importadas dinamicamente para garantir que rodem apenas no cliente
import { useCurrency } from '~/composables/useCurrency';

const props = defineProps({
  simulationResult: { type: Object, required: true }
});
const emit = defineEmits(['close', 'success']);

const { formatBRL } = useCurrency();
const signaturePadCanvas = ref(null);
const signaturePad = ref(null);
const isSaving = ref(false);

onMounted(async () => {
  // Importa a biblioteca SignaturePad dinamicamente
  const SignaturePad = (await import('signature_pad')).default;

  await nextTick();
  const canvas = signaturePadCanvas.value;
  if (canvas) {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    signaturePad.value = new SignaturePad(canvas);
  }
});

const clearSignature = () => {
  if (signaturePad.value) {
    signaturePad.value.clear();
  }
};

const saveAndDownloadPDF = async () => {
  if (!signaturePad.value || signaturePad.value.isEmpty()) {
    alert("Por favor, forneça sua assinatura.");
    return;
  }
  
  isSaving.value = true;
  
  // Importa a biblioteca jsPDF dinamicamente
  const { jsPDF } = await import('jspdf');

  const signatureImage = signaturePad.value.toDataURL('image/png');
  const submissionData = {
    ...props.simulationResult,
    signature: signatureImage,
  };

  try {
    // 1. Salva no banco de dados via API do Nuxt
    await $fetch('/api/submissions', {
      method: 'POST',
      body: submissionData
    });

    // 2. Gera o PDF
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Proposta de Financiamento Imobiliário", 20, 20);
    doc.setFontSize(12);
    doc.text(`Data da Proposta: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
    doc.line(20, 35, 190, 35);
    doc.setFontSize(14);
    doc.text("Detalhes da Simulação:", 20, 45);
    doc.setFontSize(12);
    doc.text(`Valor do Imóvel: ${formatBRL(props.simulationResult.propertyValue)}`, 20, 55);
    doc.text(`Valor da Entrada: ${formatBRL(props.simulationResult.downPayment)}`, 20, 62);
    doc.text(`Valor Financiado: ${formatBRL(props.simulationResult.loanAmount)}`, 20, 69);
    doc.text(`Prazo: ${props.simulationResult.term} meses`, 20, 76);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Parcela Mensal: ${formatBRL(props.simulationResult.monthlyPayment)}`, 20, 86);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text("Assinatura do Proponente:", 20, 110);
    doc.addImage(signatureImage, 'PNG', 20, 115, 100, 50);
    doc.line(20, 170, 120, 170);
    doc.text("Assinatura Digital", 22, 175);
    doc.save(`proposta-financiamento-${Date.now()}.pdf`);

    emit('success');
  } catch (error) {
    console.error("Erro ao salvar ou gerar PDF: ", error);
    alert("Ocorreu um erro. Verifique o console para mais detalhes.");
  } finally {
    isSaving.value = false;
  }
};
</script>