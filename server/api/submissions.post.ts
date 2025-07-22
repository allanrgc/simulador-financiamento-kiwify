import { db } from '../utils/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'O Firebase Admin não foi inicializado. Verifique os logs do servidor.'
    });
  }

  try {
    const body = await readBody(event);
    
    // Prepara os dados para salvar
    const submissionData = {
      propertyValue: body.propertyValue,
      downPayment: body.downPayment,
      loanAmount: body.loanAmount,
      term: body.term,
      monthlyPayment: body.monthlyPayment,
      totalPaid: body.totalPaid,
      totalInterest: body.totalInterest,
      createdAt: Timestamp.now(),
      // A assinatura (imagem em base64) pode ser muito grande para o Firestore.
      // O ideal seria salvar em um Storage (como Firebase Storage) e guardar a URL aqui.
      // Por simplicidade, vamos omiti-la do salvamento no banco.
    };

    const docRef = await db.collection('submissions').add(submissionData);

    return { success: true, id: docRef.id };

  } catch (error) {
    console.error("Firebase Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Falha ao salvar submissão no Firestore',
    });
  }
});