import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export function useFavoritos() {
  const [a, setA] = React.useState(auth.currentUser?.uid ?? null);
  const [o, setO] = React.useState([]);
  const [t, setT] = React.useState(true);
  React.useEffect(
    () => onAuthStateChanged(auth, (c) => setA(c?.uid ?? null)),
    [],
  );
  React.useEffect(() => {
    if (!a) {
      return;
    }
    const c = doc(db, "favoritos", a);
    return onSnapshot(
      c,
      (u) => {
        setO(u.exists() ? u.data().itens || [] : []);
        setT(false);
      },
      () => setT(false),
    );
  }, [a]);
  const m = React.useCallback((c) => o.some((d) => d.id === c), [o]);
  const n = React.useCallback(
    async (c) => {
      if (!a) {
        return;
      }
      const u = o.some((y) => y.id === c.id)
        ? o.filter((y) => y.id !== c.id)
        : [
            ...o,
            {
              ...c,
              addedAt: Date.now(),
            },
          ];
      setO(u);
      try {
        await setDoc(
          doc(db, "favoritos", a),
          {
            itens: u,
            updatedAt: serverTimestamp(),
          },
          {
            merge: true,
          },
        );
      } catch (y) {
        setO(o);
        throw y;
      }
    },
    [a, o],
  );
  return {
    itens: o,
    loading: t,
    isFavorited: m,
    toggleFavorite: n,
  };
}
