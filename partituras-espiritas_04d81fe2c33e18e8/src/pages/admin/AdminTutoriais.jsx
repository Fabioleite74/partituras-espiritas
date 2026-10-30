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
  GraduationCapIcon,
  LoaderCircleIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { getDirectImageUrl } from "@/lib/media.js";

export function AdminTutoriais() {
  const [s, b] = React.useState([]);
  const [z, C] = React.useState(true);
  const n = useNavigate();
  React.useEffect(() => {
    (async () => {
      try {
        const o = query(collection(db, "tutoriais"), orderBy("ordem", "asc"));
        const k = (await getDocs(o)).docs.map((g) => ({
          id: g.id,
          ...g.data(),
        }));
        b(k);
      } catch {
        toast.error("Erro ao buscar tutoriais.");
      } finally {
        C(false);
      }
    })();
  }, []);
  const v = async (t) => {
    if (window.confirm("Tem certeza que deseja excluir este tutorial?")) {
      try {
        await deleteDoc(doc(db, "tutoriais", t));
        b(s.filter((o) => o.id !== t));
        toast.success("Tutorial excluído com sucesso!");
      } catch {
        toast.error("Erro ao excluir tutorial.");
      }
    }
  };
  const p = async (t) => {
    try {
      await updateDoc(doc(db, "tutoriais", t.id), {
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
      toast.success(`Tutorial ${t.ativo ? "desativado" : "ativado"}!`);
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
        <h1 className="text-3xl font-bold">Tutoriais</h1>
        <button
          onClick={() => n("/admin/dashboard/tutoriais/novo")}
          className="bg-palette-yellow text-primary px-6 py-2 rounded-full font-bold hover:bg-white transition-all flex items-center gap-2"
        >
          <CirclePlusIcon size={20} />
          {" Novo Tutorial"}
        </button>
      </div>
      <p className="text-sm text-neutral-500">
        A ordem aqui é a mesma exibida na vitrine de tutoriais do site.
      </p>
      <div className="grid grid-cols-1 gap-4">
        {s.map((t) => (
          <div
            key={t.id}
            className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 flex items-center gap-6"
          >
            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-neutral-700 flex items-center justify-center">
              {t.url_capa ? (
                <img
                  src={getDirectImageUrl(t.url_capa)}
                  alt={t.titulo}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <GraduationCapIcon size={28} className="text-neutral-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{t.titulo}</h3>
              <p className="text-neutral-400 text-sm line-clamp-1">
                {t.descricao || t.url_playlist}
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
                onClick={() => n(`/admin/dashboard/tutoriais/editar/${t.id}`)}
                className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-white"
                aria-label="Editar tutorial"
              >
                <SquarePenIcon size={20} />
              </button>
              <button
                type="button"
                onClick={() => v(t.id)}
                className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-red-400 hover:text-red-500"
                aria-label="Excluir tutorial"
              >
                <Trash2Icon size={20} />
              </button>
            </div>
          </div>
        ))}
        {s.length === 0 && (
          <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 text-neutral-500">
            Nenhum tutorial cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}
