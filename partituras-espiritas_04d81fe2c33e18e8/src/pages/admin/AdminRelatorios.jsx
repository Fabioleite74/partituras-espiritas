import * as React from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { ExternalLinkIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";

export function AdminRelatorios() {
  const [s, b] = React.useState([]);
  const [z, C] = React.useState(true);
  const [n, v] = React.useState("");
  const [p, t] = React.useState("");
  const [o, w] = React.useState(false);
  const [k, g] = React.useState(false);
  const u = (i) =>
    /^https:\/\/(lookerstudio|datastudio)\.google\.com\//.test(i.trim());
  React.useEffect(() => {
    (async () => {
      try {
        const S = query(collection(db, "downloads"), orderBy("total", "desc"));
        const y = await getDocs(S);
        b(
          y.docs.map((L) => ({
            id: L.id,
            ...L.data(),
          })),
        );
      } catch {
        toast.error("Erro ao buscar relatório de downloads.");
      } finally {
        C(false);
      }
    })();
    (async () => {
      const S = await getDoc(doc(db, "configuracoes", "looker_studio"));
      if (S.exists()) {
        const y = S.data().url_embed || "";
        v(y);
        t(y);
      }
    })();
  }, []);
  const f = async () => {
    const i = p.trim();
    if (i && !u(i)) {
      toast.error(
        "Cole um link de incorporação do Looker Studio (lookerstudio.google.com).",
      );
      return;
    }
    w(true);
    try {
      await setDoc(doc(db, "configuracoes", "looker_studio"), {
        url_embed: i,
      });
      v(i);
      toast.success(i ? "Painel do Looker Studio salvo!" : "Painel removido.");
    } catch {
      toast.error("Erro ao salvar o painel.");
    } finally {
      w(false);
    }
  };
  if (z) {
    return (
      <div className="flex justify-center py-12">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    );
  }
  const a = s.reduce((i, x) => i + (x.total || 0), 0);
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Relatórios</h1>
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 w-fit">
        <p className="text-sm text-neutral-400">
          Total de downloads (PDF + MuseScore)
        </p>
        <p className="text-3xl font-bold text-palette-yellow">{a}</p>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-3">
          Top 5 — Downloads por obra/partitura
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {s.slice(0, 5).map((i) => (
            <div
              key={i.id}
              className="p-4 rounded-xl border bg-neutral-800 border-neutral-700 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <span className="font-bold">{i.titulo}</span>
                <span className="text-neutral-400 text-sm ml-2">
                  {"— "}
                  {i.autor}
                  {" ("}
                  {i.tipo})
                </span>
              </div>
              <div className="flex gap-4 text-sm">
                <span>
                  {"PDF: "}
                  <strong>{i.pdf || 0}</strong>
                </span>
                <span>
                  {"MuseScore: "}
                  <strong>{i.musescore || 0}</strong>
                </span>
                <span className="text-palette-yellow font-bold">
                  {"Total: "}
                  {i.total || 0}
                </span>
              </div>
            </div>
          ))}
          {s.length === 0 && (
            <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 text-neutral-500">
              Nenhum download registrado ainda.
            </div>
          )}
        </div>
      </div>
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold mb-1">
              Visitas, geografia e dispositivos (Google Analytics)
            </h2>
            <p className="text-neutral-400 text-sm">
              Painel do Looker Studio conectado à propriedade GA4 do site,
              embutido aqui.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://analytics.google.com/analytics/web/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-neutral-700 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-neutral-600 transition-colors"
            >
              <ExternalLinkIcon size={14} />
              {" Abrir Google Analytics"}
            </a>
            <button
              type="button"
              onClick={() => g((i) => !i)}
              className="inline-flex items-center gap-2 bg-neutral-700 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-neutral-600 transition-colors"
            >
              {n && !k ? "Trocar painel" : "Como configurar"}
            </button>
          </div>
        </div>
        {(!n || k) && (
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 space-y-4">
            <ol className="text-sm text-neutral-300 space-y-2 list-decimal list-inside">
              <li>
                {"Acesse "}
                <span className="text-palette-yellow">
                  lookerstudio.google.com
                </span>
                {" e crie um relatório novo."}
              </li>
              <li>
                {"Escolha a fonte de dados "}
                <strong>Google Analytics</strong>
                {" e selecione a propriedade GA4 deste site."}
              </li>
              <li>
                Monte os gráficos que quiser (usuários ativos, engajamento,
                páginas mais vistas, país, dispositivo etc.).
              </li>
              <li>
                {"No menu "}
                <strong>Arquivo → Incorporar relatório</strong>
                {", ative a incorporação e copie o link (ou a URL do "}
                <code className="bg-neutral-800 px-1 rounded">src</code>
                {" do iframe)."}
              </li>
              <li>
                {"Em "}
                <strong>Compartilhar</strong>, garanta que "Qualquer pessoa com
                o link" tenha acesso de visualização — senão o painel não
                carrega aqui.
              </li>
              <li>Cole o link abaixo e salve.</li>
            </ol>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={p}
                onChange={(i) => t(i.target.value)}
                placeholder="https://lookerstudio.google.com/embed/reporting/..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-palette-yellow text-sm"
              />
              <button
                type="button"
                onClick={async () => {
                  await f();
                  g(false);
                }}
                disabled={o}
                className="bg-palette-yellow text-primary font-bold px-6 py-2.5 rounded-full hover:bg-white transition-all disabled:opacity-50 shrink-0"
              >
                {o ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        )}
        {n ? (
          <iframe
            src={n}
            className="w-full h-[900px] rounded-xl border border-neutral-700 bg-white"
            title="Painel Google Analytics (Looker Studio)"
            allowFullScreen
          />
        ) : (
          <div className="text-center py-12 bg-neutral-900 rounded-xl border border-dashed border-neutral-700 text-neutral-500 text-sm">
            Nenhum painel configurado ainda — siga os passos acima para embutir
            seus gráficos do GA4 aqui.
          </div>
        )}
      </div>
    </div>
  );
}
