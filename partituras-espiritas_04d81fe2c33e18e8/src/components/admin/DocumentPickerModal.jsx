import * as React from "react";
import { collection, getDocs } from "firebase/firestore";
import { SearchIcon, XIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";

export function DocumentPickerModal({ isOpen, onClose, onSelect, fileType }) {
  const [n, v] = React.useState([]);
  const [p, t] = React.useState(true);
  const [o, w] = React.useState("");
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    (async () => {
      t(true);
      try {
        const u = collection(db, "documentos_plataforma");
        const a = (await getDocs(u)).docs.map((i) => ({
          id: i.id,
          ...i.data(),
        }));
        v(a);
      } catch (u) {
        console.error(u);
        toast.error("Erro ao carregar arquivos do acervo.");
      } finally {
        t(false);
      }
    })();
  }, [isOpen]);
  const k = n.filter((g) => {
    let u;
    let f;
    let a;
    let i;
    let x;
    return !(
      (o &&
        !((u = g.nome) != null && u.toLowerCase().includes(o.toLowerCase()))) ||
      (fileType === "pdf" &&
        !((f = g.nome) != null && f.toLowerCase().endsWith(".pdf"))) ||
      (fileType === "musescore" &&
        !((a = g.nome) != null && a.toLowerCase().match(/\.(mscz|zip)$/))) ||
      (fileType === "audio" &&
        !((i = g.nome) != null && i.toLowerCase().match(/\.(mp3|wav|ogg)$/))) ||
      (fileType === "image" &&
        !(
          (x = g.nome) != null &&
          x.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/)
        ))
    );
  });
  return isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-800 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden border border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-bold">Acervo de Arquivos</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nome do arquivo..."
              value={o}
              onChange={(g) => w(g.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-palette-yellow"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {p ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-palette-yellow" />
            </div>
          ) : k.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              Nenhum arquivo encontrado.
            </div>
          ) : (
            <div className="grid gap-2">
              {k.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    if (g.url_publica) {
                      onSelect(g.url_publica);
                      onClose();
                    } else {
                      toast.error("Este arquivo não possui uma URL pública.");
                    }
                  }}
                  className="flex items-center justify-between p-4 bg-neutral-900/50 hover:bg-neutral-700 rounded-xl border border-white/5 transition-colors text-left group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-medium truncate">{g.nome}</p>
                    <p className="text-xs text-white/40 truncate mt-1">
                      {g.path_storage}
                    </p>
                  </div>
                  <div className="text-palette-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                    Selecionar
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
