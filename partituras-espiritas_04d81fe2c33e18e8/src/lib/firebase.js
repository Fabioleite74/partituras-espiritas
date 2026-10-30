import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  linkWithRedirect,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5oaIlHWawftu0yn0EqoSzBOQ3EAKSasc",
  authDomain: "partiturasespiritas.com.br",
  projectId: "partituras-espiritas",
  storageBucket: "partituras-espiritas.firebasestorage.app",
  messagingSenderId: "765941398699",
  appId: "1:765941398699:web:9276f207bda12a181f4bee",
  measurementId: "G-FQJQN1EQXE",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const functions = getFunctions(app);

export const ADMIN_EMAILS = [
  "leite.alves@gmail.com",
  "sardinha.ricardo@gmail.com",
];

// Conta de teste para links de preview (Firebase Hosting channels) e localhost.
// As regras do Firestore só dão escrita a ADMIN_EMAILS, então ela é somente leitura;
// fora do preview ela é desconectada.
export const PREVIEW_TEST_EMAIL = "teste.preview@partiturasespiritas.com.br";

const isPreviewHost = () =>
  window.location.hostname === "localhost" ||
  window.location.hostname.includes("--");

const isBlockedTestUser = (user) =>
  user?.email === PREVIEW_TEST_EMAIL && !isPreviewHost();

onAuthStateChanged(auth, (u) => {
  if (isBlockedTestUser(u)) {
    signOut(auth);
    return;
  }
  if (!u) {
    signInAnonymously(auth).catch((t) => {
      console.error("Erro ao autenticar anonimamente:", t);
    });
  }
});

let analytics = null;

isSupported()
  .then((u) => {
    if (u) {
      analytics = getAnalytics(app);
    }
  })
  .catch(() => {});

export const trackPageView = (u) => {
  if (analytics) {
    logEvent(analytics, "page_view", {
      page_path: u,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
};

export const registrarDownload = (u, t, e, s, i) => {
  httpsCallable(
    functions,
    "registrarDownload",
  )({
    itemId: u,
    tipo: t,
    formato: e,
    titulo: s,
    autor: i,
  }).catch(() => {});
};

export function sortByOrdem(u) {
  return [...u].sort((t, e) => {
    if (t.ordem != null && e.ordem != null) {
      return t.ordem - e.ordem;
    }
    if (t.ordem != null) {
      return -1;
    }
    if (e.ordem != null) {
      return 1;
    }
    const s = t.createdAt?.toMillis?.() ?? t.createdAt?.seconds ?? 0;
    return (e.createdAt?.toMillis?.() ?? e.createdAt?.seconds ?? 0) - s;
  });
}

export const signInWithGoogle = async () => {
  const u = new GoogleAuthProvider();
  if (auth.currentUser?.isAnonymous) {
    await linkWithRedirect(auth.currentUser, u);
  } else {
    await signInWithRedirect(auth, u);
  }
};

const mergeAnonymousFavorites = async (u, t) => {
  let e = [];
  try {
    const o = await getDoc(doc(db, "favoritos", u));
    e = o.exists() ? o.data().itens || [] : [];
  } catch {}
  await signInWithCredential(auth, t);
  if (e.length === 0) {
    return;
  }
  const s = auth.currentUser.uid;
  const i = doc(db, "favoritos", s);
  let r = [];
  try {
    const o = await getDoc(i);
    r = o.exists() ? o.data().itens || [] : [];
  } catch {}
  const a = [...r];
  for (const o of e) {
    if (!a.some((l) => l.id === o.id)) {
      a.push(o);
    }
  }
  if (a.length !== r.length) {
    await setDoc(
      i,
      {
        itens: a,
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      },
    );
  }
};

let redirectResultPromise = null;

const getRedirectResultOnce = () => {
  if (!redirectResultPromise) {
    redirectResultPromise = getRedirectResult(auth);
  }
  return redirectResultPromise;
};

export const completeGoogleRedirect = async () => {
  try {
    const t = await getRedirectResultOnce();
    return !!t?.user;
  } catch (t) {
    if (t?.code === "auth/credential-already-in-use") {
      const e = auth.currentUser?.uid;
      const s = GoogleAuthProvider.credentialFromError(t);
      if (e && s) {
        await mergeAnonymousFavorites(e, s);
        return true;
      }
    }
    throw t;
  }
};

export const signInWithEmail = async (u, t) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, u, t);
    if (isBlockedTestUser(user)) {
      await signOut(auth);
      throw new Error("Conta de teste disponível apenas no link de preview.");
    }
  } catch (e) {
    console.error("Error signing in with email", e);
    throw e;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (u) {
    console.error("Error signing out", u);
  }
};

export const OperationType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LIST: "list",
  GET: "get",
  WRITE: "write",
};

export function handleFirestoreError(u, t, e) {
  const s = {
    error: u instanceof Error ? u.message : String(u),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((c) => ({
          providerId: c.providerId,
          displayName: c.displayName,
          email: c.email,
          photoUrl: c.photoURL,
        })) || [],
    },
    operationType: t,
    path: e,
  };
  console.error("Firestore Error: ", JSON.stringify(s));
  throw new Error(JSON.stringify(s));
}
