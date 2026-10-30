import * as React from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { HeartIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavoritos } from "@/hooks/useFavoritos.js";
import { OperationType, db, handleFirestoreError } from "@/lib/firebase";

export function TagCategoryBrowse({ tag, titulo, descricao }) {
  const f = useNavigate();
  const [t, setT] = React.useState([]);
  const [m, setM] = React.useState([]);
  const [x, setX] = React.useState("");
  const [d, setD] = React.useState(true);
  const { isFavorited, toggleFavorite } = useFavoritos();
  const p = tag.toLowerCase();
  React.useEffect(() => {
    setD(true);
    let r = [];
    let b = [];
    const v = () => {
      setT([...r, ...b]);
      setD(false);
    };
    const C = onSnapshot(
      collection(db, "obras_musicais"),
      (A) => {
        r = A.docs
          .map((j) => ({
            id: j.id,
            ...j.data(),
          }))
          .filter(
            (j) =>
              j.ativo !== false && j.tags && j.tags.toLowerCase().includes(p),
          )
          .map((j) => ({
            id: j.id,
            tipo: "obra",
            titulo: j.titulo,
            autor: j.autor,
            url_foto_capa: j.url_foto_capa,
          }));
        v();
      },
      (A) => {
        handleFirestoreError(A, OperationType.LIST, "obras_musicais");
        setD(false);
      },
    );
    const P = onSnapshot(
      collection(db, "partituras_avulsas"),
      (A) => {
        b = A.docs
          .map((j) => ({
            id: j.id,
            ...j.data(),
          }))
          .filter(
            (j) =>
              j.ativo !== false &&
              j.categoria &&
              j.categoria.toLowerCase().includes(p),
          )
          .map((j) => ({
            id: j.id,
            tipo: "partitura",
            titulo: j.titulo,
            autor: j.autor,
            categoria: j.categoria,
          }));
        v();
      },
      (A) => {
        handleFirestoreError(A, OperationType.LIST, "partituras_avulsas");
        setD(false);
      },
    );
    return () => {
      C();
      P();
    };
  }, [p]);
  React.useEffect(() => {
    const r = x.toLowerCase();
    const b = t.filter((v) => {
      return (
        v.titulo?.toLowerCase().includes(r) ||
        v.autor?.toLowerCase().includes(r) ||
        (v.categoria && v.categoria.toLowerCase().includes(r))
      );
    });
    b.sort((v, C) => v.titulo.localeCompare(C.titulo, "pt-BR"));
    setM(b);
  }, [x, t]);
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full animate-in fade-in duration-500 pb-12">
      <h2 className="font-title text-2xl md:text-4xl text-center mb-4 mt-4 leading-snug">
        {titulo}
      </h2>
      <p className="text-white/70 text-center mb-8 max-w-2xl mx-auto">
        {descricao}
      </p>
      <div className="relative max-w-2xl mx-auto w-full mb-10 group">
        <SearchIcon
          className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-palette-yellow transition-colors"
          size={22}
        />
        <input
          type="text"
          placeholder="Buscar por título ou autor..."
          value={x}
          onChange={(r) => setX(r.target.value)}
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-palette-yellow focus:bg-white/20 transition-all text-lg"
        />
      </div>
      {d ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palette-yellow" />
        </div>
      ) : m.length === 0 ? (
        <div className="text-center py-20 text-white/50">
          <p className="text-xl">Nenhuma partitura encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {m.map((r) => (
            <div
              key={`${r.tipo}_${r.id}`}
              className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 hover:bg-white/10 transition-colors"
            >
              <button
                type="button"
                onClick={() =>
                  f(
                    `/${r.tipo === "partitura" ? "partitura" : "album"}/${r.id}`,
                  )
                }
                className="font-bold text-lg text-left text-palette-yellow hover:underline"
              >
                {r.titulo}
              </button>
              <span className="text-white/60">
                {"— "}
                {r.autor}
              </span>
              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    toggleFavorite({
                      id: r.id,
                      tipo: r.tipo,
                      titulo: r.titulo,
                      autor: r.autor,
                      url_foto_capa: r.url_foto_capa,
                    })
                  }
                  className={`p-2 rounded-full transition-colors ${isFavorited(r.id) ? "bg-palette-yellow text-primary" : "bg-white/10 text-white hover:bg-white/20"}`}
                  aria-label={
                    isFavorited(r.id)
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                >
                  <HeartIcon
                    size={16}
                    fill={isFavorited(r.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
