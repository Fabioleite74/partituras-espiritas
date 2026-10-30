import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon, LoaderCircleIcon, MailIcon, XIcon } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  auth,
  completeGoogleRedirect,
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/firebase";

export function AdminLogin() {
  const [s, b] = React.useState(false);
  const [z, C] = React.useState(false);
  const [n, v] = React.useState("");
  const [p, t] = React.useState("");
  const o = useNavigate();
  React.useEffect(() => {
    const g = onAuthStateChanged(auth, (u) => {
      if (u && !u.isAnonymous) {
        o("/admin/dashboard");
      }
    });
    return () => g();
  }, [o]);
  React.useEffect(() => {
    completeGoogleRedirect().catch((g) => {
      console.error("Erro ao concluir login com Google:", g);
      toast.error(
        `Erro ao concluir login: ${g?.code || g?.message || "desconhecido"}`,
      );
    });
  }, []);
  const w = async () => {
    b(true);
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Erro ao fazer login com Google.");
      b(false);
    }
  };
  const k = async (g) => {
    g.preventDefault();
    b(true);
    try {
      await signInWithEmail(n, p);
      toast.success("Login realizado com sucesso!");
      o("/admin/dashboard");
    } catch {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      b(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 p-4">
      <button
        onClick={() => o("/")}
        className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeftIcon size={20} />
        {" Voltar para o site"}
      </button>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="bg-neutral-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-neutral-700 text-center"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin</h1>
          <p className="text-neutral-400">Repositório de Partituras</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={w}
            disabled={s}
            className="w-full bg-white hover:bg-gray-100 text-neutral-900 font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {s ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </>
            )}
          </button>
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-neutral-700" />
            <span className="flex-shrink-0 mx-4 text-neutral-500 text-sm">
              ou
            </span>
            <div className="flex-grow border-t border-neutral-700" />
          </div>
          <button
            onClick={() => C(true)}
            disabled={s}
            className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <MailIcon size={20} />
            Entrar com E-mail
          </button>
        </div>
      </motion.div>
      <AnimatePresence>
        {z && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              className="bg-neutral-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-neutral-700 relative"
            >
              <button
                type="button"
                onClick={() => C(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <XIcon size={24} />
              </button>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Login com E-mail
                </h2>
                <p className="text-neutral-400 text-sm">
                  Insira suas credenciais de administrador
                </p>
              </div>
              <form onSubmit={k} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={n}
                    onChange={(g) => v(g.target.value)}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-palette-yellow focus:border-transparent outline-none transition-all"
                    placeholder="admin@exemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={p}
                    onChange={(g) => t(g.target.value)}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-palette-yellow focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={s}
                  className="w-full bg-palette-yellow hover:bg-white text-primary font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                >
                  {s ? <LoaderCircleIcon className="animate-spin" /> : "Entrar"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Toaster position="top-right" />
    </div>
  );
}
