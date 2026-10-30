import * as React from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  CircleAlertIcon,
  CloudUploadIcon,
  FileTextIcon,
  LoaderCircleIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/lib/firebase";
import { fileNameToTitle } from "@/lib/text.js";

export function AdminBatchUpload({
  categoriaFixa: s,
  basePath: b = "avulsas",
  tituloSecao: z,
} = {}) {
  const C = useNavigate();
  const [n, v] = React.useState(s || "");
  const [p, t] = React.useState("");
  const [o, w] = React.useState([]);
  const [k, g] = React.useState(false);
  const [u, f] = React.useState("");
  const [a, i] = React.useState([]);
  const [x, S] = React.useState(false);
  const [y, L] = React.useState({});
  React.useEffect(() => {
    (async () => {
      try {
        const E = await getDocs(collection(db, "partituras_avulsas"));
        i(
          E.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        );
      } catch (E) {
        console.error("Erro ao buscar partituras avulsas existentes:", E);
      }
    })();
  }, []);
  const N = (j) => {
    const E = fileNameToTitle(j.name).trim().toLowerCase();
    return a.find((d) => {
      return d.titulo?.trim().toLowerCase() === E;
    });
  };
  const F = (j) => {
    const E = Array.from(j.target.files || []);
    w((d) => [...d, ...E]);
    j.target.value = "";
  };
  const T = (j) => {
    w(o.filter((E, d) => d !== j));
  };
  const P = o
    .map((j, E) => ({
      file: j,
      index: E,
      existing: N(j),
    }))
    .filter((j) => !!j.existing);
  const O = async () => {
    S(false);
    g(true);
    let j = 0;
    let E = 0;
    let d = 0;
    for (let D = 0; D < o.length; D++) {
      const o_D = o[D];
      const R = N(o_D);
      const W = R ? y[D] || "manter-ambos" : null;
      if (W === "ignorar") {
        d++;
        continue;
      }
      f(`Enviando ${D + 1} de ${o.length}: ${o_D.name}...`);
      try {
        if (W === "substituir" && R != null && R.id) {
          await deleteDoc(doc(db, "partituras_avulsas", R.id));
        }
        const Z = ref(storage, `pdfs/${Date.now()}_${o_D.name}`);
        await uploadBytesResumable(Z, o_D);
        const Q = await getDownloadURL(Z);
        await addDoc(collection(db, "partituras_avulsas"), {
          titulo: fileNameToTitle(o_D.name),
          autor: p,
          categoria: n,
          palavras_chave: fileNameToTitle(o_D.name),
          url_arquivo_pdf: Q,
          url_arquivo_musescore: "",
          audios: [],
          videos_autor: [],
          createdAt: serverTimestamp(),
        });
        j++;
      } catch (Z) {
        console.error(`Erro ao cadastrar ${o_D.name}:`, Z);
        E++;
      }
    }
    g(false);
    f("");
    if (j > 0) {
      toast.success(`${j} partitura(s) cadastrada(s) com sucesso!`);
    }
    if (d > 0) {
      toast(`${d} arquivo(s) ignorado(s) por duplicidade.`);
    }
    if (E > 0) {
      toast.error(`${E} arquivo(s) falharam ao cadastrar.`);
    }
    if (j > 0) {
      C(`/admin/dashboard/${b}`);
    }
  };
  const G = async (j) => {
    j.preventDefault();
    if (o.length === 0) {
      toast.error("Selecione ao menos um arquivo PDF.");
      return;
    }
    if (P.length > 0) {
      L(Object.fromEntries(P.map((E) => [E.index, "manter-ambos"])));
      S(true);
      return;
    }
    await O();
  };
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Upload em Lote{s ? ` — ${z || s}` : " — Partituras Avulsas"}
      </h1>
      <p className="text-neutral-400 mb-6">
        Envie vários PDFs de uma vez. Todos serão cadastrados com a mesma
        categoria e autor; o título e a palavra-chave de busca de cada um são
        gerados a partir do nome do arquivo.
      </p>
      <form
        onSubmit={G}
        className="space-y-6 bg-neutral-800 p-8 rounded-2xl border border-neutral-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="lote-categoria"
              className="text-sm font-medium text-neutral-400 flex items-center gap-2"
            >
              <TagIcon size={14} />
              {" Categoria (aplicada a todo o lote)"}
            </label>
            <input
              id="lote-categoria"
              type="text"
              value={n}
              onChange={(j) => v(j.target.value)}
              className={`w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow ${s ? "opacity-70 cursor-not-allowed" : ""}`}
              placeholder="ex: Hinos, Preces, Evangelização"
              readOnly={!!s}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="lote-autor"
              className="text-sm font-medium text-neutral-400"
            >
              Autor (aplicado a todo o lote)
            </label>
            <input
              id="lote-autor"
              type="text"
              value={p}
              onChange={(j) => t(j.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400">
            Arquivos PDF
          </label>
          <div className="relative flex items-center gap-4 p-4 bg-neutral-700 rounded-lg border-2 border-dashed border-neutral-600 hover:border-palette-yellow transition-colors cursor-pointer">
            <CloudUploadIcon className="text-red-400" />
            <span className="text-sm text-neutral-300">
              Clique para selecionar um ou mais PDFs
            </span>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={F}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Selecionar arquivos PDF"
            />
          </div>
          {o.length > 0 && (
            <div className="space-y-2 mt-3">
              {o.map((j, E) => {
                const d = N(j);
                return (
                  <div
                    key={E}
                    className="flex items-center justify-between gap-3 p-3 bg-neutral-900/50 rounded-lg border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileTextIcon
                        size={18}
                        className="text-red-400 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm truncate">{j.name}</p>
                        <p className="text-xs text-neutral-500 truncate">
                          {"Título: "}
                          {fileNameToTitle(j.name)}
                        </p>
                      </div>
                      {d && (
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full shrink-0 flex items-center gap-1">
                          <CircleAlertIcon size={11} />
                          {" Duplicado"}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => T(E)}
                      className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md transition-colors shrink-0"
                      aria-label={`Remover ${j.name}`}
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {k && (
          <div className="p-4 bg-palette-yellow/10 border border-palette-yellow/20 rounded-lg flex items-center gap-3 text-palette-yellow">
            <LoaderCircleIcon className="animate-spin" />
            <span>{u}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={k || o.length === 0}
          className="w-full bg-palette-yellow hover:bg-white text-primary font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {k
            ? "Processando..."
            : `Cadastrar ${o.length || ""} Partitura(s)`.trim()}
        </button>
      </form>
      {x && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <CircleAlertIcon className="text-amber-500 shrink-0" size={24} />
              <div>
                <h3 className="text-xl font-bold">
                  Possíveis duplicidades encontradas
                </h3>
                <p className="text-sm text-neutral-400">
                  {P.length}
                  {
                    " arquivo(s) parecem já existir no acervo (mesmo título). Escolha o que fazer com cada um."
                  }
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {P.map(({ file, index, existing }) => (
                <div
                  key={index}
                  className="p-4 bg-neutral-900/50 rounded-xl border border-amber-500/30 space-y-3"
                >
                  <div className="text-sm">
                    <span className="text-neutral-400">{"Novo arquivo: "}</span>
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-neutral-400">
                      {"Já cadastrado como: "}
                    </span>
                    <span className="font-medium">"{existing.titulo}"</span>
                    {existing.autor && (
                      <span className="text-neutral-500">
                        {" — "}
                        {existing.autor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        value: "manter-ambos",
                        label: "Manter os dois",
                      },
                      {
                        value: "substituir",
                        label: "Excluir o existente e importar o novo",
                      },
                      {
                        value: "ignorar",
                        label: "Ignorar este arquivo",
                      },
                    ].map((D) => (
                      <button
                        key={D.value}
                        type="button"
                        onClick={() =>
                          L((I) => ({
                            ...I,
                            [index]: D.value,
                          }))
                        }
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${y[index] === D.value ? "bg-palette-yellow text-primary border-palette-yellow font-bold" : "border-neutral-600 text-neutral-300 hover:border-palette-yellow"}`}
                      >
                        {D.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => S(false)}
                className="px-5 py-2.5 rounded-full border border-neutral-600 text-neutral-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => O()}
                className="px-6 py-2.5 rounded-full bg-palette-yellow text-primary font-bold hover:bg-white transition-colors"
              >
                Confirmar e continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
