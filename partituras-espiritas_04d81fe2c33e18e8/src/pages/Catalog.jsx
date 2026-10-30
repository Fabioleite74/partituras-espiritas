import * as React from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { HeartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavoritos } from "@/hooks/useFavoritos.js";
import {
  OperationType,
  db,
  handleFirestoreError,
  sortByOrdem,
} from "@/lib/firebase";
import { getDirectImageUrl } from "@/lib/media.js";

export function Catalog() {
  const a = useNavigate();
  const [l, setL] = React.useState([]);
  const [f, setF] = React.useState(true);
  const { isFavorited, toggleFavorite } = useFavoritos();
  React.useEffect(() => {
    const n = onSnapshot(
      collection(db, "obras_musicais"),
      (x) => {
        const c = sortByOrdem(
          x.docs
            .map((d) => ({
              id: d.id,
              ...d.data(),
            }))
            .filter((d) => d.ativo !== false),
        );
        setL(c);
        setF(false);
      },
      (x) => {
        handleFirestoreError(x, OperationType.LIST, "obras_musicais");
        setF(false);
      },
    );
    return () => n();
  }, []);
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <h2 className="font-title text-2xl md:text-4xl text-center mb-8 md:mb-12 mt-4 leading-snug">
        Acervo Completo de Partituras
      </h2>
      {f ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palette-yellow" />
        </div>
      ) : l.length === 0 ? (
        <div className="text-center text-white/70 mt-10">
          Nenhuma obra encontrada no acervo.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 pb-6">
          {l.map((n) => (
            <div
              key={n.id}
              onClick={() => a(`/album/${n.id}`)}
              className="cursor-pointer group flex flex-col"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg mb-3 border-2 border-transparent group-hover:border-palette-yellow transition-colors">
                <img
                  src={getDirectImageUrl(n.url_foto_capa)}
                  alt={n.titulo}
                  className="w-full aspect-[3/4] object-cover transform group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={(x) => {
                    x.stopPropagation();
                    toggleFavorite({
                      id: n.id,
                      tipo: "obra",
                      titulo: n.titulo,
                      autor: n.autor,
                      url_foto_capa: n.url_foto_capa,
                    });
                  }}
                  className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-sm transition-colors ${isFavorited(n.id) ? "bg-palette-yellow text-primary" : "bg-black/40 text-white hover:bg-black/60"}`}
                  aria-label={
                    isFavorited(n.id)
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                >
                  <HeartIcon
                    size={16}
                    fill={isFavorited(n.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
              <h3 className="font-bold text-center text-sm md:text-base group-hover:text-palette-yellow transition-colors line-clamp-1">
                {n.titulo}
              </h3>
              <p className="text-xs md:text-sm text-center text-white/70 line-clamp-1">
                {n.autor}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
