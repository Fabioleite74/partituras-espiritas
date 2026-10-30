import * as React from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { LoaderCircleIcon, SendIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import logoBranca from "@/assets/logo-branca.png";
import { db } from "@/lib/firebase.js";

export function ContactForm() {
  const [u, setU] = React.useState({
    nome: "",
    email: "",
    whatsapp: "",
    mensagem: "",
  });
  const [e, setE] = React.useState(false);
  const i = async (r) => {
    r.preventDefault();
    setE(true);
    try {
      await addDoc(collection(db, "mensagens"), {
        ...u,
        lida: false,
        respondida: false,
        createdAt: serverTimestamp(),
      });
      toast.success("Mensagem enviada com sucesso!");
      setU({
        nome: "",
        email: "",
        whatsapp: "",
        mensagem: "",
      });
    } catch {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setE(false);
    }
  };
  return (
    <footer className="bg-neutral-900 border-t border-white/10 py-12 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <h3 className="flex items-center gap-3 font-title text-2xl text-palette-yellow">
            <img src={logoBranca} alt="" className="h-8 w-8" />
            Partituras Espíritas
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Um projeto dedicado à preservação e disseminação da música espírita
            de qualidade.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-lg">Links Rápidos</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-palette-yellow transition-colors"
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                to="/catalog"
                className="hover:text-palette-yellow transition-colors"
              >
                Acervo
              </Link>
            </li>
            <li>
              <Link
                to="/partituras-avulsas"
                className="hover:text-palette-yellow transition-colors"
              >
                Partituras Avulsas
              </Link>
            </li>
            <li>
              <Link
                to="/tutoriais"
                className="hover:text-palette-yellow transition-colors"
              >
                Tutoriais
              </Link>
            </li>
            <li>
              <Link
                to="/favoritos"
                className="hover:text-palette-yellow transition-colors"
              >
                Favoritos
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-palette-yellow transition-colors"
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-palette-yellow transition-colors"
              >
                Termos de Uso
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-lg">Contato</h4>
          <form onSubmit={i} className="space-y-3">
            <input
              type="text"
              placeholder="Seu Nome"
              required
              value={u.nome}
              onChange={(r) =>
                setU({
                  ...u,
                  nome: r.target.value,
                })
              }
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-palette-yellow outline-none"
            />
            <input
              type="email"
              placeholder="Seu E-mail"
              required
              value={u.email}
              onChange={(r) =>
                setU({
                  ...u,
                  email: r.target.value,
                })
              }
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-palette-yellow outline-none"
            />
            <input
              type="tel"
              placeholder="WhatsApp (opcional)"
              value={u.whatsapp}
              onChange={(r) =>
                setU({
                  ...u,
                  whatsapp: r.target.value,
                })
              }
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-palette-yellow outline-none"
            />
            <textarea
              placeholder="Sua Mensagem"
              required
              value={u.mensagem}
              onChange={(r) =>
                setU({
                  ...u,
                  mensagem: r.target.value,
                })
              }
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-palette-yellow outline-none min-h-[80px]"
            />
            <button
              type="submit"
              disabled={e}
              className="w-full bg-palette-yellow text-primary font-bold py-2 rounded-lg text-sm hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {e ? (
                <LoaderCircleIcon size={16} className="animate-spin" />
              ) : (
                <>
                  <SendIcon size={16} />
                  {" Enviar Mensagem"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-white/40 text-xs">
        <p>
          {"© "}
          {new Date().getFullYear()}
          {" Partituras Espíritas. Todos os direitos reservados."}
        </p>
      </div>
    </footer>
  );
}
