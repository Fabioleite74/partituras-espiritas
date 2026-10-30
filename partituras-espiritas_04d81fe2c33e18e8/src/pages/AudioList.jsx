import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {
  MusicIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { OperationType, db, handleFirestoreError } from "@/lib/firebase";
import { getDirectAudioUrl, getDirectImageUrl } from "@/lib/media.js";

export function AudioList({ collectionName = "obras_musicais" }) {
  const { id } = useParams();
  const [o, setO] = React.useState(null);
  const [t, setT] = React.useState(0);
  const [m, setM] = React.useState(false);
  const [x, setX] = React.useState(0);
  const [d, setD] = React.useState(0);
  const [y, setY] = React.useState(false);
  const PRef = React.useRef(null);
  React.useEffect(() => {
    if (!id) {
      return;
    }
    const w = onSnapshot(
      doc(db, collectionName, id),
      (k) => {
        if (k.exists()) {
          setO({
            id: k.id,
            ...k.data(),
          });
        }
      },
      (k) => {
        handleFirestoreError(k, OperationType.GET, `${collectionName}/${id}`);
      },
    );
    return () => w();
  }, [id, collectionName]);
  const r = o?.audios || [];
  const r_t = r[t];
  React.useEffect(() => {
    if (PRef.current && r_t) {
      setY(false);
      setX(0);
      setD(0);
      PRef.current.src = getDirectAudioUrl(r_t.url);
      m &&
        PRef.current
          .play()
          .catch((w) => console.error("Error playing audio", w));
    }
  }, [t, r_t?.url]);
  const v = (w) => {
    if (r[w]) {
      setT(w);
      setM(true);
    }
  };
  const C = () => {
    if (PRef.current) {
      if (m) {
        PRef.current.pause();
        setM(false);
      } else {
        PRef.current
          .play()
          .catch((w) => console.error("Error playing audio", w));
        setM(true);
      }
    }
  };
  const P = () => {
    if (PRef.current) {
      setX(PRef.current.currentTime);
    }
  };
  const A = () => {
    if (PRef.current) {
      setD(PRef.current.duration);
    }
  };
  const j = (w) => {
    if (PRef.current && d) {
      const k = w.currentTarget.getBoundingClientRect();
      const W = ((w.clientX - k.left) / k.width) * d;
      PRef.current.currentTime = W;
      setX(W);
    }
  };
  const Q = (w) => {
    if (isNaN(w)) {
      return "0:00";
    }
    const k = Math.floor(w / 60);
    const B = Math.floor(w % 60);
    return `${k}:${B.toString().padStart(2, "0")}`;
  };
  return o ? (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full h-full md:h-[calc(100vh-12rem)] animate-in fade-in duration-500">
      <div className="w-full md:w-96 shrink-0 bg-secondary rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center h-fit md:sticky md:top-8">
        {o.url_foto_capa ? (
          <img
            src={getDirectImageUrl(o.url_foto_capa)}
            alt={o.titulo}
            className="w-32 h-32 rounded-full object-cover shadow-lg mb-6 border-4 border-white/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-primary/60 flex items-center justify-center shadow-lg mb-6 border-4 border-white/20">
            <MusicIcon size={40} className="text-white/70" />
          </div>
        )}
        <h2 className="font-title text-2xl text-center mb-1">{o.titulo}</h2>
        <p className="text-sm text-white/80 mb-8 italic">{o.autor}</p>
        <div className="w-full bg-primary/40 rounded-3xl p-6 flex flex-col items-center backdrop-blur-md border border-white/10">
          <p className="mb-6 font-semibold text-palette-yellow truncate w-full text-center">
            {r_t ? r_t.titulo : "Nenhuma faixa disponível"}
          </p>
          {y ? (
            <div className="w-full mb-8 text-center text-xs text-red-400 bg-red-900/30 rounded-xl px-4 py-3">
              Não foi possível carregar o áudio. Verifique se o link do arquivo
              ainda é válido e público.
            </div>
          ) : (
            <div className="w-full flex items-center gap-4 mb-8">
              <span className="text-xs font-mono opacity-80">{Q(x)}</span>
              <div
                className="flex-1 h-2 bg-white/20 rounded-full relative cursor-pointer group"
                onClick={j}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-palette-yellow rounded-full"
                  style={{
                    width: `${d ? (x / d) * 100 : 0}%`,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    left: `calc(${d ? (x / d) * 100 : 0}% - 8px)`,
                  }}
                />
              </div>
              <span className="text-xs font-mono opacity-80">{Q(d)}</span>
            </div>
          )}
          <div className="flex items-center gap-8">
            <button
              type="button"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Volume"
            >
              <Volume2Icon size={22} />
            </button>
            <button
              type="button"
              onClick={() => {
                const w = Math.max(0, t - 1);
                if (m) {
                  v(w);
                } else {
                  setT(w);
                }
              }}
              className="hover:text-palette-yellow transition-colors hover:scale-110"
              aria-label="Faixa anterior"
            >
              <SkipBackIcon size={28} className="fill-current" />
            </button>
            <button
              type="button"
              onClick={C}
              className="w-16 h-16 bg-white text-primary rounded-full flex items-center justify-center hover:scale-105 hover:bg-palette-yellow transition-all shadow-xl"
              aria-label={m ? "Pausar" : "Reproduzir"}
            >
              {m ? (
                <PauseIcon size={32} className="fill-current" />
              ) : (
                <PlayIcon size={32} className="ml-1 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                const w = Math.min(r.length - 1, t + 1);
                if (m) {
                  v(w);
                } else {
                  setT(w);
                }
              }}
              className="hover:text-palette-yellow transition-colors hover:scale-110"
              aria-label="Próxima faixa"
            >
              <SkipForwardIcon size={28} className="fill-current" />
            </button>
            <div className="w-5" />
          </div>
        </div>
      </div>
      <audio
        ref={PRef}
        onTimeUpdate={P}
        onLoadedMetadata={A}
        onError={() => {
          setY(true);
          setM(false);
        }}
        onEnded={() => {
          if (t < r.length - 1) {
            v(t + 1);
          } else {
            setM(false);
            setX(0);
          }
        }}
        className="hidden"
      />
      <div className="flex-1 overflow-y-auto pr-2 md:pr-4 flex flex-col gap-3 pb-8">
        <h3 className="font-title text-2xl mb-4 hidden md:block">
          Lista de Faixas
        </h3>
        {r.length === 0 ? (
          <div className="text-white/70">
            Nenhuma faixa encontrada para esta obra.
          </div>
        ) : (
          r.map((w, k) => (
            <div
              key={k}
              onClick={() => {
                if (k === t) {
                  C();
                } else {
                  v(k);
                }
              }}
              className={`flex items-center gap-4 border text-white rounded-2xl p-3 pr-6 cursor-pointer hover:bg-palette-green hover:text-primary hover:border-transparent transition-all shadow-sm group ${k === t ? "bg-palette-green text-primary border-transparent" : "bg-white/5 border-white/10"}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 shadow-inner transition-colors ${k === t ? "bg-primary text-white" : "bg-secondary/80 text-white group-hover:bg-primary"}`}
              >
                {k === t && m ? (
                  <PauseIcon size={20} className="fill-current" />
                ) : (
                  <PlayIcon size={20} className="ml-1 fill-current" />
                )}
              </div>
              <span className="font-bold flex-1 text-lg">{w.titulo}</span>
            </div>
          ))
        )}
      </div>
    </div>
  ) : (
    <div className="p-8 text-center">Carregando...</div>
  );
}
