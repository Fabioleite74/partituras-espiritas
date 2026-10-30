import * as React from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  CirclePlusIcon,
  GripVerticalIcon,
  LoaderCircleIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { db, sortByOrdem } from "@/lib/firebase";
import { getDirectImageUrl } from "@/lib/media.js";

export function AdminObras() {
  const [s, b] = React.useState([]);
  const [z, C] = React.useState(true);
  const [n, v] = React.useState(null);
  const [p, t] = React.useState(null);
  const o = useNavigate();
  React.useEffect(() => {
    (async () => {
      try {
        const a = (await getDocs(collection(db, "obras_musicais"))).docs.map(
          (i) => ({
            id: i.id,
            ...i.data(),
          }),
        );
        b(sortByOrdem(a));
      } catch {
        toast.error("Erro ao buscar obras.");
      } finally {
        C(false);
      }
    })();
  }, []);
  const w = async (u) => {
    if (window.confirm("Tem certeza que deseja excluir esta obra?")) {
      try {
        await deleteDoc(doc(db, "obras_musicais", u));
        b(s.filter((f) => f.id !== u));
        toast.success("Obra excluída com sucesso!");
      } catch {
        toast.error("Erro ao excluir obra.");
      }
    }
  };
  const k = () => {
    v(null);
    t(null);
  };
  const g = async (u) => {
    if (n === null || n === u) {
      k();
      return;
    }
    const f = [...s];
    const [a] = f.splice(n, 1);
    f.splice(u, 0, a);
    b(f);
    k();
    try {
      const i = writeBatch(db);
      f.forEach((x, S) => {
        i.update(doc(db, "obras_musicais", x.id), {
          ordem: S,
        });
      });
      await i.commit();
    } catch {
      toast.error("Erro ao salvar nova ordem.");
    }
  };
  return z ? (
    <div className="flex justify-center py-12">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Acervo Musical</h1>
        <button
          onClick={() => o("/admin/dashboard/nova")}
          className="bg-palette-yellow text-primary px-6 py-2 rounded-full font-bold hover:bg-white transition-all flex items-center gap-2"
        >
          <CirclePlusIcon size={20} />
          {" Nova Obra"}
        </button>
      </div>
      <p className="text-sm text-neutral-500">
        Arraste os cards para reordenar o acervo. A ordem aqui é a mesma exibida
        no site.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {s.map((u, f) => (
          <motion.div
            key={u.id}
            layout
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: n === f ? 0.4 : 1,
            }}
            draggable
            onDragStart={() => v(f)}
            onDragOver={(a) => {
              a.preventDefault();
              t(f);
            }}
            onDrop={() => g(f)}
            onDragEnd={k}
            className={`bg-neutral-800 rounded-xl overflow-hidden border group cursor-grab active:cursor-grabbing transition-colors ${p === f && n !== null && n !== f ? "border-palette-yellow" : "border-neutral-700"}`}
          >
            <div className="aspect-[3/4] relative overflow-hidden">
              <div className="absolute top-2 left-2 z-10 p-1.5 bg-black/50 rounded-lg text-white/70 pointer-events-none">
                <GripVerticalIcon size={16} />
              </div>
              {u.ativo === false && (
                <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-amber-500/90 rounded-lg text-white text-[10px] font-bold uppercase tracking-wide pointer-events-none">
                  Rascunho
                </div>
              )}
              <img
                src={getDirectImageUrl(u.url_foto_capa)}
                alt={u.titulo}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => o(`/admin/dashboard/editar/${u.id}`)}
                  className="p-3 bg-white text-primary rounded-full hover:bg-palette-yellow transition-colors"
                  aria-label="Editar obra"
                >
                  <SquarePenIcon size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => w(u.id)}
                  className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  aria-label="Excluir obra"
                >
                  <Trash2Icon size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{u.titulo}</h3>
              <p className="text-neutral-400 text-sm truncate">{u.autor}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
