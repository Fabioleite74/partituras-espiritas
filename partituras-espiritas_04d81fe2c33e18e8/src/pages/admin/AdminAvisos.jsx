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
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CirclePlusIcon,
  LoaderCircleIcon,
  MegaphoneIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";

export function AdminAvisos() {
  const [s, b] = React.useState([]);
  const [z, C] = React.useState(true);
  const n = useNavigate();
  React.useEffect(() => {
    (async () => {
      try {
        const o = query(collection(db, "avisos"), orderBy("ordem", "asc"));
        const k = (await getDocs(o)).docs.map((g) => ({
          id: g.id,
          ...g.data(),
        }));
        b(k);
      } catch {
        toast.error("Erro ao buscar avisos.");
      } finally {
        C(false);
      }
    })();
  }, []);
  const v = async (t) => {
    if (window.confirm("Tem certeza que deseja excluir este aviso?")) {
      try {
        await deleteDoc(doc(db, "avisos", t));
        b(s.filter((o) => o.id !== t));
        toast.success("Aviso excluído com sucesso!");
      } catch {
        toast.error("Erro ao excluir aviso.");
      }
    }
  };
  const p = async (t) => {
    try {
      await updateDoc(doc(db, "avisos", t.id), {
        ativo: !t.ativo,
      });
      b(
        s.map((o) =>
          o.id === t.id
            ? {
                ...o,
                ativo: !o.ativo,
              }
            : o,
        ),
      );
      toast.success(`Aviso ${t.ativo ? "desativado" : "ativado"}!`);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Avisos e Publicidade</h1>
        <button
          onClick={() => n("/admin/dashboard/avisos/novo")}
          className="bg-palette-yellow text-primary px-6 py-2 rounded-full font-bold hover:bg-white transition-all flex items-center gap-2"
        >
          <CirclePlusIcon size={20} />
          {" Novo Aviso"}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {s.map((t) => (
          <div
            key={t.id}
            className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 flex items-center gap-6"
          >
            <div
              className={`p-3 rounded-full ${t.ativo ? "bg-green-500/10 text-green-400" : "bg-neutral-700 text-neutral-500"}`}
            >
              <MegaphoneIcon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-lg">{t.titulo}</h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${t.tipo === "banner" ? "bg-blue-500/20 text-blue-400" : t.tipo === "popup" ? "bg-purple-500/20 text-purple-400" : "bg-orange-500/20 text-orange-400"}`}
                >
                  {t.tipo}
                </span>
              </div>
              <p className="text-neutral-400 text-sm line-clamp-1">
                {t.conteudo}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => p(t)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${t.ativo ? "bg-green-500 text-white" : "bg-neutral-700 text-neutral-400"}`}
              >
                {t.ativo ? (
                  <CircleCheckIcon size={14} />
                ) : (
                  <CircleAlertIcon size={14} />
                )}
                {t.ativo ? "Ativo" : "Inativo"}
              </button>
              <button
                type="button"
                onClick={() => n(`/admin/dashboard/avisos/editar/${t.id}`)}
                className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-white"
                aria-label="Editar aviso"
              >
                <SquarePenIcon size={20} />
              </button>
              <button
                type="button"
                onClick={() => v(t.id)}
                className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-red-400 hover:text-red-500"
                aria-label="Excluir aviso"
              >
                <Trash2Icon size={20} />
              </button>
            </div>
          </div>
        ))}
        {s.length === 0 && (
          <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 text-neutral-500">
            Nenhum aviso cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}
