import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from "lucide-react";

function DefaultAvatar({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0 rounded-full"
      role="img"
      aria-label="Avatar padrão"
    >
      <circle cx="50" cy="50" r="50" fill="#6C7BC9" />
      <circle cx="50" cy="38" r="16" fill="#C9CFEF" />
      <path d="M18 90c0-19.9 14.3-32 32-32s32 12.1 32 32" fill="#C9CFEF" />
      <text
        x="50"
        y="45"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="#333a7a"
        fontFamily="system-ui, sans-serif"
      >
        ?
      </text>
    </svg>
  );
}

const DEPOIMENTO_INTERVAL_MS = 7000;

export function DepoimentosCarousel({ depoimentos }) {
  const [l, setL] = React.useState(0);
  const [f, setF] = React.useState(false);
  const { length } = depoimentos;
  React.useEffect(() => {
    if (l >= length) {
      setL(0);
    }
  }, [length, l]);
  React.useEffect(() => {
    if (length <= 1 || f) {
      return;
    }
    const d = setInterval(() => {
      setL((u) => (u + 1) % length);
    }, DEPOIMENTO_INTERVAL_MS);
    return () => clearInterval(d);
  }, [length, f]);
  if (length === 0) {
    return null;
  }
  const m = (d) => setL(((d % length) + length) % length);
  const n = {
    enter: {
      x: "-100%",
      opacity: 0,
    },
    center: {
      x: "0%",
      opacity: 1,
    },
    exit: {
      x: "100%",
      opacity: 0,
    },
  };
  const x = depoimentos[l];
  return (
    <div
      className="relative max-w-3xl mx-auto"
      onMouseEnter={() => setF(true)}
      onMouseLeave={() => setF(false)}
    >
      <div className="relative">
        <div className="relative overflow-hidden rounded-3xl">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={x.id}
              variants={n}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: {
                  type: "tween",
                  duration: 0.6,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.4,
                },
              }}
            >
              <div className="relative bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl px-6 pt-10 pb-8 md:px-14 md:pt-14 md:pb-10">
                <QuoteIcon
                  size={36}
                  className="absolute top-5 right-5 md:top-8 md:right-8 text-palette-yellow/60 shrink-0"
                />
                <p className="text-center text-white/90 text-sm md:text-lg leading-relaxed line-clamp-6 min-h-[3em]">
                  "{x.texto}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={x.id}
            variants={n}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {
                type: "tween",
                duration: 0.6,
                ease: "easeInOut",
              },
              opacity: {
                duration: 0.4,
              },
            }}
            className="absolute left-6 md:left-10 bottom-0 translate-y-1/2 z-10 flex items-center gap-3"
          >
            {x.url_imagem ? (
              <img
                src={x.url_imagem}
                alt={x.nome}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-4 border-primary shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="border-4 border-primary rounded-full shrink-0">
                <DefaultAvatar size={56} />
              </div>
            )}
            <div>
              <p className="font-bold text-sm md:text-base drop-shadow-md">
                {x.nome}
              </p>
              <p className="text-xs text-white/50">
                {x.createdAt?.toDate
                  ? x.createdAt.toDate().toLocaleDateString("pt-BR")
                  : ""}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
        {length > 1 && (
          <>
            <button
              type="button"
              onClick={() => m(l - 1)}
              aria-label="Depoimento anterior"
              className="absolute -left-3 md:-left-12 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <button
              type="button"
              onClick={() => m(l + 1)}
              aria-label="Próximo depoimento"
              className="absolute -right-3 md:-right-12 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
            >
              <ChevronRightIcon size={20} />
            </button>
          </>
        )}
      </div>
      <div className="h-10 md:h-12" aria-hidden="true" />
      {length > 1 && (
        <div className="flex justify-center gap-2">
          {depoimentos.map((d, u) => (
            <button
              key={d.id}
              type="button"
              onClick={() => m(u)}
              aria-label={`Ir para o depoimento ${u + 1}`}
              className={`h-2 rounded-full transition-all ${u === l ? "w-6 bg-palette-yellow" : "w-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
