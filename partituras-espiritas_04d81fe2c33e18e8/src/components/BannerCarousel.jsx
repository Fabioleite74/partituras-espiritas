import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react";

const BANNER_INTERVAL_MS = 6000;

export function BannerCarousel({ banners }) {
  const [l, setL] = React.useState(0);
  const [f, setF] = React.useState(false);
  const { length } = banners;
  React.useEffect(() => {
    if (l >= length) {
      setL(0);
    }
  }, [length, l]);
  React.useEffect(() => {
    if (length <= 1 || f) {
      return;
    }
    const c = setInterval(() => {
      setL((d) => (d + 1) % length);
    }, BANNER_INTERVAL_MS);
    return () => clearInterval(c);
  }, [length, f]);
  if (length === 0) {
    return null;
  }
  const m = (c) => setL(((c % length) + length) % length);
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
  const x = banners[l];
  return (
    <div
      className="relative mb-12 max-w-7xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md"
      onMouseEnter={() => setF(true)}
      onMouseLeave={() => setF(false)}
    >
      <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9]">
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
            className="absolute inset-0"
          >
            {x.url_imagem ? (
              <img
                src={x.url_imagem}
                alt={x.titulo}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-primary" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-10 lg:p-12 text-left">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1.5 sm:mb-2 text-palette-yellow drop-shadow-md">
                {x.titulo}
              </h2>
              <p className="text-white/90 mb-3 sm:mb-4 max-w-2xl lg:max-w-3xl drop-shadow-md text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3">
                {x.conteudo}
              </p>
              {x.codigo_adsense && (
                <div
                  className="mb-4 w-full overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: x.codigo_adsense,
                  }}
                />
              )}
              {x.url_link && (
                <a
                  href={x.url_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-palette-yellow text-primary font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-xl hover:bg-white transition-all w-fit text-sm sm:text-base"
                >
                  {"Ver Detalhes "}
                  <ExternalLinkIcon size={16} className="sm:hidden" />
                  <ExternalLinkIcon size={18} className="hidden sm:block" />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        {length > 1 && (
          <>
            <button
              type="button"
              onClick={() => m(l - 1)}
              aria-label="Banner anterior"
              className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 sm:p-2 transition-colors"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <button
              type="button"
              onClick={() => m(l + 1)}
              aria-label="Próximo banner"
              className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 sm:p-2 transition-colors"
            >
              <ChevronRightIcon size={20} />
            </button>
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {banners.map((c, d) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => m(d)}
                  aria-label={`Ir para o banner ${d + 1}`}
                  className={`h-2 rounded-full transition-all ${d === l ? "w-6 bg-palette-yellow" : "w-2 bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
