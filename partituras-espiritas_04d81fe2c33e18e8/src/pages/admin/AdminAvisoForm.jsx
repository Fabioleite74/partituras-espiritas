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

export function AdminAvisoForm() {
  const { id } = useParams();
  const b = useNavigate();
  const [z, C] = React.useState(false);
  const [n, v] = React.useState({
    titulo: "",
    conteudo: "",
    url_imagem: "",
    url_link: "",
    codigo_adsense: "",
    ativo: true,
    ordem: 0,
    tipo: "banner",
  });
  const [p, t] = React.useState(null);
  const [o, w] = React.useState("");
  React.useEffect(() => {
    if (id) {
      (async () => {
        const f = await getDoc(doc(db, "avisos", id));
        if (f.exists()) {
          const a = f.data();
          v(a);
          if (a.url_imagem) {
            w(a.url_imagem);
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
      let f = n.url_imagem || "";
      if (p) {
        const i = ref(storage, `avisos/${Date.now()}_${p.name}`);
        await uploadBytesResumable(i, p);
        f = await getDownloadURL(i);
      }
      const a = {
        ...n,
        url_imagem: f,
        createdAt: id ? n.createdAt : serverTimestamp(),
      };
      if (id) {
        await updateDoc(doc(db, "avisos", id), a);
        toast.success("Aviso atualizado!");
      } else {
        await addDoc(collection(db, "avisos"), a);
        toast.success("Aviso criado!");
      }
      b("/admin/dashboard/avisos");
    } catch {
      toast.error("Erro ao salvar aviso.");
    } finally {
      C(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        {id ? "Editar Aviso" : "Novo Aviso"}
      </h1>
      <form
        onSubmit={g}
        className="space-y-6 bg-neutral-800 p-8 rounded-2xl border border-neutral-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="aviso-titulo"
              className="text-sm font-medium text-neutral-400"
            >
              Título
            </label>
            <input
              id="aviso-titulo"
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
              htmlFor="aviso-tipo"
              className="text-sm font-medium text-neutral-400"
            >
              Tipo
            </label>
            <select
              id="aviso-tipo"
              value={n.tipo}
              onChange={(u) =>
                v({
                  ...n,
                  tipo: u.target.value,
                })
              }
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
            >
              <option value="banner">Banner (Home)</option>
              <option value="popup">Popup (Entrada)</option>
              <option value="texto">Texto (Barra Superior)</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="aviso-conteudo"
            className="text-sm font-medium text-neutral-400"
          >
            Conteúdo / Mensagem
          </label>
          <textarea
            id="aviso-conteudo"
            value={n.conteudo}
            onChange={(u) =>
              v({
                ...n,
                conteudo: u.target.value,
              })
            }
            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow min-h-[100px]"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="aviso-adsense"
            className="text-sm font-medium text-neutral-400"
          >
            Código Google AdSense (Opcional)
          </label>
          <textarea
            id="aviso-adsense"
            value={n.codigo_adsense || ""}
            onChange={(u) =>
              v({
                ...n,
                codigo_adsense: u.target.value,
              })
            }
            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow min-h-[100px] font-mono text-sm"
            placeholder="<ins class='adsbygoogle' ...></ins>"
          />
          <p className="text-xs text-neutral-500">
            Cole aqui o código HTML do anúncio. O script do AdSense será
            executado automaticamente.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="aviso-url-link"
              className="text-sm font-medium text-neutral-400"
            >
              Link de Destino (Opcional)
            </label>
            <input
              id="aviso-url-link"
              type="url"
              value={n.url_link}
              onChange={(u) =>
                v({
                  ...n,
                  url_link: u.target.value,
                })
              }
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="aviso-ordem"
              className="text-sm font-medium text-neutral-400"
            >
              Ordem de Exibição
            </label>
            <input
              id="aviso-ordem"
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
            Imagem do Banner (Opcional)
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
              aria-label="Selecionar imagem do banner"
            />
          </div>
          <p className="text-xs text-neutral-500">
            {n.tipo === "popup"
              ? "Tamanho recomendado: 1280x720px (proporção 16:9)."
              : "Tamanho recomendado: 1920x823px (proporção 21:9). A imagem é cortada automaticamente para 16:9 no celular e 21:9 no desktop."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="ativo"
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
            htmlFor="ativo"
            className="text-sm font-medium text-neutral-300"
          >
            Aviso Ativo (Visível para o público)
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
            "Atualizar Aviso"
          ) : (
            "Criar Aviso"
          )}
        </button>
      </form>
    </div>
  );
}
