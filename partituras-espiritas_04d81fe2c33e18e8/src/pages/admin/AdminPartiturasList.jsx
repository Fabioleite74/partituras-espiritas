import * as React from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  CirclePlusIcon,
  CloudUploadIcon,
  ImageIcon,
  LinkIcon,
  LoaderCircleIcon,
  MusicIcon,
  SearchIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/lib/firebase";

export function AdminPartiturasList({
  categoriaFixa: s,
  titulo: b = "Partituras Avulsas",
  configId: z = "partituras_avulsas",
  basePath: C = "avulsas",
} = {}) {
  const [n, v] = React.useState([]);
  const [p, t] = React.useState(true);
  const o = useNavigate();
  const [w, k] = React.useState("");
  const [g, u] = React.useState("");
  const [f, a] = React.useState("");
  const [i, x] = React.useState("upload");
  const [S, y] = React.useState(null);
  const [L, N] = React.useState("");
  const [F, T] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      try {
        let R = (await getDocs(collection(db, "partituras_avulsas"))).docs.map(
          (W) => ({
            id: W.id,
            ...W.data(),
          }),
        );
        if (s) {
          R = R.filter((W) => W.categoria === s);
        }
        R.sort((W, Z) => {
          return (
            (Z.createdAt?.toMillis?.() ?? 0) - (W.createdAt?.toMillis?.() ?? 0)
          );
        });
        v(R);
      } catch {
        toast.error("Erro ao buscar partituras avulsas.");
      } finally {
        t(false);
      }
    })();
    (async () => {
      const I = await getDoc(doc(db, "configuracoes", z));
      if (I.exists()) {
        const R = I.data().url_imagem || "";
        a(R);
        N(R);
        x(R && !R.includes("firebasestorage") ? "link" : "upload");
      }
    })();
  }, [s, z]);
  const P = async (d) => {
    if (
      window.confirm("Tem certeza que deseja excluir esta partitura avulsa?")
    ) {
      try {
        await deleteDoc(doc(db, "partituras_avulsas", d));
        v(n.filter((D) => D.id !== d));
        toast.success("Partitura avulsa excluída com sucesso!");
      } catch {
        toast.error("Erro ao excluir partitura avulsa.");
      }
    }
  };
  const O = (d) => {
    const D = d.target.files?.[0] || null;
    y(D);
    if (D) {
      const R = new FileReader();
      R.onloadend = () => N(R.result);
      R.readAsDataURL(D);
    }
  };
  const G = async () => {
    T(true);
    try {
      let d = f;
      if (i === "upload" && S) {
        const D = ref(storage, `${z}_capa/${Date.now()}_${S.name}`);
        await uploadBytesResumable(D, S);
        d = await getDownloadURL(D);
      }
      await setDoc(doc(db, "configuracoes", z), {
        url_imagem: d,
      });
      a(d);
      N(d);
      y(null);
      toast.success("Imagem de destaque atualizada!");
    } catch {
      toast.error("Erro ao salvar imagem de destaque.");
    } finally {
      T(false);
    }
  };
  const j = Array.from(
    new Set(n.map((d) => d.categoria).filter((d) => !!d)),
  ).sort();
  const E = n.filter((d) => {
    if (g && d.categoria !== g) {
      return false;
    }
    const D = w.trim().toLowerCase();
    return D
      ? [d.titulo, d.autor, d.categoria, d.palavras_chave].some((I) =>
          I?.toLowerCase().includes(D),
        )
      : true;
  });
  return p ? (
    <div className="flex justify-center py-12">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  ) : (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-bold">{b}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => o(`/admin/dashboard/${C}/lote`)}
            className="bg-neutral-800 border border-neutral-700 text-white px-6 py-2 rounded-full font-bold hover:bg-neutral-700 transition-all flex items-center gap-2"
          >
            <CloudUploadIcon size={20} />
            {" Upload em Lote (PDFs)"}
          </button>
          {!s && (
            <button
              onClick={() => o("/admin/dashboard/avulsas/lote-audios")}
              className="bg-neutral-800 border border-neutral-700 text-white px-6 py-2 rounded-full font-bold hover:bg-neutral-700 transition-all flex items-center gap-2"
            >
              <MusicIcon size={20} />
              {" Upload em Lote (Áudios)"}
            </button>
          )}
          <button
            onClick={() => o(`/admin/dashboard/${C}/nova`)}
            className="bg-palette-yellow text-primary px-6 py-2 rounded-full font-bold hover:bg-white transition-all flex items-center gap-2"
          >
            <CirclePlusIcon size={20} />
            {" Nova Partitura"}
            {s ? "" : " Avulsa"}
          </button>
        </div>
      </div>
      <div className="bg-neutral-800 rounded-2xl border border-neutral-700 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Imagem de Destaque</h2>
          <p className="text-sm text-neutral-400">
            Exibida na página inicial do site; ao clicar, o visitante é levado a
            esta listagem.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 shrink-0">
            <div className="relative aspect-video bg-neutral-700 rounded-xl overflow-hidden border-2 border-dashed border-neutral-600 flex flex-col items-center justify-center group cursor-pointer hover:border-palette-yellow transition-colors">
              {L ? (
                <img
                  src={L}
                  className="w-full h-full object-cover"
                  alt="Preview"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  <ImageIcon size={36} className="text-neutral-500 mb-2" />
                  <span className="text-neutral-400 text-xs text-center px-2">
                    Nenhuma imagem definida
                  </span>
                </>
              )}
              {i === "upload" && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={O}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Selecionar imagem de destaque"
                />
              )}
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-700 w-fit">
              <button
                type="button"
                onClick={() => x("upload")}
                className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${i === "upload" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <CloudUploadIcon size={14} />
                {" Upload"}
              </button>
              <button
                type="button"
                onClick={() => x("link")}
                className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${i === "link" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
              >
                <LinkIcon size={14} />
                {" Link"}
              </button>
            </div>
            {i === "link" && (
              <input
                type="url"
                value={f}
                onChange={(d) => {
                  a(d.target.value);
                  N(d.target.value);
                }}
                placeholder="Cole o link da imagem"
                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
              />
            )}
            <button
              type="button"
              onClick={G}
              disabled={F}
              className="bg-palette-yellow text-primary px-6 py-2 rounded-full font-bold hover:bg-white transition-all disabled:opacity-50"
            >
              {F ? "Salvando..." : "Salvar Imagem"}
            </button>
          </div>
        </div>
      </div>
      {n.length > 0 && (
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              size={18}
            />
            <input
              type="text"
              value={w}
              onChange={(d) => k(d.target.value)}
              placeholder="Buscar por título, autor, categoria ou tags..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-palette-yellow"
              aria-label="Buscar partituras avulsas"
            />
          </div>
          {j.length > 0 && !s && (
            <select
              value={g}
              onChange={(d) => u(d.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-palette-yellow md:w-56"
              aria-label="Filtrar por categoria"
            >
              <option value="">Todas as categorias</option>
              {j.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      <div className="space-y-3">
        {n.length === 0 ? (
          <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 text-neutral-500">
            Nenhuma partitura cadastrada{s ? ` em "${s}"` : ""}.
          </div>
        ) : E.length === 0 ? (
          <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 text-neutral-500">
            Nenhum resultado encontrado para essa busca.
          </div>
        ) : (
          E.map((d) => (
            <div
              key={d.id}
              className="flex flex-wrap items-center gap-4 bg-neutral-800 p-4 rounded-xl border border-neutral-700"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{d.titulo}</h3>
                <p className="text-neutral-400 text-sm truncate">{d.autor}</p>
              </div>
              {d.ativo === false && (
                <span className="text-xs font-bold uppercase tracking-wide bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full">
                  Rascunho
                </span>
              )}
              {d.categoria && !s && (
                <span className="text-xs font-bold uppercase tracking-wide bg-palette-yellow/10 text-palette-yellow px-3 py-1 rounded-full">
                  {d.categoria}
                </span>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => o(`/admin/dashboard/${C}/editar/${d.id}`)}
                  className="p-2.5 bg-neutral-700 hover:bg-palette-yellow hover:text-primary rounded-full transition-colors"
                  aria-label="Editar partitura avulsa"
                >
                  <SquarePenIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => P(d.id)}
                  className="p-2.5 bg-neutral-700 hover:bg-red-600 rounded-full transition-colors"
                  aria-label="Excluir partitura avulsa"
                >
                  <Trash2Icon size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
