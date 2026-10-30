import * as React from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import {
  CheckIcon,
  LoaderCircleIcon,
  ReplyIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { db, functions } from "@/lib/firebase";

export function AdminMensagens() {
  const [s, b] = React.useState([]);
  const [z, C] = React.useState(true);
  const [n, v] = React.useState(null);
  const [p, t] = React.useState({});
  const [o, w] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const i = query(
          collection(db, "mensagens"),
          orderBy("createdAt", "desc"),
        );
        const S = (await getDocs(i)).docs.map((y) => ({
          id: y.id,
          ...y.data(),
        }));
        b(S);
      } catch {
        toast.error("Erro ao buscar mensagens.");
      } finally {
        C(false);
      }
    })();
  }, []);
  const k = async (a) => {
    if (window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      try {
        await deleteDoc(doc(db, "mensagens", a));
        b(s.filter((i) => i.id !== a));
        toast.success("Mensagem excluída!");
      } catch {
        toast.error("Erro ao excluir mensagem.");
      }
    }
  };
  const g = async (a, i, x) => {
    try {
      await updateDoc(doc(db, "mensagens", a), {
        [i]: !x,
      });
      b(
        s.map((S) =>
          S.id === a
            ? {
                ...S,
                [i]: !x,
              }
            : S,
        ),
      );
      toast.success("Status atualizado!");
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };
  const u = (a) => {
    v(a.id);
    if (p[a.id] === undefined) {
      t((i) => ({
        ...i,
        [a.id]: `Olá ${a.nome},

Em resposta à sua mensagem:
"${a.mensagem}"

`,
      }));
    }
  };
  const f = async (a) => {
    const i = (p[a.id] || "").trim();
    if (!i) {
      toast.error("Escreva uma resposta antes de enviar.");
      return;
    }
    w(a.id);
    try {
      await httpsCallable(
        functions,
        "enviarRespostaMensagem",
      )({
        mensagemId: a.id,
        destinatarioEmail: a.email,
        assunto: "Contato - Partituras Espíritas",
        corpo: i,
      });
      b(
        s.map((x) =>
          x.id === a.id
            ? {
                ...x,
                respondida: true,
                respostaTexto: i,
                respostaEnviadaEm: {
                  toDate: () => new Date(),
                },
              }
            : x,
        ),
      );
      v(null);
      toast.success("Resposta enviada!");
    } catch (x) {
      toast.error(x?.message || "Erro ao enviar resposta.");
    } finally {
      w(null);
    }
  };
  return z ? (
    <div className="flex justify-center py-12">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  ) : (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mensagens de Contato</h1>
      <div className="grid grid-cols-1 gap-4">
        {s.map((a) => {
          return (
            <div
              key={a.id}
              className={`p-6 rounded-xl border flex flex-col gap-4 transition-colors ${a.lida ? "bg-neutral-800 border-neutral-700" : "bg-neutral-800/80 border-palette-yellow/50"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {a.nome}
                    {!a.lida && (
                      <span className="bg-palette-yellow text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                        Nova
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {a.email} {a.whatsapp && `• ${a.whatsapp}`}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {a.createdAt?.toDate
                      ? a.createdAt.toDate().toLocaleString()
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => g(a.id, "lida", a.lida)}
                    className={`p-2 rounded-lg transition-colors ${a.lida ? "text-green-400 hover:bg-neutral-700" : "text-neutral-400 hover:text-white hover:bg-neutral-700"}`}
                    title={a.lida ? "Marcar como não lida" : "Marcar como lida"}
                  >
                    <CheckIcon size={20} />
                  </button>
                  <button
                    onClick={() => g(a.id, "respondida", a.respondida)}
                    className={`p-2 rounded-lg transition-colors ${a.respondida ? "text-blue-400 hover:bg-neutral-700" : "text-neutral-400 hover:text-white hover:bg-neutral-700"}`}
                    title={
                      a.respondida
                        ? "Marcar como não respondida"
                        : "Marcar como respondida"
                    }
                  >
                    <ReplyIcon size={20} />
                  </button>
                  <button
                    onClick={() => k(a.id)}
                    className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-red-400 hover:text-red-500"
                    title="Excluir"
                  >
                    <Trash2Icon size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-neutral-900 p-4 rounded-lg text-sm text-neutral-300 whitespace-pre-wrap">
                {a.mensagem}
              </div>
              {a.respostaTexto && (
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-sm text-neutral-300 whitespace-pre-wrap">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-400 mb-2">
                    Sua resposta
                    {a.respostaEnviadaEm?.toDate
                      ? ` — ${a.respostaEnviadaEm.toDate().toLocaleString()}`
                      : ""}
                  </p>
                  {a.respostaTexto}
                </div>
              )}
              {n === a.id ? (
                <div className="space-y-3">
                  <textarea
                    value={p[a.id] || ""}
                    onChange={(S) =>
                      t((y) => ({
                        ...y,
                        [a.id]: S.target.value,
                      }))
                    }
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-palette-yellow min-h-[140px] text-sm resize-y"
                    placeholder="Escreva sua resposta..."
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => f(a)}
                      disabled={o === a.id}
                      className="text-xs bg-palette-yellow text-primary font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {o === a.id ? (
                        <LoaderCircleIcon size={14} className="animate-spin" />
                      ) : (
                        <SendIcon size={14} />
                      )}
                      {o === a.id ? "Enviando..." : "Enviar Resposta"}
                    </button>
                    <button
                      type="button"
                      onClick={() => v(null)}
                      className="text-xs bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => u(a)}
                    className="text-xs bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ReplyIcon size={14} />{" "}
                    {a.respostaTexto ? "Responder novamente" : "Responder"}
                  </button>
                  {a.whatsapp && (
                    <a
                      href={`https://wa.me/${a.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-green-600/20 text-green-400 hover:bg-green-600/30 px-4 py-2 rounded-lg transition-colors"
                    >
                      Responder no WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {s.length === 0 && (
          <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 text-neutral-500">
            Nenhuma mensagem recebida.
          </div>
        )}
      </div>
    </div>
  );
}
