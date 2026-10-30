import * as React from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CloudUploadIcon,
  LoaderCircleIcon,
  MusicIcon,
  XIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/lib/firebase";
import { fileNameToTitle } from "@/lib/text.js";

export function AdminBatchAudioUpload() {
  const s = useNavigate();
  const [b, z] = React.useState([]);
  const [C, n] = React.useState(true);
  const [v, p] = React.useState([]);
  const [t, o] = React.useState(false);
  const [w, k] = React.useState("");
  React.useEffect(() => {
    (async () => {
      try {
        const N = (
          await getDocs(collection(db, "partituras_avulsas"))
        ).docs.map((F) => ({
          id: F.id,
          ...F.data(),
        }));
        z(N);
      } catch {
        toast.error("Erro ao buscar partituras avulsas.");
      } finally {
        n(false);
      }
    })();
  }, []);
  const g = (y) => {
    const L = Array.from(y.target.files || []);
    p((N) => [...N, ...L]);
    y.target.value = "";
  };
  const u = (y) => {
    p(v.filter((L, N) => N !== y));
  };
  const f = (y) => {
    const L = fileNameToTitle(y.name).toLowerCase();
    return b.find((N) => {
      return N.titulo?.trim().toLowerCase() === L;
    });
  };
  const a = v.map((y) => ({
    file: y,
    item: f(y),
  }));
  const i = a.filter((y) => y.item).length;
  const x = a.length - i;
  const S = async (y) => {
    y.preventDefault();
    if (v.length === 0) {
      toast.error("Selecione ao menos um arquivo de áudio.");
      return;
    }
    if (i === 0) {
      toast.error(
        "Nenhum arquivo corresponde ao nome de uma partitura avulsa cadastrada.",
      );
      return;
    }
    o(true);
    const L = new Map();
    a.forEach(({ file, item }) => {
      if (item?.id) {
        L.has(item.id) ||
          L.set(item.id, {
            item: item,
            files: [],
          });
        L.get(item.id).files.push(file);
      }
    });
    let N = 0;
    let F = 0;
    for (const { item, files } of L.values()) {
      try {
        const O = doc(db, "partituras_avulsas", item.id);
        const G = await getDoc(O);
        const j = G.exists() ? G.data().audios || [] : [];
        const E = [];
        for (const d of files) {
          k(`Enviando "${d.name}" (${item.titulo})...`);
          const D = ref(storage, `audios/${Date.now()}_${d.name}`);
          await uploadBytesResumable(D, d);
          const I = await getDownloadURL(D);
          E.push({
            titulo: fileNameToTitle(d.name),
            url: I,
          });
        }
        await updateDoc(O, {
          audios: [...j, ...E],
        });
        N += files.length;
      } catch (O) {
        console.error(`Erro ao processar áudios de ${item.titulo}:`, O);
        F += files.length;
      }
    }
    o(false);
    k("");
    if (N > 0) {
      toast.success(`${N} áudio(s) adicionado(s) com sucesso!`);
    }
    if (F > 0) {
      toast.error(`${F} áudio(s) falharam ao enviar.`);
    }
    if (N > 0) {
      s("/admin/dashboard/avulsas");
    }
  };
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Upload em Lote de Áudios — Partituras Avulsas
      </h1>
      <p className="text-neutral-400 mb-6">
        Envie vários arquivos de áudio de uma vez. Cada arquivo é vinculado
        automaticamente à partitura avulsa cujo título coincide com o nome do
        arquivo (o mesmo nome usado ao cadastrar o PDF). O nome da faixa é
        gerado a partir do nome do arquivo de áudio.
      </p>
      {C ? (
        <div className="flex justify-center py-12">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      ) : (
        <form
          onSubmit={S}
          className="space-y-6 bg-neutral-800 p-8 rounded-2xl border border-neutral-700"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400">
              Arquivos de Áudio
            </label>
            <div className="relative flex items-center gap-4 p-4 bg-neutral-700 rounded-lg border-2 border-dashed border-neutral-600 hover:border-palette-yellow transition-colors cursor-pointer">
              <CloudUploadIcon className="text-palette-yellow" />
              <span className="text-sm text-neutral-300">
                Clique para selecionar um ou mais áudios (MP3, WAV, OGG)
              </span>
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.ogg"
                multiple
                onChange={g}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Selecionar arquivos de áudio"
              />
            </div>
            {v.length > 0 && (
              <div className="space-y-2 mt-3">
                {a.map(({ file, item }, N) => (
                  <div
                    key={N}
                    className="flex items-center justify-between gap-3 p-3 bg-neutral-900/50 rounded-lg border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MusicIcon
                        size={18}
                        className={`shrink-0 ${item ? "text-green-400" : "text-red-400"}`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm truncate">{file.name}</p>
                        {item ? (
                          <p className="text-xs text-green-400 truncate flex items-center gap-1">
                            <CircleCheckIcon size={12} /> {item.titulo}
                          </p>
                        ) : (
                          <p className="text-xs text-red-400 truncate flex items-center gap-1">
                            <CircleAlertIcon size={12} />
                            {" Nenhuma partitura avulsa com esse nome"}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => u(N)}
                      className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md transition-colors shrink-0"
                      aria-label={`Remover ${file.name}`}
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {v.length > 0 && (
              <p className="text-xs text-neutral-500">
                {i}
                {" de "}
                {v.length}
                {" arquivo(s) correspondem a uma partitura cadastrada."}
                {x > 0 &&
                  " Os demais serão ignorados — renomeie o arquivo para igualar o título da partitura."}
              </p>
            )}
          </div>
          {t && (
            <div className="p-4 bg-palette-yellow/10 border border-palette-yellow/20 rounded-lg flex items-center gap-3 text-palette-yellow">
              <LoaderCircleIcon className="animate-spin" />
              <span>{w}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={t || i === 0}
            className="w-full bg-palette-yellow hover:bg-white text-primary font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {t ? "Processando..." : `Vincular ${i || ""} Áudio(s)`.trim()}
          </button>
        </form>
      )}
    </div>
  );
}
