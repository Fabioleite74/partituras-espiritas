import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  ChartColumnIcon,
  CirclePlusIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  HeartIcon,
  LibraryIcon,
  ListMusicIcon,
  LoaderCircleIcon,
  LogOutIcon,
  MailIcon,
  MegaphoneIcon,
  MessageSquareQuoteIcon,
  Music2Icon,
  UsersIcon,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { auth, logout } from "@/lib/firebase";
import { AdminAvisoForm } from "@/pages/admin/AdminAvisoForm";
import { AdminAvisos } from "@/pages/admin/AdminAvisos";
import { AdminBatchAudioUpload } from "@/pages/admin/AdminBatchAudioUpload";
import { AdminBatchUpload } from "@/pages/admin/AdminBatchUpload";
import { AdminDepoimentos } from "@/pages/admin/AdminDepoimentos";
import { AdminFavoritos } from "@/pages/admin/AdminFavoritos";
import { AdminItemForm } from "@/pages/admin/AdminItemForm";
import { AdminMensagens } from "@/pages/admin/AdminMensagens";
import { AdminObras } from "@/pages/admin/AdminObras";
import { AdminPartiturasList } from "@/pages/admin/AdminPartiturasList";
import { AdminRelatorios } from "@/pages/admin/AdminRelatorios";
import { AdminTutoriais } from "@/pages/admin/AdminTutoriais";
import { AdminTutorialForm } from "@/pages/admin/AdminTutorialForm";

export function AdminDashboard() {
  const [s, b] = React.useState(null);
  const [z, C] = React.useState(true);
  const n = useNavigate();
  React.useEffect(() => {
    const v = onAuthStateChanged(auth, (p) => {
      if (!p || p.isAnonymous) {
        n("/admin");
      } else {
        b(p);
      }
      C(false);
    });
    return () => v();
  }, [n]);
  return z ? (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <LoaderCircleIcon className="animate-spin text-white" />
    </div>
  ) : (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <aside className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col">
        <div className="p-6 border-b border-neutral-700">
          <h2 className="text-xl font-bold text-palette-yellow">
            Painel Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <LibraryIcon size={20} />
            {" Acervo"}
          </Link>
          <Link
            to="/admin/dashboard/nova"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <CirclePlusIcon size={20} />
            {" Nova Partitura"}
          </Link>
          <Link
            to="/admin/dashboard/avulsas"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <ListMusicIcon size={20} />
            {" Partituras Avulsas"}
          </Link>
          <Link
            to="/admin/dashboard/coral"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <UsersIcon size={20} />
            {" Partituras para Coral"}
          </Link>
          <Link
            to="/admin/dashboard/arranjos-instrumentais"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <Music2Icon size={20} />
            {" Partituras Instrumentais"}
          </Link>
          <Link
            to="/admin/dashboard/avisos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <MegaphoneIcon size={20} />
            {" Avisos / Banners"}
          </Link>
          <Link
            to="/admin/dashboard/tutoriais"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <GraduationCapIcon size={20} />
            {" Tutoriais"}
          </Link>
          <Link
            to="/admin/dashboard/mensagens"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <MailIcon size={20} />
            {" Mensagens"}
          </Link>
          <Link
            to="/admin/dashboard/depoimentos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <MessageSquareQuoteIcon size={20} />
            {" Depoimentos"}
          </Link>
          <Link
            to="/admin/dashboard/favoritos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <HeartIcon size={20} />
            {" Favoritos"}
          </Link>
          <Link
            to="/admin/dashboard/relatorios"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <ChartColumnIcon size={20} />
            {" Relatórios"}
          </Link>
        </nav>
        <div className="p-4 border-t border-neutral-700 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
          >
            <ExternalLinkIcon size={16} />
            {" Ver como Visitante"}
          </Link>
          <button
            onClick={() => {
              logout();
              n("/admin");
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-sm font-medium"
          >
            <LogOutIcon size={16} />
            {" Sair"}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<AdminObras />} />
          <Route path="/nova" element={<AdminItemForm tipo="obra" />} />
          <Route path="/editar/:id" element={<AdminItemForm tipo="obra" />} />
          <Route path="/avulsas" element={<AdminPartiturasList />} />
          <Route path="/avulsas/lote" element={<AdminBatchUpload />} />
          <Route
            path="/avulsas/lote-audios"
            element={<AdminBatchAudioUpload />}
          />
          <Route
            path="/avulsas/nova"
            element={<AdminItemForm tipo="avulsa" />}
          />
          <Route
            path="/avulsas/editar/:id"
            element={<AdminItemForm tipo="avulsa" />}
          />
          <Route
            path="/coral"
            element={
              <AdminPartiturasList
                categoriaFixa="Coral"
                titulo="Partituras para Coral"
                configId="partituras_coral"
                basePath="coral"
              />
            }
          />
          <Route
            path="/coral/lote"
            element={
              <AdminBatchUpload
                categoriaFixa="Coral"
                basePath="coral"
                tituloSecao="Coral"
              />
            }
          />
          <Route
            path="/coral/nova"
            element={
              <AdminItemForm
                tipo="avulsa"
                categoriaFixa="Coral"
                basePath="coral"
                tituloSecao="Coral"
              />
            }
          />
          <Route
            path="/coral/editar/:id"
            element={
              <AdminItemForm
                tipo="avulsa"
                categoriaFixa="Coral"
                basePath="coral"
                tituloSecao="Coral"
              />
            }
          />
          <Route
            path="/arranjos-instrumentais"
            element={
              <AdminPartiturasList
                categoriaFixa="Arranjos Instrumentais"
                titulo="Partituras Instrumentais"
                configId="partituras_arranjos_instrumentais"
                basePath="arranjos-instrumentais"
              />
            }
          />
          <Route
            path="/arranjos-instrumentais/lote"
            element={
              <AdminBatchUpload
                categoriaFixa="Arranjos Instrumentais"
                basePath="arranjos-instrumentais"
                tituloSecao="Partituras Instrumentais"
              />
            }
          />
          <Route
            path="/arranjos-instrumentais/nova"
            element={
              <AdminItemForm
                tipo="avulsa"
                categoriaFixa="Arranjos Instrumentais"
                basePath="arranjos-instrumentais"
                tituloSecao="Partituras Instrumentais"
              />
            }
          />
          <Route
            path="/arranjos-instrumentais/editar/:id"
            element={
              <AdminItemForm
                tipo="avulsa"
                categoriaFixa="Arranjos Instrumentais"
                basePath="arranjos-instrumentais"
                tituloSecao="Partituras Instrumentais"
              />
            }
          />
          <Route path="/avisos" element={<AdminAvisos />} />
          <Route path="/avisos/novo" element={<AdminAvisoForm />} />
          <Route path="/avisos/editar/:id" element={<AdminAvisoForm />} />
          <Route path="/tutoriais" element={<AdminTutoriais />} />
          <Route path="/tutoriais/novo" element={<AdminTutorialForm />} />
          <Route path="/tutoriais/editar/:id" element={<AdminTutorialForm />} />
          <Route path="/mensagens" element={<AdminMensagens />} />
          <Route path="/depoimentos" element={<AdminDepoimentos />} />
          <Route path="/favoritos" element={<AdminFavoritos />} />
          <Route path="/relatorios" element={<AdminRelatorios />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
