import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;
let dbInstance: ReturnType<typeof getFirestore> | null = null;

try {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountString) {
    throw new Error('A variável de ambiente FIREBASE_SERVICE_ACCOUNT_JSON não está definida.');
  }
  
  const serviceAccount = JSON.parse(serviceAccountString);

  if (!getApps().length) {
    app = initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin SDK inicializado com sucesso.');
  } else {
    app = getApps()[0];
  }
  dbInstance = getFirestore(app);

} catch (e: any) {
  console.error('CRÍTICO: Falha ao inicializar o Firebase Admin SDK. As rotas da API não funcionarão.');
  console.error('Por favor, verifique seu arquivo .env e garanta que FIREBASE_SERVICE_ACCOUNT_JSON é uma string JSON válida.');
  console.error('Detalhes do erro:', e.message);
}

export const db = dbInstance;