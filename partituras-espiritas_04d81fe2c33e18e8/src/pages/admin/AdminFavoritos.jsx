import * as React from "react";
import { collection, getDocs } from "firebase/firestore";
import { HeartIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";

export function AdminFavoritos() {
  const [s, b] = React.useState([]);
  const [z, C] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      try {
        const o = await getDocs(collection(db, "favoritos"));
        b(
          o.docs.map((w) => ({
            id: w.id,
            itens: w.data().itens || [],
          })),
        );
      } catch {
        toast.error("Erro ao buscar favoritos.");
      } finally {
        C(false);
      }
    })();
  }, []);
  if (z) {
    return (
      <div className="flex justify-center py-12">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    );
  }
  const n = s.filter((t) => t.itens.length > 0).length;
  const v = new Map();
  s.forEach((t) =>
    t.itens.forEach((o) => {
      const w = `${o.tipo}_${o.id}`;
      const k = v.get(w) || {
        titulo: o.titulo,
        autor: o.autor,
        tipo: o.tipo,
        count: 0,
      };
      k.count++;
      v.set(w, k);
    }),
  );
  const p = [...v.values()].sort((t, o) => o.count - t.count);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Favoritos</h1>
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 w-fit">
        <p className="text-sm text-neutral-400">Visitantes com favoritos</p>
        <p className="text-3xl font-bold text-palette-yellow">{n}</p>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-3">Mais favoritados</h2>
        <div className="grid grid-cols-1 gap-3">
          {p.map((t, o) => (
            <div
              key={o}
              className="p-4 rounded-xl border bg-neutral-800 border-neutral-700 flex items-center justify-between"
            >
              <div>
                <span className="text-neutral-500 mr-2">#{o + 1}</span>
                <span className="font-bold">{t.titulo}</span>
                <span className="text-neutral-400 text-sm ml-2">
                  {"— "}
                  {t.autor}
                  {" ("}
                  {t.tipo})
                </span>
              </div>
              <span className="text-palette-yellow font-bold flex items-center gap-1">
                <HeartIcon size={16} fill="currentColor" /> {t.count}
              </span>
            </div>
          ))}
          {p.length === 0 && (
            <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 text-neutral-500">
              Nenhum favorito registrado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
