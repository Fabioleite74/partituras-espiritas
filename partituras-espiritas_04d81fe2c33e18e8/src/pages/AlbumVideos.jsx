import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { VideoIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { OperationType, db, handleFirestoreError } from "@/lib/firebase";
import { getYouTubeId } from "@/lib/media.js";

export function AlbumVideos({ collectionName = "obras_musicais" }) {
  const { id } = useParams();
  const [o, setO] = React.useState(null);
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (!id) {
      return;
    }
    const c = onSnapshot(
      doc(db, collectionName, id),
      (d) => {
        if (d.exists()) {
          setO({
            id: d.id,
            ...d.data(),
          });
        }
      },
      (d) => {
        handleFirestoreError(d, OperationType.GET, `${collectionName}/${id}`);
      },
    );
    return () => c();
  }, [id, collectionName]);
  if (!o) {
    return <div className="p-8 text-center">Carregando...</div>;
  }
  const m = o.videos_autor || [];
  const m_t = m[t];
  const x = getYouTubeId(m_t?.url);
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-10rem)] max-w-6xl mx-auto w-full animate-in fade-in duration-500">
      <h2 className="font-title text-2xl md:text-4xl text-center mb-6 shrink-0">
        {"Vídeos — "}
        {o.titulo}
      </h2>
      {m.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-white/70">
          Nenhum vídeo cadastrado para este autor.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
          <div className="w-full md:flex-1 aspect-video md:aspect-auto bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
            {x ? (
              <iframe
                key={x}
                src={`https://www.youtube.com/embed/${x}`}
                title={m_t.titulo || o.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                URL de vídeo inválida
              </div>
            )}
          </div>
          <div className="w-full md:w-96 flex-1 md:flex-none min-h-0 flex flex-col gap-2 pb-4 overflow-y-auto">
            {m.map((c, d) => {
              const u = getYouTubeId(c.url);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setT(d)}
                  className={`text-left rounded-xl overflow-hidden transition-colors flex items-center gap-3 pr-3 shrink-0 ${d === t ? "bg-palette-yellow text-primary" : "bg-white/5 hover:bg-white/10 text-white"}`}
                >
                  <div className="w-36 aspect-video shrink-0 bg-black/40 relative">
                    {u ? (
                      <img
                        src={`https://img.youtube.com/vi/${u}/mqdefault.jpg`}
                        alt={c.titulo || `Vídeo ${d + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <VideoIcon size={20} />
                      </div>
                    )}
                    <span
                      className={`absolute bottom-1 right-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${d === t ? "bg-primary text-white" : "bg-black/70 text-white"}`}
                    >
                      {d + 1}
                    </span>
                  </div>
                  <span className="flex-1 text-sm font-bold truncate">
                    {c.titulo || `Vídeo ${d + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
