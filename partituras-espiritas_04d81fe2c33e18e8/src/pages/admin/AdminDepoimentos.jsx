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
import { CheckIcon, LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";

export function AdminDepoimentos() {
  const [s, b] = React.useState([]);
  const [z, C] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      try {
        const t = query(
          collection(db, "depoimentos"),
          orderBy("createdAt", "desc"),
        );
        const w = (await getDocs(t)).docs.map((k) => ({
          id: k.id,
          ...k.data(),
        }));
        b(w);
      } catch {
        toast.error("Erro ao buscar depoimentos.");
      } finally {
        C(false);
      }
    })();
  }, []);
  const n = async (p) => {
    if (window.confirm("Tem certeza que deseja excluir este depoimento?")) {
      try {
        await deleteDoc(doc(db, "depoimentos", p));
        b(s.filter((t) => t.id !== p));
        toast.success("Depoimento excluído!");
      } catch {
        toast.error("Erro ao excluir depoimento.");
      }
    }
  };
  const v = async (p, t) => {
    try {
      await updateDoc(doc(db, "depoimentos", p), {
        aprovado: !t,
      });
      b(
        s.map((o) =>
          o.id === p
            ? {
                ...o,
                aprovado: !t,
              }
            : o,
        ),
      );
      toast.success(`Depoimento ${t ? "ocultado" : "aprovado"}!`);
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };
  return z ? (
    <div className="flex justify-center py-12">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  ) : (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Depoimentos</h1>
      <div className="grid grid-cols-1 gap-4">
        {s.map((p) => {
          return (
            <div
              key={p.id}
              className={`p-6 rounded-xl border flex flex-col gap-4 transition-colors ${p.aprovado ? "bg-neutral-800 border-neutral-700" : "bg-neutral-800/80 border-red-500/30"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {p.url_imagem ? (
                    <img
                      src={p.url_imagem}
                      alt={p.nome}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-400 font-bold text-sm">
                      {p.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {p.nome}
                      {!p.aprovado && (
                        <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                          Pendente
                        </span>
                      )}
                      {p.aprovado && (
                        <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                          Aprovado
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      {p.createdAt?.toDate
                        ? p.createdAt.toDate().toLocaleString()
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => v(p.id, p.aprovado)}
                    className={`p-2 rounded-lg transition-colors ${p.aprovado ? "text-green-400 hover:bg-neutral-700" : "text-neutral-400 hover:text-white hover:bg-neutral-700"}`}
                    title={
                      p.aprovado ? "Ocultar depoimento" : "Aprovar depoimento"
                    }
                  >
                    <CheckIcon size={20} />
                  </button>
                  <button
                    onClick={() => n(p.id)}
                    className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-red-400 hover:text-red-500"
                    title="Excluir"
                  >
                    <Trash2Icon size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-neutral-900 p-4 rounded-lg text-sm text-neutral-300 italic">
                "{p.texto}"
              </div>
            </div>
          );
        })}
        {s.length === 0 && (
          <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 text-neutral-500">
            Nenhum depoimento recebido.
          </div>
        )}
      </div>
    </div>
  );
}
