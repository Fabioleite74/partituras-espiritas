import { HeartIcon, MusicIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavoritos } from "@/hooks/useFavoritos.js";
import { getDirectImageUrl } from "@/lib/media.js";

export function Favoritos() {
  const a = useNavigate();
  const { itens, loading, isFavorited, toggleFavorite } = useFavoritos();
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <h2 className="font-title text-2xl md:text-4xl text-center mb-8 md:mb-12 mt-4 leading-snug">
        Meus Favoritos
      </h2>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palette-yellow" />
        </div>
      ) : itens.length === 0 ? (
        <div className="text-center py-20 text-white/50">
          <HeartIcon size={40} className="mx-auto mb-4 text-white/30" />
          <p className="text-xl">
            Você ainda não favoritou nenhum álbum ou partitura.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 pb-6">
          {itens.map((i) => (
            <div
              key={`${i.tipo}_${i.id}`}
              onClick={() =>
                a(`/${i.tipo === "partitura" ? "partitura" : "album"}/${i.id}`)
              }
              className="cursor-pointer group flex flex-col"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg mb-3 border-2 border-transparent group-hover:border-palette-yellow transition-colors aspect-[3/4] bg-primary/40 flex items-center justify-center">
                {i.url_foto_capa ? (
                  <img
                    src={getDirectImageUrl(i.url_foto_capa)}
                    alt={i.titulo}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <MusicIcon size={40} className="text-white/40" />
                )}
                <button
                  type="button"
                  onClick={(m) => {
                    m.stopPropagation();
                    toggleFavorite(i);
                  }}
                  className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-sm transition-colors ${isFavorited(i.id) ? "bg-palette-yellow text-primary" : "bg-black/40 text-white hover:bg-black/60"}`}
                  aria-label="Remover dos favoritos"
                >
                  <HeartIcon
                    size={16}
                    fill={isFavorited(i.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
              <h3 className="font-bold text-center text-sm md:text-base group-hover:text-palette-yellow transition-colors line-clamp-1">
                {i.titulo}
              </h3>
              <p className="text-xs md:text-sm text-center text-white/70 line-clamp-1">
                {i.autor}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
