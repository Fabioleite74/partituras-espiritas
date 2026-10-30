import * as React from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { CirclePlayIcon, GraduationCapIcon } from "lucide-react";
import {
  OperationType,
  db,
  handleFirestoreError,
  sortByOrdem,
} from "@/lib/firebase";
import { getDirectImageUrl } from "@/lib/media.js";

export function Tutoriais() {
  const [a, setA] = React.useState([]);
  const [o, setO] = React.useState(true);
  React.useEffect(() => {
    const t = onSnapshot(
      collection(db, "tutoriais"),
      (i) => {
        const m = sortByOrdem(
          i.docs
            .map((n) => ({
              id: n.id,
              ...n.data(),
            }))
            .filter((n) => n.ativo),
        );
        setA(m);
        setO(false);
      },
      (i) => {
        handleFirestoreError(i, OperationType.LIST, "tutoriais");
        setO(false);
      },
    );
    return () => t();
  }, []);
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <h2 className="font-title text-2xl md:text-4xl text-center mb-2 mt-4 leading-snug">
        Tutoriais
      </h2>
      <p className="text-white/70 text-center mb-8 md:mb-12 max-w-2xl mx-auto">
        Aprenda com nossas videoaulas. Escolha um curso abaixo para assistir à
        playlist completa em uma nova aba.
      </p>
      {o ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palette-yellow" />
        </div>
      ) : a.length === 0 ? (
        <div className="text-center text-white/70 mt-10">
          Nenhum tutorial disponível no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-6">
          {a.map((t) => (
            <a
              key={t.id}
              href={`/tutoriais/${t.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-palette-yellow transition-colors"
            >
              <div className="relative aspect-video overflow-hidden bg-black/40">
                {t.url_capa ? (
                  <img
                    src={getDirectImageUrl(t.url_capa)}
                    alt={t.titulo}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <GraduationCapIcon size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <CirclePlayIcon
                    size={56}
                    className="text-white drop-shadow-lg"
                  />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg group-hover:text-palette-yellow transition-colors line-clamp-2">
                  {t.titulo}
                </h3>
                {t.descricao && (
                  <p className="text-sm text-white/70 mt-1 line-clamp-2">
                    {t.descricao}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
