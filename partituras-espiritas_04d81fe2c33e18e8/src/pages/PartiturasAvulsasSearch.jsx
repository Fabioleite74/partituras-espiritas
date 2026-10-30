import * as React from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { HeartIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavoritos } from "@/hooks/useFavoritos.js";
import { OperationType, db, handleFirestoreError } from "@/lib/firebase";

export function PartiturasAvulsasSearch() {
  const a = useNavigate();
  const [l, setL] = React.useState([]);
  const [f, setF] = React.useState([]);
  const [i, setI] = React.useState("");
  const [n, setN] = React.useState(true);
  const { isFavorited, toggleFavorite } = useFavoritos();
  React.useEffect(() => {
    const u = onSnapshot(
      collection(db, "partituras_avulsas"),
      (y) => {
        const N = y.docs
          .map((p) => ({
            id: p.id,
            ...p.data(),
          }))
          .filter((p) => p.ativo !== false);
        N.sort((p, r) => {
          return p.titulo?.localeCompare(r.titulo, "pt-BR") ?? 0;
        });
        setL(N);
        setF(N);
        setN(false);
      },
      (y) => {
        handleFirestoreError(y, OperationType.LIST, "partituras_avulsas");
        setN(false);
      },
    );
    return () => u();
  }, []);
  React.useEffect(() => {
    const u = i.toLowerCase();
    const y = l.filter((N) => {
      return (
        N.titulo?.toLowerCase().includes(u) ||
        N.autor?.toLowerCase().includes(u) ||
        (N.categoria && N.categoria.toLowerCase().includes(u)) ||
        (N.palavras_chave && N.palavras_chave.toLowerCase().includes(u))
      );
    });
    setF(y);
  }, [i, l]);
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full animate-in fade-in duration-500 pb-12">
      <h2 className="font-title text-2xl md:text-4xl text-center mb-4 mt-4 leading-snug">
        Partituras Avulsas
      </h2>
      <p className="text-white/70 text-center mb-8 max-w-2xl mx-auto">
        Busque por título, autor, categoria ou palavra-chave entre as partituras
        avulsas do acervo.
      </p>
      <div className="relative max-w-2xl mx-auto w-full mb-10 group">
        <SearchIcon
          className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-palette-yellow transition-colors"
          size={22}
        />
        <input
          type="text"
          placeholder="Buscar por obra, autor, categoria ou palavra-chave..."
          value={i}
          onChange={(u) => setI(u.target.value)}
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-palette-yellow focus:bg-white/20 transition-all text-lg"
        />
      </div>
      {n ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palette-yellow" />
        </div>
      ) : f.length === 0 ? (
        <div className="text-center py-20 text-white/50">
          <p className="text-xl">Nenhuma partitura avulsa encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {f.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 hover:bg-white/10 transition-colors"
            >
              <button
                type="button"
                onClick={() => a(`/partitura/${u.id}`)}
                className="font-bold text-lg text-left text-palette-yellow hover:underline"
              >
                {u.titulo}
              </button>
              <span className="text-white/60">
                {"— "}
                {u.autor}
              </span>
              <div className="ml-auto flex items-center gap-3">
                {u.categoria && (
                  <span className="text-xs font-bold uppercase tracking-wide bg-palette-yellow/15 text-palette-yellow px-3 py-1 rounded-full">
                    {u.categoria}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() =>
                    toggleFavorite({
                      id: u.id,
                      tipo: "partitura",
                      titulo: u.titulo,
                      autor: u.autor,
                    })
                  }
                  className={`p-2 rounded-full transition-colors ${isFavorited(u.id) ? "bg-palette-yellow text-primary" : "bg-white/10 text-white hover:bg-white/20"}`}
                  aria-label={
                    isFavorited(u.id)
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                >
                  <HeartIcon
                    size={16}
                    fill={isFavorited(u.id) ? "currentColor" : "none"}
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
