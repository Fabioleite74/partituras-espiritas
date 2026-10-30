import * as React from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ImageIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "@/lib/firebase";

export function AdminTutorialForm() {
  const { id } = useParams();
  const b = useNavigate();
  const [z, C] = React.useState(false);
  const [n, v] = React.useState({
    titulo: "",
    descricao: "",
    url_capa: "",
    url_playlist: "",
    ativo: true,
    ordem: 0,
  });
  const [p, t] = React.useState(null);
  const [o, w] = React.useState("");
  React.useEffect(() => {
    if (id) {
      (async () => {
        const f = await getDoc(doc(db, "tutoriais", id));
        if (f.exists()) {
          const a = f.data();
          v(a);
          if (a.url_capa) {
            w(a.url_capa);
          }
        }
      })();
    }
  }, [id]);
  const k = (u) => {
    const f = u.target.files?.[0] || null;
    t(f);
    if (f) {
      const i = new FileReader();
      i.onloadend = () => w(i.result);
      i.readAsDataURL(f);
    }
  };
  const g = async (u) => {
    u.preventDefault();
    C(true);
    try {
      let f = n.url_capa || "";
      if (p) {
        const i = ref(storage, `tutoriais/${Date.now()}_${p.name}`);
        await uploadBytesResumable(i, p);
        f = await getDownloadURL(i);
      }
      const a = {
        ...n,
        url_capa: f,
        createdAt: id ? n.createdAt : serverTimestamp(),
      };
      if (id) {
        await updateDoc(doc(db, "tutoriais", id), a);
        toast.success("Tutorial atualizado!");
      } else {
        await addDoc(collection(db, "tutoriais"), a);
        toast.success("Tutorial criado!");
      }
      b("/admin/dashboard/tutoriais");
    } catch {
      toast.error("Erro ao salvar tutorial.");
    } finally {
      C(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        {id ? "Editar Tutorial" : "Novo Tutorial"}
      </h1>
      <form
        onSubmit={g}
        className="space-y-6 bg-neutral-800 p-8 rounded-2xl border border-neutral-700"
      >
        <div className="space-y-2">
          <label
            htmlFor="tutorial-titulo"
            className="text-sm font-medium text-neutral-400"
          >
            Título do Curso/Tutorial
          </label>
          <input
            id="tutorial-titulo"
            type="text"
            value={n.titulo}
            onChange={(u) =>
              v({
                ...n,
                titulo: u.target.value,
              })
            }
            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="tutorial-descricao"
            className="text-sm font-medium text-neutral-400"
          >
            Descrição (Opcional)
          </label>
          <textarea
            id="tutorial-descricao"
            value={n.descricao || ""}
            onChange={(u) =>
              v({
                ...n,
                descricao: u.target.value,
              })
            }
            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow min-h-[80px]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="tutorial-url-playlist"
              className="text-sm font-medium text-neutral-400"
            >
              Link da Playlist do YouTube
            </label>
            <input
              id="tutorial-url-playlist"
              type="url"
              value={n.url_playlist}
              onChange={(u) =>
                v({
                  ...n,
                  url_playlist: u.target.value,
                })
              }
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
              placeholder="https://www.youtube.com/playlist?list=..."
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="tutorial-ordem"
              className="text-sm font-medium text-neutral-400"
            >
              Ordem de Exibição
            </label>
            <input
              id="tutorial-ordem"
              type="number"
              value={n.ordem}
              onChange={(u) =>
                v({
                  ...n,
                  ordem: parseInt(u.target.value),
                })
              }
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400">
            Imagem de Capa (Opcional)
          </label>
          <div className="relative h-40 bg-neutral-700 rounded-xl overflow-hidden border-2 border-dashed border-neutral-600 flex flex-col items-center justify-center group cursor-pointer hover:border-palette-yellow transition-colors">
            {o ? (
              <img
                src={o}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <>
                <ImageIcon size={32} className="text-neutral-500 mb-2" />
                <span className="text-neutral-400 text-sm">
                  Selecionar Imagem
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={k}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Selecionar imagem de capa"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="tutorial-ativo"
            checked={n.ativo}
            onChange={(u) =>
              v({
                ...n,
                ativo: u.target.checked,
              })
            }
            className="w-5 h-5 rounded border-neutral-600 text-palette-yellow focus:ring-palette-yellow bg-neutral-700"
          />
          <label
            htmlFor="tutorial-ativo"
            className="text-sm font-medium text-neutral-300"
          >
            Tutorial Ativo (Visível para o público)
          </label>
        </div>
        <button
          type="submit"
          disabled={z}
          className="w-full bg-palette-yellow hover:bg-white text-primary font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {z ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : id ? (
            "Atualizar Tutorial"
          ) : (
            "Criar Tutorial"
          )}
        </button>
      </form>
    </div>
  );
}
