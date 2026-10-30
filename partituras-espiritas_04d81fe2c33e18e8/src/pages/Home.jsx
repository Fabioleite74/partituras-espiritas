import * as React from "react";
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLinkIcon,
  EyeIcon,
  HeartIcon,
  InfoIcon,
  MegaphoneIcon,
  MusicIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BannerCarousel } from "@/components/BannerCarousel";
import { DepoimentosCarousel } from "@/components/DepoimentosCarousel";
import { useFavoritos } from "@/hooks/useFavoritos.js";
import {
  ADMIN_EMAILS,
  OperationType,
  auth,
  db,
  handleFirestoreError,
  sortByOrdem,
} from "@/lib/firebase";
import { getDirectImageUrl } from "@/lib/media.js";

export function Home() {
  const a = useNavigate();
  const [l] = useSearchParams();
  const o = l.get("q") || "";
  const [f, setF] = React.useState([]);
  const [i, setI] = React.useState([]);
  const [n, setN] = React.useState([]);
  const [c, setC] = React.useState([]);
  const [u, setU] = React.useState(true);
  const [N, setN_1] = React.useState(false);
  const [r, setR] = React.useState(null);
  const [v, setV] = React.useState("");
  const [P, setP] = React.useState("");
  const [j, setJ] = React.useState("");
  const [w, setW] = React.useState({
    nome: "",
    texto: "",
    foto: "",
  });
  const [B, setB] = React.useState(false);
  const [W, setW_1] = React.useState(false);
  const [ne, setNe] = React.useState(null);
  const [ce, setCe] = React.useState(null);
  const { isFavorited, toggleFavorite } = useFavoritos();
  React.useEffect(() => {
    const h = auth.onAuthStateChanged((g) => {
      setN_1(!!g?.email && ADMIN_EMAILS.includes(g.email));
    });
    const I = onSnapshot(
      doc(db, "configuracoes", "partituras_avulsas"),
      (g) => {
        setV((g.exists() && g.data().url_imagem) || "");
      },
      (g) => {
        console.error("Erro ao buscar imagem de partituras avulsas:", g);
      },
    );
    const M = onSnapshot(
      doc(db, "configuracoes", "partituras_coral"),
      (g) => {
        setP((g.exists() && g.data().url_imagem) || "");
      },
      (g) => {
        console.error("Erro ao buscar imagem de partituras para coral:", g);
      },
    );
    const Ee = onSnapshot(
      doc(db, "configuracoes", "partituras_arranjos_instrumentais"),
      (g) => {
        setJ((g.exists() && g.data().url_imagem) || "");
      },
      (g) => {
        console.error("Erro ao buscar imagem de arranjos instrumentais:", g);
      },
    );
    const $e = onSnapshot(
      collection(db, "obras_musicais"),
      (g) => {
        const E = sortByOrdem(
          g.docs
            .map((z) => ({
              id: z.id,
              ...z.data(),
            }))
            .filter((z) => z.ativo !== false),
        );
        setF(E);
        setI(E);
        setU(false);
      },
      (g) => {
        handleFirestoreError(g, OperationType.LIST, "obras_musicais");
        setU(false);
      },
    );
    const Te = query(collection(db, "avisos"), where("ativo", "==", true));
    const Le = onSnapshot(Te, (g) => {
      const E = g.docs.map(($) => ({
        id: $.id,
        ...$.data(),
      }));
      E.sort(($, Z) => {
        const de = $.ordem !== undefined ? $.ordem : 9999;
        const X = Z.ordem !== undefined ? Z.ordem : 9999;
        return de - X;
      });
      setN(E);
      const z = E.find(($) => $.tipo === "popup");
      if (z) {
        if (!localStorage.getItem(`popup_${z.id}`)) {
          setR(z);
        }
      }
    });
    const Fe = query(
      collection(db, "depoimentos"),
      where("aprovado", "==", true),
    );
    const De = onSnapshot(
      Fe,
      (g) => {
        const E = g.docs.map((z) => ({
          id: z.id,
          ...z.data(),
        }));
        E.sort((z, $) => {
          const Z = z.createdAt?.toMillis ? z.createdAt.toMillis() : 0;
          return ($.createdAt?.toMillis ? $.createdAt.toMillis() : 0) - Z;
        });
        setC(E);
      },
      (g) => {
        console.error("Erro ao buscar depoimentos:", g);
      },
    );
    (async () => {
      try {
        const [g, E] = await Promise.all([
          getCountFromServer(collection(db, "obras_musicais")),
          getCountFromServer(collection(db, "partituras_avulsas")),
        ]);
        setNe(g.data().count + E.data().count);
      } catch (g) {
        console.error("Erro ao contar partituras:", g);
      }
    })();
    const qe = onSnapshot(
      doc(db, "configuracoes", "estatisticas"),
      (g) => {
        setCe((g.exists() && g.data().acessos) || 0);
      },
      (g) => {
        console.error("Erro ao buscar estatísticas:", g);
      },
    );
    return () => {
      h();
      I();
      M();
      Ee();
      $e();
      Le();
      De();
      qe();
    };
  }, []);
  React.useEffect(() => {
    const h = o.toLowerCase();
    const I = f.filter(
      (M) =>
        M.titulo.toLowerCase().includes(h) ||
        M.autor.toLowerCase().includes(h) ||
        (M.biografia && M.biografia.toLowerCase().includes(h)) ||
        (M.tags && M.tags.toLowerCase().includes(h)),
    );
    setI(I);
  }, [o, f]);
  React.useEffect(() => {
    if (n.some((h) => h.codigo_adsense)) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (h) {
        console.error("AdSense error", h);
      }
    }
  }, [n]);
  const Ie = async (h) => {
    h.preventDefault();
    if (!(!w.nome.trim() || !w.texto.trim())) {
      setB(true);
      try {
        const I = getDirectImageUrl(w.foto.trim());
        await addDoc(collection(db, "depoimentos"), {
          nome: w.nome,
          texto: w.texto,
          ...(I
            ? {
                url_imagem: I,
              }
            : {}),
          aprovado: true,
          createdAt: serverTimestamp(),
        });
        toast.success("Depoimento enviado com sucesso!");
        setW({
          nome: "",
          texto: "",
          foto: "",
        });
        setW_1(false);
      } catch {
        toast.error("Erro ao enviar depoimento.");
      } finally {
        setB(false);
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col gap-8 pb-12">
      {n
        .filter((h) => h.tipo === "texto")
        .map((h) => (
          <div
            key={h.id}
            className="bg-palette-yellow text-primary py-2 px-4 text-center text-sm font-bold flex items-center justify-center gap-2"
          >
            <MegaphoneIcon size={16} />
            <span>{h.conteudo}</span>
            {h.url_link && (
              <a
                href={h.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline flex items-center gap-1"
              >
                {"Saiba mais "}
                <ExternalLinkIcon size={12} />
              </a>
            )}
          </div>
        ))}
      <section className="relative py-12 md:py-20 flex flex-col items-center text-center px-4">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-col justify-center gap-12 -rotate-12 scale-150 overflow-hidden">
          {[...Array(8)].map((h, I) => (
            <div key={I} className="w-full h-[2px] bg-white" />
          ))}
        </div>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="z-10 w-full"
        >
          <BannerCarousel banners={n.filter((h) => h.tipo === "banner")} />
        </motion.div>
      </section>
      <section className="px-4">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4 md:gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl py-6 px-4 flex flex-col items-center text-center backdrop-blur-md">
            <MusicIcon size={24} className="text-palette-yellow mb-2" />
            <span className="font-title text-3xl md:text-5xl">
              {ne !== null ? ne.toLocaleString("pt-BR") : "—"}
            </span>
            <span className="text-white/70 text-sm md:text-base mt-1">
              Partituras Cadastradas
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl py-6 px-4 flex flex-col items-center text-center backdrop-blur-md">
            <EyeIcon size={24} className="text-palette-yellow mb-2" />
            <span className="font-title text-3xl md:text-5xl">
              {ce !== null ? ce.toLocaleString("pt-BR") : "—"}
            </span>
            <span className="text-white/70 text-sm md:text-base mt-1">
              Acessos ao Portal
            </span>
          </div>
        </div>
      </section>
      <section className="px-4">
        {u ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palette-yellow" />
          </div>
        ) : i.length === 0 ? (
          <div className="text-center py-20 text-white/50">
            <p className="text-xl">Nenhuma obra encontrada para sua busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {i.map((h) => (
              <motion.div
                key={h.id}
                layout
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                whileHover={{
                  y: -5,
                }}
                onClick={() => a(`/album/${h.id}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl mb-3 border-2 border-transparent group-hover:border-palette-yellow transition-all relative">
                  <img
                    src={getDirectImageUrl(h.url_foto_capa)}
                    alt={h.titulo}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-bold text-palette-yellow flex items-center gap-1">
                      <InfoIcon size={14} />
                      {" Ver Detalhes"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(I) => {
                      I.stopPropagation();
                      toggleFavorite({
                        id: h.id,
                        tipo: "obra",
                        titulo: h.titulo,
                        autor: h.autor,
                        url_foto_capa: h.url_foto_capa,
                      });
                    }}
                    className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-sm transition-colors ${isFavorited(h.id) ? "bg-palette-yellow text-primary" : "bg-black/40 text-white hover:bg-black/60"}`}
                    aria-label={
                      isFavorited(h.id)
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                  >
                    <HeartIcon
                      size={16}
                      fill={isFavorited(h.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <h3 className="font-bold text-sm md:text-base group-hover:text-palette-yellow transition-colors line-clamp-1">
                  {h.titulo}
                </h3>
                <p className="text-xs md:text-sm text-white/60 line-clamp-1">
                  {h.autor}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      {(v || P || j) && (
        <section className="px-4 flex flex-wrap gap-4 md:gap-6 justify-start">
          {v && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              whileHover={{
                y: -5,
              }}
              onClick={() => a("/partituras-avulsas")}
              className="cursor-pointer group w-40 sm:w-48 md:w-56"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-transparent group-hover:border-palette-yellow transition-all relative">
                <img
                  src={v}
                  alt="Partituras Avulsas"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-bold text-palette-yellow flex items-center gap-1">
                    <InfoIcon size={14} />
                    {" Partituras Avulsas"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          {P && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              whileHover={{
                y: -5,
              }}
              onClick={() => a("/coral")}
              className="cursor-pointer group w-40 sm:w-48 md:w-56"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-transparent group-hover:border-palette-yellow transition-all relative">
                <img
                  src={P}
                  alt="Partituras para Coral"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-bold text-palette-yellow flex items-center gap-1">
                    <InfoIcon size={14} />
                    {" Partituras para Coral"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          {j && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              whileHover={{
                y: -5,
              }}
              onClick={() => a("/arranjos-instrumentais")}
              className="cursor-pointer group w-40 sm:w-48 md:w-56"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-transparent group-hover:border-palette-yellow transition-all relative">
                <img
                  src={j}
                  alt="Partituras Instrumentais"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-bold text-palette-yellow flex items-center gap-1">
                    <InfoIcon size={14} />
                    {" Partituras Instrumentais"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </section>
      )}
      <section className="px-4 py-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10 flex flex-col items-center">
          <h2 className="font-title text-3xl md:text-5xl mb-4 text-palette-yellow">
            Depoimentos
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            O que dizem sobre o nosso acervo.
          </p>
          <button
            onClick={() => setW_1(true)}
            className="bg-palette-yellow text-primary font-bold py-3 px-8 rounded-full hover:bg-white transition-colors shadow-lg"
          >
            Deixe seu depoimento
          </button>
        </div>
        {c.length === 0 ? (
          <div className="text-center py-12 text-white/40 bg-white/5 rounded-2xl border border-white/10 max-w-3xl mx-auto">
            Seja o primeiro a deixar um depoimento!
          </div>
        ) : (
          <DepoimentosCarousel depoimentos={c} />
        )}
      </section>
      <AnimatePresence>
        {W && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              className="bg-neutral-900 border border-white/10 rounded-[2.5rem] overflow-hidden max-w-lg w-full shadow-2xl relative p-8"
            >
              <button
                onClick={() => setW_1(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                aria-label="Fechar"
              >
                <XIcon size={20} />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-palette-yellow">
                Deixe seu depoimento
              </h3>
              <form onSubmit={Ie} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={w.nome}
                    onChange={(h) =>
                      setW({
                        ...w,
                        nome: h.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-palette-yellow transition-all"
                    placeholder="Como gostaria de ser chamado?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Seu Depoimento
                  </label>
                  <textarea
                    value={w.texto}
                    onChange={(h) =>
                      setW({
                        ...w,
                        texto: h.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-palette-yellow transition-all min-h-[120px] resize-none"
                    placeholder="Compartilhe sua experiência com o nosso acervo..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Link da sua foto (opcional)
                  </label>
                  <input
                    type="url"
                    value={w.foto}
                    onChange={(h) =>
                      setW({
                        ...w,
                        foto: h.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-palette-yellow transition-all"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-white/40 mt-2">
                    Se não enviar uma foto, usaremos um avatar padrão.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={B}
                  className="w-full bg-palette-yellow text-primary font-bold py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
                >
                  {B ? "Enviando..." : "Enviar Depoimento"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {N && (
        <div className="fixed bottom-24 right-8 z-40">
          <button
            type="button"
            onClick={() => a("/admin/dashboard")}
            className="bg-palette-yellow text-primary p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold"
            aria-label="Painel Admin"
          >
            <SettingsIcon size={24} />
          </button>
        </div>
      )}
      <AnimatePresence>
        {r && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              className="bg-neutral-900 border border-white/10 rounded-[2.5rem] overflow-hidden max-w-lg w-full shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(`popup_${r.id}`, "true");
                  setR(null);
                }}
                className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors z-10"
                aria-label="Fechar"
              >
                <XIcon size={24} />
              </button>
              {r.url_imagem && (
                <div className="aspect-video w-full">
                  <img
                    src={r.url_imagem}
                    alt={r.titulo}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="p-10 text-center">
                <h2 className="text-3xl font-bold mb-4 text-palette-yellow">
                  {r.titulo}
                </h2>
                <p className="text-white/70 mb-8 leading-relaxed">
                  {r.conteudo}
                </p>
                {r.codigo_adsense && (
                  <div
                    className="mb-8 w-full overflow-hidden flex justify-center"
                    dangerouslySetInnerHTML={{
                      __html: r.codigo_adsense,
                    }}
                  />
                )}
                <div className="flex flex-col gap-3">
                  {r.url_link && (
                    <a
                      href={r.url_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-palette-yellow text-primary font-bold py-4 rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      {"Saber Mais "}
                      <ExternalLinkIcon size={20} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem(`popup_${r.id}`, "true");
                      setR(null);
                    }}
                    className="text-white/40 hover:text-white transition-colors py-2"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
