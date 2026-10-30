import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDownIcon,
  GraduationCapIcon,
  HeadphonesIcon,
  HeartIcon,
  HouseIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  Music2Icon,
  MusicIcon,
  SearchIcon,
  SettingsIcon,
  Undo2Icon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import logoMenu from "@/assets/logo-menu.png";
import { ContactForm } from "@/components/ContactForm";
import { CookieConsent } from "@/components/CookieConsent";
import {
  auth,
  completeGoogleRedirect,
  functions,
  logout,
  signInWithGoogle,
} from "@/lib/firebase.js";

function getBackPath(u) {
  const t = u.match(
    /^\/(album|partitura)\/([^/]+)(?:\/(audios|videos|partituras))?$/,
  );
  if (t) {
    const [, e, , s] = t;
    return s
      ? `/${e}/${t[2]}`
      : e === "album"
        ? "/catalog"
        : "/partituras-avulsas";
  }
  return "/";
}

export function Layout() {
  const u = useNavigate();
  const t = useLocation();
  const e = t.pathname === "/";
  const s = () => {
    if (t.key !== "default") {
      u(-1);
    } else {
      u(getBackPath(t.pathname));
    }
  };
  const [i, setI] = React.useState(null);
  const [a, setA] = React.useState(false);
  const [l, setL] = React.useState(false);
  const c = !!i?.email && A.includes(i.email);
  const d = () => {
    signInWithGoogle().catch((_) => {
      console.error("Erro ao iniciar login com Google:", _);
      toast.error(
        `Erro ao iniciar login: ${_?.code || _?.message || "desconhecido"}`,
      );
    });
  };
  const [f] = useSearchParams();
  const [g, setG] = React.useState(false);
  const [A, setA_1] = React.useState("");
  const WRef = React.useRef(null);
  const XRef = React.useRef(null);
  React.useEffect(() => {
    setA_1((e && f.get("q")) || "");
  }, [f, e]);
  React.useEffect(() => {
    const _ = onAuthStateChanged(auth, (P) => {
      setI(P);
    });
    return () => _();
  }, []);
  React.useEffect(() => {
    completeGoogleRedirect()
      .then((_) => {
        if (_) {
          toast.success("Login realizado com sucesso!");
        }
      })
      .catch((_) => {
        console.error("Erro ao concluir login com Google:", _);
        toast.error(
          `Erro ao concluir login: ${_?.code || _?.message || "desconhecido"}`,
        );
      });
  }, []);
  React.useEffect(() => {
    if (!sessionStorage.getItem("ps_visit_counted")) {
      sessionStorage.setItem("ps_visit_counted", "1");
      httpsCallable(functions, "incrementarAcessos")().catch(() => {});
    }
  }, []);
  const S = (_) => {
    setA_1(_);
    u(`/?q=${encodeURIComponent(_)}`, {
      replace: true,
    });
  };
  const E = () => {
    setG(true);
    setTimeout(() => {
      let _;
      if ((_ = (window.innerWidth >= 768 ? WRef : XRef).current) != null) {
        _.focus();
      }
    }, 50);
  };
  const T = () => {
    if (!A) {
      setG(false);
    }
  };
  return (
    <div className="bg-sheet-music min-h-screen flex flex-col text-white font-body selection:bg-palette-yellow selection:text-primary">
      <header
        className={`hidden md:flex h-20 ${e ? "bg-transparent absolute w-full" : "bg-primary/95 backdrop-blur-md border-b border-white/10"} items-center justify-between px-8 top-0 z-50 shadow-sm`}
      >
        <div className="flex items-center gap-6">
          {!e && (
            <button
              onClick={s}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Voltar"
            >
              <Undo2Icon size={24} />
            </button>
          )}
          <h1
            className="flex items-center gap-3 font-title text-2xl tracking-wide cursor-pointer hover:text-palette-yellow transition-colors"
            onClick={() => u("/")}
          >
            <img src={logoMenu} alt="" className="h-[70px] w-[70px]" />
            Partituras Espíritas
          </h1>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => u("/")}
            className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 rounded-full transition-colors font-semibold"
          >
            <HouseIcon size={20} />
            {" Início"}
          </button>
          <div
            className="relative"
            onMouseEnter={() => setL(true)}
            onMouseLeave={() => setL(false)}
          >
            <button
              onClick={() => setL((_) => !_)}
              className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 rounded-full transition-colors font-semibold"
              aria-expanded={l}
              aria-haspopup="true"
            >
              <HeadphonesIcon size={20} />
              {" Acervo"}
              <ChevronDownIcon
                size={16}
                className={`transition-transform ${l ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {l && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                  className="absolute top-full left-0 pt-2 w-56"
                >
                  <div className="bg-primary/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden py-1">
                    <button
                      onClick={() => {
                        u("/catalog");
                        setL(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors font-semibold text-left text-sm"
                    >
                      <HeadphonesIcon size={16} />
                      {" Acervo"}
                    </button>
                    <button
                      onClick={() => {
                        u("/partituras-avulsas");
                        setL(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors font-semibold text-left text-sm"
                    >
                      <MusicIcon size={16} />
                      {" Partituras Avulsas"}
                    </button>
                    <button
                      onClick={() => {
                        u("/coral");
                        setL(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors font-semibold text-left text-sm"
                    >
                      <UsersIcon size={16} />
                      {" Coral"}
                    </button>
                    <button
                      onClick={() => {
                        u("/arranjos-instrumentais");
                        setL(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors font-semibold text-left text-sm"
                    >
                      <Music2Icon size={16} />
                      {" Partituras Instrumentais"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => u("/tutoriais")}
            className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 rounded-full transition-colors font-semibold"
          >
            <GraduationCapIcon size={20} />
            {" Tutoriais"}
          </button>
          <button
            onClick={() => u("/favoritos")}
            className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 rounded-full transition-colors font-semibold"
          >
            <HeartIcon size={20} />
            {" Favoritos"}
          </button>
          <div className="flex items-center">
            <AnimatePresence>
              {g && (
                <motion.input
                  initial={{
                    width: 0,
                    opacity: 0,
                  }}
                  animate={{
                    width: 220,
                    opacity: 1,
                  }}
                  exit={{
                    width: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  ref={WRef}
                  type="text"
                  value={A}
                  onChange={(_) => S(_.target.value)}
                  onBlur={T}
                  placeholder="Buscar por obra, autor..."
                  className="bg-white/10 border border-white/20 rounded-full py-2 px-4 mr-1 outline-none focus:ring-2 focus:ring-palette-yellow text-sm"
                />
              )}
            </AnimatePresence>
            <button
              onClick={() => (g ? setG(false) : E())}
              className="p-2.5 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Buscar"
            >
              <SearchIcon size={20} />
            </button>
          </div>
          {c && (
            <button
              onClick={() => u("/admin/dashboard")}
              className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 rounded-full transition-colors font-semibold text-palette-yellow"
            >
              <SettingsIcon size={20} />
              {" Admin"}
            </button>
          )}
          {i && !i.isAnonymous ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 rounded-full transition-colors font-semibold ml-4 border border-white/20"
            >
              <LogOutIcon size={20} />
              {" Sair"}
            </button>
          ) : (
            <button
              onClick={d}
              className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 rounded-full transition-colors font-semibold ml-4 border border-white/20"
            >
              <LogInIcon size={20} />
              {" Entrar"}
            </button>
          )}
        </nav>
      </header>
      <header
        className={`md:hidden h-16 ${e ? "bg-transparent absolute w-full" : "bg-primary border-b border-white/10"} flex items-center justify-between px-4 top-0 z-50`}
      >
        <div className="flex items-center">
          {!e && (
            <button
              onClick={s}
              className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2"
              aria-label="Voltar"
            >
              <Undo2Icon size={24} />
            </button>
          )}
          <img
            src={logoMenu}
            alt=""
            className="h-[55px] w-[55px] mr-2 shrink-0"
          />
          <h1 className="font-title text-xl truncate">Partituras Espíritas</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => (g ? setG(false) : E())}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Buscar"
          >
            <SearchIcon size={24} />
          </button>
          <button
            onClick={() => setA(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Abrir menu"
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {g && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="md:hidden fixed top-16 inset-x-0 z-40 bg-primary border-b border-white/10 px-4 overflow-hidden"
          >
            <input
              ref={XRef}
              type="text"
              value={A}
              onChange={(_) => S(_.target.value)}
              onBlur={T}
              placeholder="Buscar por obra, autor..."
              className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 px-4 my-3 outline-none focus:ring-2 focus:ring-palette-yellow text-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {a && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setA(false)}
              className="fixed inset-0 bg-black/60 z-[100] md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-neutral-900 z-[101] md:hidden flex flex-col shadow-2xl border-l border-white/10"
            >
              <div className="p-4 flex justify-end border-b border-white/10">
                <button
                  onClick={() => setA(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Fechar menu"
                >
                  <XIcon size={24} />
                </button>
              </div>
              <nav className="flex flex-col p-4 gap-2">
                <button
                  onClick={() => {
                    u("/");
                    setA(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors font-semibold text-left"
                >
                  <HouseIcon size={20} />
                  {" Início"}
                </button>
                <div>
                  <button
                    onClick={() => {
                      u("/catalog");
                      setA(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors font-semibold text-left w-full"
                  >
                    <HeadphonesIcon size={20} />
                    {" Acervo"}
                  </button>
                  <div className="ml-8 flex flex-col gap-1 mt-1">
                    <button
                      onClick={() => {
                        u("/partituras-avulsas");
                        setA(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/80 text-left"
                    >
                      <MusicIcon size={16} />
                      {" Partituras Avulsas"}
                    </button>
                    <button
                      onClick={() => {
                        u("/coral");
                        setA(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/80 text-left"
                    >
                      <UsersIcon size={16} />
                      {" Coral"}
                    </button>
                    <button
                      onClick={() => {
                        u("/arranjos-instrumentais");
                        setA(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/80 text-left"
                    >
                      <Music2Icon size={16} />
                      {" Partituras Instrumentais"}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    u("/tutoriais");
                    setA(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors font-semibold text-left"
                >
                  <GraduationCapIcon size={20} />
                  {" Tutoriais"}
                </button>
                <button
                  onClick={() => {
                    u("/favoritos");
                    setA(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors font-semibold text-left"
                >
                  <HeartIcon size={20} />
                  {" Favoritos"}
                </button>
                {c && (
                  <button
                    onClick={() => {
                      u("/admin/dashboard");
                      setA(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors font-semibold text-palette-yellow text-left"
                  >
                    <SettingsIcon size={20} />
                    {" Admin"}
                  </button>
                )}
                <div className="h-px bg-white/10 my-2" />
                {i && !i.isAnonymous ? (
                  <button
                    onClick={() => {
                      logout();
                      setA(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors font-semibold text-left"
                  >
                    <LogOutIcon size={20} />
                    {" Sair"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      d();
                      setA(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors font-semibold text-left"
                  >
                    <LogInIcon size={20} />
                    {" Entrar"}
                  </button>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <main
        className={`flex-1 flex flex-col ${e ? "pt-20 md:pt-20" : "max-w-7xl w-full mx-auto p-4 md:p-8"} overflow-x-hidden`}
      >
        <Outlet />
      </main>
      <ContactForm />
      <CookieConsent />
      <Toaster position="top-right" />
    </div>
  );
}
