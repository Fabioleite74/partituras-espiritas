import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { OperationType, db, handleFirestoreError } from "@/lib/firebase";
import { getYouTubePlaylistId } from "@/lib/media.js";
import { loadYouTubeApi } from "@/lib/youtube.js";

export function TutorialPlaylist() {
  const { id } = useParams();
  const [l, setL] = React.useState(null);
  const [f, setF] = React.useState(true);
  const [i, setI] = React.useState([]);
  const [n, setN] = React.useState({});
  const [c, setC] = React.useState(0);
  const URef = React.useRef(null);
  const YRef = React.useRef(null);
  React.useEffect(() => {
    if (!id) {
      return;
    }
    const p = onSnapshot(
      doc(db, "tutoriais", id),
      (r) => {
        if (r.exists()) {
          setL({
            id: r.id,
            ...r.data(),
          });
        }
        setF(false);
      },
      (r) => {
        handleFirestoreError(r, OperationType.GET, `tutoriais/${id}`);
        setF(false);
      },
    );
    return () => p();
  }, [id]);
  const N = l ? getYouTubePlaylistId(l.url_playlist) : null;
  React.useEffect(() => {
    if (!N || !URef.current) {
      return;
    }
    let p = false;
    loadYouTubeApi().then((r) => {
      if (p || !URef.current) {
        return;
      }
      const b = new r.Player(URef.current, {
        playerVars: {
          listType: "playlist",
          list: N,
        },
        events: {
          onReady: (v) => {
            setI(v.target.getPlaylist() || []);
            setC(v.target.getPlaylistIndex());
          },
          onStateChange: (v) => {
            setC(v.target.getPlaylistIndex());
          },
        },
      });
      YRef.current = b;
    });
    return () => {
      let r;
      let b;
      p = true;
      if ((b = YRef.current?.destroy) != null) {
        b.call(r);
      }
      YRef.current = null;
      setI([]);
      setC(0);
    };
  }, [N]);
  React.useEffect(() => {
    const p = i.filter((b) => !(b in n));
    if (p.length === 0) {
      return;
    }
    let r = false;
    Promise.all(
      p.map(async (b) => {
        try {
          const v = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${b}`)}&format=json`,
          );
          const C = v.ok ? await v.json() : null;
          return [b, C?.title || ""];
        } catch {
          return [b, ""];
        }
      }),
    ).then((b) => {
      if (!r) {
        setN((v) => {
          const C = {
            ...v,
          };
          b.forEach(([P, A]) => {
            C[P] = A;
          });
          return C;
        });
      }
    });
    return () => {
      r = true;
    };
  }, [i]);
  if (f) {
    return <div className="p-8 text-center">Carregando...</div>;
  }
  if (l) {
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-10rem)] max-w-6xl mx-auto w-full animate-in fade-in duration-500">
        <h2 className="font-title text-2xl md:text-4xl text-center mb-6 shrink-0">
          {l.titulo}
        </h2>
        {N ? (
          <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
            <div className="w-full md:flex-1 aspect-video md:aspect-auto bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
              <div ref={URef} className="w-full h-full" />
            </div>
            <div className="w-full md:w-96 flex-1 md:flex-none min-h-0 flex flex-col gap-2 pb-4 overflow-y-auto">
              {i.length === 0 ? (
                <div className="flex items-center justify-center h-full text-white/40 text-sm">
                  Carregando lista de vídeos...
                </div>
              ) : (
                i.map((p, r) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      let b;
                      let v;
                      if ((v = YRef.current?.playVideoAt) != null) {
                        v.call(b, r);
                      }
                      setC(r);
                    }}
                    className={`text-left rounded-xl overflow-hidden transition-colors flex items-center gap-3 pr-3 shrink-0 ${r === c ? "bg-palette-yellow text-primary" : "bg-white/5 hover:bg-white/10 text-white"}`}
                  >
                    <div className="w-36 aspect-video shrink-0 bg-black/40 relative">
                      <img
                        src={`https://img.youtube.com/vi/${p}/mqdefault.jpg`}
                        alt={n[p] || `Vídeo ${r + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute bottom-1 right-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${r === c ? "bg-primary text-white" : "bg-black/70 text-white"}`}
                      >
                        {r + 1}
                      </span>
                    </div>
                    <span className="flex-1 text-sm font-bold line-clamp-2">
                      {n[p] || `Vídeo ${r + 1}`}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 flex items-center justify-center text-white/50">
            URL de playlist inválida
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="p-8 text-center text-white/70">
      Tutorial não encontrado.
    </div>
  );
}
