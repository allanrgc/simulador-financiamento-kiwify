import { db } from '../utils/firebase';

export default defineEventHandler(async (event) => {
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'O Firebase Admin não foi inicializado. Verifique os logs do servidor.'
    });
  }

  try {
    const submissionsRef = db.collection('submissions');
    const snapshot = await submissionsRef.orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      return [];
    }

    const submissions: any[] = [];
    snapshot.forEach(doc => {
      submissions.push({ id: doc.id, ...doc.data() });
    });

    return submissions;
  } catch (error) {
    console.error("Firebase Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Falha ao buscar submissões no Firestore',
    });
  }
});