import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
 
const firebaseConfig = {
  apiKey: "AIzaSyBcetjJR5NbqmkmGf-K6mNfhJeDt1LecKw",
  authDomain: "mcreation-d787f.firebaseapp.com",
  projectId: "mcreation-d787f",
  storageBucket: "mcreation-d787f.firebasestorage.app",
  messagingSenderId: "280933689876",
  appId: "1:280933689876:web:fe14303cb83187d1c01501",
  measurementId: "G-7X8DX6X7P4"
};
 
export const firebaseApp = initializeApp(firebaseConfig);
 
/** Analytics is browser-only; initialized asynchronously from main.tsx */
export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getAnalytics(firebaseApp);
}