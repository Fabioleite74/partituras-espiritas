import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  LoaderCircleIcon,
  MaximizeIcon,
  MinimizeIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

async function resolvePdfOutline(u, t) {
  let i;
  const e = [];
  for (const a of t) {
    let o = null;
    try {
      let a_dest = a.dest;
      if (typeof a_dest == "string") {
        a_dest = await u.getDestination(a_dest);
      }
      if (Array.isArray(a_dest) && a_dest[0] != null) {
        const [c] = a_dest;
        o = typeof c == "number" ? c + 1 : (await u.getPageIndex(c)) + 1;
      }
    } catch (h) {
      console.error(`Erro ao resolver item "${a.title}" do sumário do PDF:`, h);
    }
    const l = a.items?.length ? await resolvePdfOutline(u, a.items) : [];
    if (((i = a.title) != null && i.trim()) || l.length > 0) {
      e.push({
        title: a.title?.trim() || "Sem título",
        page: o,
        items: l,
      });
    }
  }
  return e;
}

function PdfOutline({ items, currentPage, onSelect, depth = 0 }) {
  return (
    <ul>
      {items.map((i, r) => (
        <li key={r}>
          <button
            type="button"
            onClick={() => i.page != null && onSelect(i.page)}
            disabled={i.page == null}
            style={{
              paddingLeft: `${12 + depth * 16}px`,
            }}
            className={`w-full text-left py-2 pr-3 text-sm transition-colors disabled:opacity-40 disabled:cursor-default ${i.page === currentPage ? "text-palette-yellow font-semibold bg-white/5" : "text-neutral-300 hover:text-white hover:bg-white/5"}`}
          >
            {i.title}
          </button>
          {i.items.length > 0 && (
            <PdfOutline
              items={i.items}
              currentPage={currentPage}
              onSelect={onSelect}
              depth={depth + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export function PdfViewer({ url }) {
  const TRef = React.useRef(null);
  const ERef = React.useRef(null);
  const SRef = React.useRef(null);
  const IRef = React.useRef([]);
  const RRef = React.useRef([]);
  const ARef = React.useRef([]);
  const ORef = React.useRef({});
  const LRef = React.useRef({});
  const HRef = React.useRef(new Set());
  const CRef = React.useRef(1.2);
  const DRef = React.useRef(1);
  const [f, setF] = React.useState(true);
  const [y, setY] = React.useState("");
  const [v, setV] = React.useState(0);
  const [x, setX] = React.useState([]);
  const [E, setE] = React.useState(1);
  const [_, set] = React.useState("1");
  const [M, setM] = React.useState(1.2);
  const [L, setL] = React.useState([]);
  const [J, setJ] = React.useState(true);
  const [Z, setZ] = React.useState(false);
  React.useEffect(() => {
    CRef.current = M;
  }, [M]);
  const N = async (z, ct) => {
    let Bh;
    const W = IRef.current[z];
    const $ = ARef.current[z];
    if (!W || !$ || ORef.current[z] === ct) {
      return;
    }
    const at = W.getViewport({
      scale: ct,
    });
    const Zs = $.getContext("2d");
    if (!Zs) {
      return;
    }
    const Jr = window.devicePixelRatio || 1;
    $.width = Math.floor(at.width * Jr);
    $.height = Math.floor(at.height * Jr);
    $.style.width = `${Math.floor(at.width)}px`;
    $.style.height = `${Math.floor(at.height)}px`;
    const Oh = Jr !== 1 ? [Jr, 0, 0, Jr, 0, 0] : undefined;
    if ((Bh = LRef.current[z]) != null) {
      Bh.cancel();
    }
    const Yo = W.render({
      canvas: $,
      canvasContext: Zs,
      viewport: at,
      transform: Oh,
    });
    LRef.current[z] = Yo;
    ORef.current[z] = ct;
    try {
      await Yo.promise;
    } catch (Ko) {
      if (Ko?.name !== "RenderingCancelledException") {
        console.error(`Erro ao renderizar página ${z + 1}:`, Ko);
        delete ORef.current[z];
      }
    }
  };
  const U = (z, ct = true) => {
    const e_current = ERef.current;
    const $ = RRef.current[z];
    if (!e_current || !$) {
      return;
    }
    const at =
      $.getBoundingClientRect().top -
      e_current.getBoundingClientRect().top +
      e_current.scrollTop;
    e_current.scrollTo({
      top: at,
      behavior: ct ? "smooth" : "auto",
    });
  };
  const _t = (z, ct = true) => {
    const W = SRef.current?.numPages ?? v ?? z;
    const $ = Math.min(Math.max(1, z), W || z);
    setE($);
    set(String($));
    U($ - 1, ct);
  };
  const Nt = (z) => {
    DRef.current = E;
    setM((ct) => Math.min(3, Math.max(0.5, +(ct + z).toFixed(2))));
  };
  React.useEffect(() => {
    let z = false;
    setF(true);
    setY("");
    setL([]);
    setE(1);
    set("1");
    setV(0);
    setX([]);
    SRef.current = null;
    IRef.current = [];
    RRef.current = [];
    ARef.current = [];
    ORef.current = {};
    LRef.current = {};
    HRef.current = new Set();
    DRef.current = 1;
    const ct = getDocument({
      url: url,
    });
    ct.promise
      .then(async (W) => {
        if (z) {
          return;
        }
        SRef.current = W;
        const $ = await Promise.all(
          Array.from(
            {
              length: W.numPages,
            },
            (at, Zs) => W.getPage(Zs + 1),
          ),
        );
        if (!z) {
          IRef.current = $;
          setX(
            $.map((at) => {
              const Zs = at.getViewport({
                scale: 1,
              });
              return {
                width: Zs.width,
                height: Zs.height,
              };
            }),
          );
          setV(W.numPages);
          setF(false);
          try {
            const at = await W.getOutline();
            if (at && at.length > 0) {
              const Zs = await resolvePdfOutline(W, at);
              if (!z) {
                setL(Zs);
              }
            }
          } catch (at) {
            console.error("Erro ao ler sumário do PDF:", at);
          }
        }
      })
      .catch((W) => {
        console.error("Erro ao carregar PDF:", W);
        if (!z) {
          setY("Não foi possível carregar a partitura.");
          setF(false);
        }
      });
    return () => {
      z = true;
      ct.destroy();
    };
  }, [url]);
  React.useEffect(() => {
    if (f || v === 0 || !ERef.current) {
      return;
    }
    const z = new IntersectionObserver(
      (ct) => {
        let W = null;
        for (const $ of ct) {
          const at = Number($.target.dataset.pageIndex);
          if ($.isIntersecting) {
            HRef.current.add(at);
            N(at, CRef.current);
            (!W || $.intersectionRatio > W.intersectionRatio) && (W = $);
          } else {
            HRef.current.delete(at);
          }
        }
        if (W) {
          const $ = Number(W.target.dataset.pageIndex);
          setE($ + 1);
          set(String($ + 1));
        }
      },
      {
        root: ERef.current,
        rootMargin: "600px 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    RRef.current.forEach((ct) => ct && z.observe(ct));
    return () => z.disconnect();
  }, [f, v]);
  React.useEffect(() => {
    if (!f) {
      HRef.current.forEach((z) => N(z, M));
      U(DRef.current - 1, false);
    }
  }, [M, f]);
  React.useEffect(() => {
    const z = () => setZ(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", z);
    return () => document.removeEventListener("fullscreenchange", z);
  }, []);
  const [re, setRe] = React.useState(false);
  const jt = Z || re;
  React.useEffect(() => {
    if (!re) {
      return;
    }
    const z = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = z;
    };
  }, [re]);
  const ft = () => {
    let W;
    let $;
    const t_current = TRef.current;
    if (!t_current) {
      return;
    }
    if (re) {
      setRe(false);
      return;
    }
    if (document.fullscreenElement) {
      if (
        (W = document.exitFullscreen || document.webkitExitFullscreen) != null
      ) {
        W.call(document);
      }
      return;
    }
    const ct = t_current.requestFullscreen || t_current.webkitRequestFullscreen;
    if (typeof ct == "function") {
      const at = ct.call(t_current);
      if (($ = at?.catch) != null) {
        $.call(at, () => setRe(true));
      }
    } else {
      setRe(true);
    }
  };
  return (
    <div
      ref={TRef}
      className={`flex h-full w-full bg-neutral-900 text-white ${re ? "fixed inset-0 z-[105]" : ""}`}
    >
      {L.length > 0 && J && (
        <div className="w-64 shrink-0 border-r border-neutral-700 bg-neutral-950/60 flex flex-col">
          <div className="p-3 flex items-center justify-between border-b border-neutral-700 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wide text-neutral-400">
              Sumário
            </span>
            <button
              type="button"
              onClick={() => setJ(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10"
              aria-label="Recolher sumário"
            >
              <PanelLeftCloseIcon size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <PdfOutline items={L} currentPage={E} onSelect={_t} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-neutral-800/80 border-b border-neutral-700 shrink-0">
          <div className="flex items-center gap-1">
            {L.length > 0 && !J && (
              <button
                type="button"
                onClick={() => setJ(true)}
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md"
                aria-label="Abrir sumário"
              >
                <PanelLeftOpenIcon size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => _t(E - 1)}
              disabled={E <= 1}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Página anterior"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <div className="flex items-center gap-1.5 text-xs px-1">
              <input
                type="text"
                inputMode="numeric"
                value={_}
                onChange={(z) => set(z.target.value.replace(/[^0-9]/g, ""))}
                onBlur={() => _t(parseInt(_, 10) || E)}
                onKeyDown={(z) => {
                  if (z.key === "Enter") {
                    z.currentTarget.blur();
                  }
                }}
                className="w-10 bg-neutral-900 border border-neutral-700 rounded text-center py-1 outline-none focus:ring-1 focus:ring-palette-yellow"
                aria-label="Número da página"
              />
              <span className="text-neutral-500">
                {"/ "}
                {v || "–"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => _t(E + 1)}
              disabled={E >= v}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Próxima página"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => Nt(-0.2)}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md"
              aria-label="Diminuir zoom"
            >
              <ZoomOutIcon size={16} />
            </button>
            <span className="text-xs text-neutral-400 w-10 text-center">
              {Math.round(M * 100)}%
            </span>
            <button
              type="button"
              onClick={() => Nt(0.2)}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md"
              aria-label="Aumentar zoom"
            >
              <ZoomInIcon size={16} />
            </button>
            <button
              type="button"
              onClick={ft}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md ml-1"
              aria-label={jt ? "Sair da tela cheia" : "Tela cheia"}
            >
              {jt ? <MinimizeIcon size={16} /> : <MaximizeIcon size={16} />}
            </button>
          </div>
        </div>
        <div ref={ERef} className="flex-1 overflow-auto bg-neutral-900 py-4">
          {f ? (
            <div className="flex items-center justify-center text-neutral-400 gap-2 h-full">
              <LoaderCircleIcon className="animate-spin" size={20} />
              {" Carregando partitura..."}
            </div>
          ) : y ? (
            <div className="flex flex-col items-center justify-center text-neutral-400 gap-2 h-full">
              <CircleAlertIcon size={24} className="text-red-400" />
              {y}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {x.map((z, ct) => (
                <div
                  key={ct}
                  ref={(W) => {
                    RRef.current[ct] = W;
                  }}
                  data-page-index={ct}
                  style={{
                    width: Math.floor(z.width * M),
                    height: Math.floor(z.height * M),
                  }}
                  className="shrink-0 bg-white shadow-2xl"
                >
                  <canvas
                    ref={(W) => {
                      ARef.current[ct] = W;
                    }}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
