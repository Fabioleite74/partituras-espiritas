import * as React from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  BadgeCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CirclePlusIcon,
  CloudUploadIcon,
  DatabaseIcon,
  FacebookIcon,
  FileTextIcon,
  GlobeIcon,
  GripVerticalIcon,
  ImageIcon,
  InstagramIcon,
  KeyRoundIcon,
  LandmarkIcon,
  LinkIcon,
  LoaderCircleIcon,
  Music2Icon,
  MusicIcon,
  TagIcon,
  VideoIcon,
  Volume2Icon,
  XIcon,
  YoutubeIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentPickerModal } from "@/components/admin/DocumentPickerModal";
import { db, storage } from "@/lib/firebase";

const FORM_TABS = [
  {
    key: "geral",
    label: "Informações Gerais",
    icon: FileTextIcon,
  },
  {
    key: "arquivos",
    label: "Arquivos (PDF/MuseScore)",
    icon: CloudUploadIcon,
  },
  {
    key: "audios",
    label: "Áudios",
    icon: Volume2Icon,
  },
  {
    key: "videos",
    label: "Vídeos",
    icon: VideoIcon,
  },
];

export function AdminItemForm({
  tipo = "obra",
  categoriaFixa,
  basePath = "avulsas",
  tituloSecao,
}) {
  const { id } = useParams();
  const v = useNavigate();
  const [p, t] = React.useState(false);
  const [o, w] = React.useState("");
  const [k, g] = React.useState("geral");
  const [u, f] = React.useState(true);
  const a = tipo === "avulsa" ? "partituras_avulsas" : "obras_musicais";
  const i =
    tipo === "avulsa" ? `/admin/dashboard/${basePath}` : "/admin/dashboard";
  const [x, S] = React.useState({
    titulo: "",
    autor: "",
    biografia: "",
    url_instagram: "",
    url_facebook: "",
    url_youtube: "",
    url_website: "",
    url_acervo_espirita: "",
    url_spotify: "",
    tags: "",
    categoria: categoriaFixa || "",
    palavras_chave: "",
  });
  const [y, L] = React.useState({
    capa: null,
    pdf: null,
    musescore: null,
  });
  const [N, F] = React.useState({
    capa: "upload",
    pdf: "upload",
    musescore: "upload",
  });
  const [T, P] = React.useState({
    capa: "",
    pdf: "",
    musescore: "",
  });
  const [O, G] = React.useState([
    {
      titulo: "Áudio Principal",
      url: "",
      file: null,
      inputMode: "upload",
    },
  ]);
  const [j, E] = React.useState([
    {
      titulo: "",
      url: "",
    },
  ]);
  const [d, D] = React.useState({
    isOpen: false,
    target: null,
    type: "all",
  });
  const I = (l) => {
    if (d.target === "capa") {
      P((c) => ({
        ...c,
        capa: l,
      }));
      F((c) => ({
        ...c,
        capa: "link",
      }));
    } else if (d.target === "pdf") {
      P((c) => ({
        ...c,
        pdf: l,
      }));
      F((c) => ({
        ...c,
        pdf: "link",
      }));
    } else if (d.target === "musescore") {
      P((c) => ({
        ...c,
        musescore: l,
      }));
      F((c) => ({
        ...c,
        musescore: "link",
      }));
    } else if (typeof d.target == "number") {
      const c = [...O];
      c[d.target].url = l;
      c[d.target].inputMode = "link";
      G(c);
    }
  };
  const [R, W] = React.useState({
    capa: "",
  });
  React.useEffect(() => {
    if (id) {
      (async () => {
        let _e;
        let H;
        let re;
        const c = doc(db, a, id);
        const m = await getDoc(c);
        if (m.exists()) {
          const q = m.data();
          S({
            titulo: q.titulo,
            autor: q.autor,
            biografia: q.biografia || "",
            url_instagram: q.redes_sociais?.url_instagram || "",
            url_facebook: q.redes_sociais?.url_facebook || "",
            url_youtube: q.redes_sociais?.url_youtube || "",
            url_website: q.redes_sociais?.url_website || "",
            url_acervo_espirita: q.redes_sociais?.url_acervo_espirita || "",
            url_spotify: q.redes_sociais?.url_spotify || "",
            tags: q.tags || "",
            categoria: categoriaFixa || q.categoria || "",
            palavras_chave: q.palavras_chave || "",
          });
          W({
            capa: q.url_foto_capa || "",
          });
          P({
            capa: q.url_foto_capa || "",
            pdf: q.url_arquivo_pdf || "",
            musescore: q.url_arquivo_musescore || "",
          });
          F({
            capa:
              (_e = q.url_foto_capa) != null && _e.includes("firebasestorage")
                ? "upload"
                : q.url_foto_capa
                  ? "link"
                  : "upload",
            pdf:
              (H = q.url_arquivo_pdf) != null && H.includes("firebasestorage")
                ? "upload"
                : q.url_arquivo_pdf
                  ? "link"
                  : "upload",
            musescore:
              (re = q.url_arquivo_musescore) != null &&
              re.includes("firebasestorage")
                ? "upload"
                : q.url_arquivo_musescore
                  ? "link"
                  : "upload",
          });
          G(
            q.audios.map(($e) => {
              let Ze;
              return {
                ...$e,
                file: null,
                inputMode:
                  (Ze = $e.url) != null && Ze.includes("firebasestorage")
                    ? "upload"
                    : $e.url
                      ? "link"
                      : "upload",
              };
            }),
          );
          E(
            q.videos_autor && q.videos_autor.length > 0
              ? q.videos_autor
              : [
                  {
                    titulo: "",
                    url: "",
                  },
                ],
          );
          f(q.ativo !== false);
        }
      })();
    }
  }, [id]);
  const Z = (l, c) => {
    const m = l.target.files?.[0] || null;
    L((V) => ({
      ...V,
      [c]: m,
    }));
    if (c === "capa" && m) {
      const V = new FileReader();
      V.onloadend = () =>
        W((ee) => ({
          ...ee,
          capa: V.result,
        }));
      V.readAsDataURL(m);
    }
  };
  const Q = (l, c, m) => {
    const A = [...O];
    A[l] = {
      ...A[l],
      [c]: m,
    };
    G(A);
  };
  const ke = () => {
    G([
      {
        titulo: "",
        url: "",
        file: null,
        inputMode: "upload",
      },
      ...O,
    ]);
  };
  const ie = (l) => {
    if (O.length !== 1) {
      G(O.filter((c, m) => m !== l));
    }
  };
  const fe = (l, c) => {
    const m = l + c;
    if (m < 0 || m >= O.length) {
      return;
    }
    const A = [...O];
    [A[l], A[m]] = [A[m], A[l]];
    G(A);
  };
  const [ce, Ge] = React.useState(null);
  const [Na, Be] = React.useState(null);
  const Le = () => {
    Ge(null);
    Be(null);
  };
  const wa = (l) => {
    if (ce === null || ce === l) {
      Le();
      return;
    }
    const c = [...O];
    const [m] = c.splice(ce, 1);
    c.splice(l, 0, m);
    G(c);
    Le();
  };
  const He = (l, c, m) => {
    const A = [...j];
    A[l] = {
      ...A[l],
      [c]: m,
    };
    E(A);
  };
  const ka = () => {
    E([
      {
        titulo: "",
        url: "",
      },
      ...j,
    ]);
  };
  const Ca = (l) => {
    if (j.length !== 1) {
      E(j.filter((c, m) => m !== l));
    }
  };
  const [de, We] = React.useState(null);
  const [Sa, Je] = React.useState(null);
  const Pe = () => {
    We(null);
    Je(null);
  };
  const _a = (l) => {
    if (de === null || de === l) {
      Pe();
      return;
    }
    const c = [...j];
    const [m] = c.splice(de, 1);
    c.splice(l, 0, m);
    E(c);
    Pe();
  };
  const Qe = (l, c) => {
    const m = l + c;
    if (m < 0 || m >= j.length) {
      return;
    }
    const A = [...j];
    [A[l], A[m]] = [A[m], A[l]];
    E(A);
  };
  const Ce = async (l, c) => {
    try {
      const m = ref(storage, `${c}/${Date.now()}_${l.name}`);
      await uploadBytesResumable(m, l);
      return await getDownloadURL(m);
    } catch (m) {
      console.error(`Erro ao fazer upload do arquivo ${l.name}:`, m);
      throw m;
    }
  };
  const Ye = async (l, c) => {
    l.preventDefault();
    t(true);
    w("Iniciando upload dos arquivos...");
    try {
      let m = {
        capa: R.capa,
        pdf: "",
        musescore: "",
      };
      let A = [];
      if (id) {
        const H = doc(db, a, id);
        const re = await getDoc(H);
        if (re.exists()) {
          const q = re.data();
          m.pdf = q.url_arquivo_pdf;
          m.musescore = q.url_arquivo_musescore;
          A = q.audios;
        }
      }
      if (N.capa === "link") {
        m.capa = T.capa;
      } else if (y.capa) {
        w("Enviando foto de capa...");
        m.capa = await Ce(y.capa, "capas");
      }
      if (N.pdf === "link") {
        m.pdf = T.pdf;
      } else if (y.pdf) {
        w("Enviando arquivo PDF...");
        m.pdf = await Ce(y.pdf, "pdfs");
      }
      if (N.musescore === "link") {
        m.musescore = T.musescore;
      } else if (y.musescore) {
        w("Enviando arquivo MuseScore...");
        m.musescore = await Ce(y.musescore, "musescore");
      }
      const V = await Promise.all(
        O.map(async (H, re) => {
          if (H.inputMode !== "link" && H.file) {
            w(`Enviando áudio ${re + 1}: ${H.titulo}...`);
            const q = await Ce(H.file, "audios");
            return {
              titulo: H.titulo,
              url: q,
            };
          }
          return {
            titulo: H.titulo,
            url: H.url,
          };
        }),
      );
      const ee = j.filter((H) => H.url.trim() !== "");
      const Y =
        tipo === "avulsa"
          ? {
              titulo: x.titulo,
              autor: x.autor,
              biografia: x.biografia,
              categoria: x.categoria,
              palavras_chave: x.palavras_chave,
              url_arquivo_pdf: m.pdf,
              url_arquivo_musescore: m.musescore,
              audios: V,
              videos_autor: ee,
              ativo: c,
            }
          : {
              titulo: x.titulo,
              autor: x.autor,
              biografia: x.biografia,
              redes_sociais: {
                url_instagram: x.url_instagram,
                url_facebook: x.url_facebook,
                url_youtube: x.url_youtube,
                url_website: x.url_website,
                url_acervo_espirita: x.url_acervo_espirita,
                url_spotify: x.url_spotify,
              },
              tags: x.tags,
              url_foto_capa: m.capa,
              url_arquivo_pdf: m.pdf,
              url_arquivo_musescore: m.musescore,
              audios: V,
              videos_autor: ee,
              ativo: c,
            };
      const ve =
        tipo === "avulsa"
          ? "Partitura avulsa salva como rascunho!"
          : "Obra salva como rascunho!";
      const Se =
        tipo === "avulsa"
          ? "Partitura avulsa atualizada com sucesso!"
          : "Obra atualizada com sucesso!";
      const _e =
        tipo === "avulsa"
          ? "Partitura avulsa cadastrada com sucesso!"
          : "Obra cadastrada com sucesso!";
      if (id) {
        await updateDoc(doc(db, a, id), Y);
        toast.success(c ? Se : ve);
      } else {
        Y.createdAt = serverTimestamp();
        await addDoc(collection(db, a), Y);
        toast.success(c ? _e : ve);
      }
      v(i);
    } catch (m) {
      console.error(m);
      const A = m instanceof Error ? m.message : "Erro ao salvar.";
      toast.error(A);
    } finally {
      t(false);
      w("");
    }
  };
  return (
    <div className="max-w-6xl mx-auto">
      <DocumentPickerModal
        isOpen={d.isOpen}
        onClose={() =>
          D({
            ...d,
            isOpen: false,
          })
        }
        onSelect={I}
        fileType={d.type}
      />
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">
          {tipo === "avulsa"
            ? id
              ? `Editar Partitura${categoriaFixa ? ` — ${tituloSecao || categoriaFixa}` : " Avulsa"}`
              : `Nova Partitura${categoriaFixa ? ` — ${tituloSecao || categoriaFixa}` : " Avulsa"}`
            : id
              ? "Editar Obra"
              : "Nova Partitura"}
        </h1>
        {id && !u && (
          <span className="text-xs font-bold uppercase tracking-wide bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full">
            Rascunho
          </span>
        )}
      </div>
      <form
        onSubmit={(l) => Ye(l, true)}
        className="space-y-8 bg-neutral-800 p-8 rounded-2xl border border-neutral-700"
      >
        <div className="flex flex-wrap gap-1 border-b border-neutral-700">
          {FORM_TABS.map((l) => {
            const LIcon = l.icon;
            return (
              <button
                key={l.key}
                type="button"
                onClick={() => g(l.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${k === l.key ? "border-palette-yellow text-palette-yellow" : "border-transparent text-neutral-400 hover:text-white"}`}
              >
                <LIcon size={16} /> {l.label}
              </button>
            );
          })}
        </div>
        <div className={k === "geral" ? "space-y-8" : "hidden"}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="obra-titulo"
                  className="text-sm font-medium text-neutral-400"
                >
                  Título da Obra
                </label>
                <input
                  id="obra-titulo"
                  type="text"
                  value={x.titulo}
                  onChange={(l) =>
                    S({
                      ...x,
                      titulo: l.target.value,
                    })
                  }
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="obra-autor"
                  className="text-sm font-medium text-neutral-400"
                >
                  Autor
                </label>
                <input
                  id="obra-autor"
                  type="text"
                  value={x.autor}
                  onChange={(l) =>
                    S({
                      ...x,
                      autor: l.target.value,
                    })
                  }
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="obra-biografia"
                className="text-sm font-medium text-neutral-400"
              >
                Biografia do Autor (Opcional)
              </label>
              <textarea
                id="obra-biografia"
                value={x.biografia}
                onChange={(l) =>
                  S({
                    ...x,
                    biografia: l.target.value,
                  })
                }
                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-palette-yellow min-h-[120px] resize-none"
                placeholder="Conte um pouco sobre a história do autor ou da obra..."
              />
            </div>
            {tipo === "avulsa" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="avulsa-categoria"
                    className="text-sm font-medium text-neutral-400 flex items-center gap-2"
                  >
                    <TagIcon size={14} />
                    {" Categoria"}
                  </label>
                  <input
                    id="avulsa-categoria"
                    type="text"
                    value={x.categoria}
                    onChange={(l) =>
                      S({
                        ...x,
                        categoria: l.target.value,
                      })
                    }
                    className={`w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow ${categoriaFixa ? "opacity-70 cursor-not-allowed" : ""}`}
                    placeholder="ex: Hinos, Preces, Evangelização"
                    readOnly={!!categoriaFixa}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="avulsa-palavras-chave"
                    className="text-sm font-medium text-neutral-400 flex items-center gap-2"
                  >
                    <KeyRoundIcon size={14} />
                    {" Palavras-chave (separadas por vírgula)"}
                  </label>
                  <input
                    id="avulsa-palavras-chave"
                    type="text"
                    value={x.palavras_chave}
                    onChange={(l) =>
                      S({
                        ...x,
                        palavras_chave: l.target.value,
                      })
                    }
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                    placeholder="ex: coral, piano, natal"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="obra-tags"
                  className="text-sm font-medium text-neutral-400"
                >
                  Tags (separadas por vírgula)
                </label>
                <input
                  id="obra-tags"
                  type="text"
                  value={x.tags}
                  onChange={(l) =>
                    S({
                      ...x,
                      tags: l.target.value,
                    })
                  }
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                  placeholder="ex: coral, piano, natal"
                />
              </div>
            )}
          </div>
          {tipo === "obra" && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-neutral-700 pb-2">
                  Foto de Capa
                </h3>
                <div className="max-w-xs space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="block text-sm font-medium text-neutral-400">
                      Imagem
                    </label>
                    <div className="flex bg-neutral-800 rounded-lg p-1 border border-neutral-700">
                      <button
                        type="button"
                        onClick={() =>
                          F({
                            ...N,
                            capa: "upload",
                          })
                        }
                        className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${N.capa === "upload" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
                      >
                        <CloudUploadIcon size={14} />
                        {" Upload"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          F({
                            ...N,
                            capa: "link",
                          })
                        }
                        className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${N.capa === "link" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
                      >
                        <LinkIcon size={14} />
                        {" Link"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          D({
                            isOpen: true,
                            target: "capa",
                            type: "image",
                          })
                        }
                        className="px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors text-neutral-500 hover:text-white hover:bg-neutral-700"
                      >
                        <DatabaseIcon size={14} />
                        {" Acervo"}
                      </button>
                    </div>
                  </div>
                  {N.capa === "upload" ? (
                    <div className="relative aspect-[3/4] bg-neutral-700 rounded-xl overflow-hidden border-2 border-dashed border-neutral-600 flex flex-col items-center justify-center group cursor-pointer hover:border-palette-yellow transition-colors">
                      {R.capa ? (
                        <img
                          src={R.capa}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                      ) : (
                        <>
                          <ImageIcon
                            size={48}
                            className="text-neutral-500 mb-2"
                          />
                          <span className="text-neutral-400 text-sm">
                            Clique para selecionar
                          </span>
                          <span className="text-[10px] text-neutral-500 mt-1">
                            JPG/PNG • Máx 2MB
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(l) => Z(l, "capa")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="Selecionar imagem de capa"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={T.capa}
                        onChange={(l) =>
                          P({
                            ...T,
                            capa: l.target.value,
                          })
                        }
                        placeholder="Cole o link da imagem (Google Drive, etc)"
                        className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-palette-yellow"
                      />
                      <p className="text-xs text-neutral-500">
                        Certifique-se de que o link é público (Qualquer pessoa
                        com o link).
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-neutral-700 pb-2">
                  Redes Sociais e Links do Autor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative">
                    <InstagramIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      size={18}
                    />
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={x.url_instagram}
                      onChange={(l) =>
                        S({
                          ...x,
                          url_instagram: l.target.value,
                        })
                      }
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                    />
                  </div>
                  <div className="relative">
                    <FacebookIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      size={18}
                    />
                    <input
                      type="url"
                      placeholder="Facebook URL"
                      value={x.url_facebook}
                      onChange={(l) =>
                        S({
                          ...x,
                          url_facebook: l.target.value,
                        })
                      }
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                    />
                  </div>
                  <div className="relative">
                    <YoutubeIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      size={18}
                    />
                    <input
                      type="url"
                      placeholder="YouTube URL"
                      value={x.url_youtube}
                      onChange={(l) =>
                        S({
                          ...x,
                          url_youtube: l.target.value,
                        })
                      }
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                    />
                  </div>
                  <div className="relative">
                    <GlobeIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      size={18}
                    />
                    <input
                      type="url"
                      placeholder="Website do autor (Opcional)"
                      value={x.url_website}
                      onChange={(l) =>
                        S({
                          ...x,
                          url_website: l.target.value,
                        })
                      }
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                    />
                  </div>
                  <div className="relative">
                    <LandmarkIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      size={18}
                    />
                    <input
                      type="url"
                      placeholder="Perfil no Acervo Espírita (Opcional)"
                      value={x.url_acervo_espirita}
                      onChange={(l) =>
                        S({
                          ...x,
                          url_acervo_espirita: l.target.value,
                        })
                      }
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                    />
                  </div>
                  <div className="relative">
                    <Music2Icon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      size={18}
                    />
                    <input
                      type="url"
                      placeholder="Perfil no Spotify (Opcional)"
                      value={x.url_spotify}
                      onChange={(l) =>
                        S({
                          ...x,
                          url_spotify: l.target.value,
                        })
                      }
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-palette-yellow"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div
          className={
            k === "arquivos"
              ? "grid grid-cols-1 md:grid-cols-2 gap-8"
              : "hidden"
          }
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-neutral-400">
                  Partitura (PDF)
                </label>
                {T.pdf && !y.pdf && (
                  <a
                    href={T.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full hover:bg-green-400/20 transition-colors"
                  >
                    <BadgeCheckIcon size={12} />
                    {" Já publicado"}
                  </a>
                )}
              </div>
              <div className="flex bg-neutral-800 rounded-lg p-1 border border-neutral-700">
                <button
                  type="button"
                  onClick={() =>
                    F({
                      ...N,
                      pdf: "upload",
                    })
                  }
                  className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${N.pdf === "upload" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
                >
                  <CloudUploadIcon size={14} />
                  {" Upload"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    F({
                      ...N,
                      pdf: "link",
                    })
                  }
                  className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${N.pdf === "link" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
                >
                  <LinkIcon size={14} />
                  {" Link"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    D({
                      isOpen: true,
                      target: "pdf",
                      type: "pdf",
                    })
                  }
                  className="px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors text-neutral-500 hover:text-white hover:bg-neutral-700"
                >
                  <DatabaseIcon size={14} />
                  {" Acervo"}
                </button>
              </div>
            </div>
            {N.pdf === "upload" ? (
              <div className="flex items-center gap-4 p-4 bg-neutral-700 rounded-lg border border-neutral-600 relative hover:border-palette-yellow transition-colors">
                <FileTextIcon className="text-red-400" />
                <span className="text-sm truncate flex-1">
                  {y.pdf?.name || "Selecionar PDF"}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(l) => Z(l, "pdf")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Selecionar arquivo PDF"
                />
              </div>
            ) : (
              <input
                type="url"
                value={T.pdf}
                onChange={(l) =>
                  P({
                    ...T,
                    pdf: l.target.value,
                  })
                }
                placeholder="Link do Google Drive para o PDF"
                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-palette-yellow"
                aria-label="Link externo do PDF"
              />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-neutral-400">
                  MuseScore (.mscz ou .zip)
                </label>
                {T.musescore && !y.musescore && (
                  <a
                    href={T.musescore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full hover:bg-green-400/20 transition-colors"
                  >
                    <BadgeCheckIcon size={12} />
                    {" Já publicado"}
                  </a>
                )}
              </div>
              <div className="flex bg-neutral-800 rounded-lg p-1 border border-neutral-700">
                <button
                  type="button"
                  onClick={() =>
                    F({
                      ...N,
                      musescore: "upload",
                    })
                  }
                  className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${N.musescore === "upload" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
                >
                  <CloudUploadIcon size={14} />
                  {" Upload"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    F({
                      ...N,
                      musescore: "link",
                    })
                  }
                  className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${N.musescore === "link" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
                >
                  <LinkIcon size={14} />
                  {" Link"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    D({
                      isOpen: true,
                      target: "musescore",
                      type: "musescore",
                    })
                  }
                  className="px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors text-neutral-500 hover:text-white hover:bg-neutral-700"
                >
                  <DatabaseIcon size={14} />
                  {" Acervo"}
                </button>
              </div>
            </div>
            {N.musescore === "upload" ? (
              <div className="flex items-center gap-4 p-4 bg-neutral-700 rounded-lg border border-neutral-600 relative hover:border-palette-yellow transition-colors">
                <MusicIcon className="text-blue-400" />
                <span className="text-sm truncate flex-1">
                  {y.musescore?.name || "Selecionar .mscz ou .zip"}
                </span>
                <input
                  type="file"
                  accept=".mscz,.zip"
                  onChange={(l) => Z(l, "musescore")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Selecionar arquivo MuseScore"
                />
              </div>
            ) : (
              <input
                type="url"
                value={T.musescore}
                onChange={(l) =>
                  P({
                    ...T,
                    musescore: l.target.value,
                  })
                }
                placeholder="Link do Google Drive para o .mscz ou .zip"
                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-palette-yellow"
                aria-label="Link externo do MuseScore"
              />
            )}
          </div>
        </div>
        <div className={k === "audios" ? "space-y-4" : "hidden"}>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-neutral-400">
              Arquivos de Áudio
            </label>
            <button
              type="button"
              onClick={ke}
              className="text-xs text-palette-yellow hover:text-white flex items-center gap-1 transition-colors"
            >
              <CirclePlusIcon size={14} />
              {" Adicionar Áudio"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {O.map((l, c) => {
              return (
                <div
                  key={c}
                  onDragOver={(A) => {
                    A.preventDefault();
                    Be(c);
                  }}
                  onDrop={() => wa(c)}
                  className={`p-4 bg-neutral-900/50 rounded-xl border space-y-3 transition-colors ${ce === c ? "opacity-40" : ""} ${Na === c && ce !== null && ce !== c ? "border-palette-yellow" : "border-neutral-700"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        draggable
                        onDragStart={(A) => {
                          A.stopPropagation();
                          Ge(c);
                        }}
                        onDragEnd={Le}
                        className="text-neutral-500 hover:text-white cursor-grab active:cursor-grabbing"
                        aria-label="Arrastar para reordenar"
                      >
                        <GripVerticalIcon size={14} />
                      </span>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
                        {"Faixa "}
                        {c + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => fe(c, -1)}
                        disabled={c === 0}
                        className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors disabled:opacity-20 disabled:pointer-events-none"
                        aria-label="Mover faixa para cima"
                        title="Mover para cima"
                      >
                        <ChevronUpIcon size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => fe(c, 1)}
                        disabled={c === O.length - 1}
                        className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors disabled:opacity-20 disabled:pointer-events-none"
                        aria-label="Mover faixa para baixo"
                        title="Mover para baixo"
                      >
                        <ChevronDownIcon size={14} />
                      </button>
                      {O.length > 1 && (
                        <button
                          type="button"
                          onClick={() => ie(c)}
                          className="p-1 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                          aria-label="Remover faixa"
                        >
                          <XIcon size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Título do áudio (ex: Coro, Solo, Instrumental)"
                    value={l.titulo}
                    onChange={(A) => Q(c, "titulo", A.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-palette-yellow"
                    required
                  />
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-neutral-400">
                      Arquivo de Áudio
                    </label>
                    <div className="flex bg-neutral-800 rounded-lg p-1 border border-neutral-700">
                      <button
                        type="button"
                        onClick={() => Q(c, "inputMode", "upload")}
                        className={`px-3 py-1 text-[10px] rounded-md flex items-center gap-1 transition-colors ${l.inputMode !== "link" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"}`}
                      >
                        <CloudUploadIcon size={12} />
                        {" Upload"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          D({
                            isOpen: true,
                            target: c,
                            type: "audio",
                          })
                        }
                        className="px-3 py-1 text-[10px] rounded-md flex items-center gap-1 transition-colors text-neutral-500 hover:text-white hover:bg-neutral-700"
                      >
                        <DatabaseIcon size={12} />
                        {" Acervo"}
                      </button>
                    </div>
                  </div>
                  {l.inputMode !== "link" ? (
                    <div className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg border border-neutral-700 relative hover:border-palette-yellow transition-colors">
                      <Volume2Icon size={18} className="text-green-400" />
                      <span className="text-xs truncate flex-1">
                        {l.file?.name ||
                          (l.url
                            ? "Áudio já enviado"
                            : "Selecionar arquivo (pode selecionar vários)")}
                      </span>
                      <input
                        type="file"
                        accept="audio/*"
                        multiple
                        onChange={(A) => {
                          const V = Array.from(A.target.files || []);
                          if (
                            V.length > 0 &&
                            (Q(c, "file", V[0]),
                            l.titulo ||
                              Q(
                                c,
                                "titulo",
                                V[0].name.replace(/\.[^/.]+$/, ""),
                              ),
                            V.length > 1)
                          ) {
                            const ee = V.slice(1).map((Y) => ({
                              titulo: Y.name.replace(/\.[^/.]+$/, ""),
                              url: "",
                              file: Y,
                              inputMode: "upload",
                            }));
                            G((Y) => [...Y, ...ee]);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="Selecionar arquivo de áudio"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                      <DatabaseIcon
                        size={18}
                        className="text-green-400 shrink-0"
                      />
                      <span className="text-xs truncate flex-1">
                        {l.url
                          ? "Áudio selecionado do acervo"
                          : "Nenhum arquivo selecionado"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className={k === "videos" ? "space-y-4" : "hidden"}>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-neutral-400">
              Vídeos do Autor
            </label>
            <button
              type="button"
              onClick={ka}
              className="text-xs text-palette-yellow hover:text-white flex items-center gap-1 transition-colors"
            >
              <CirclePlusIcon size={14} />
              {" Adicionar Vídeo"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {j.map((l, c) => (
              <div
                key={c}
                onDragOver={(m) => {
                  m.preventDefault();
                  Je(c);
                }}
                onDrop={() => _a(c)}
                className={`p-4 bg-neutral-900/50 rounded-xl border space-y-3 transition-colors ${de === c ? "opacity-40" : ""} ${Sa === c && de !== null && de !== c ? "border-palette-yellow" : "border-neutral-700"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      draggable
                      onDragStart={(m) => {
                        m.stopPropagation();
                        We(c);
                      }}
                      onDragEnd={Pe}
                      className="text-neutral-500 hover:text-white cursor-grab active:cursor-grabbing"
                      aria-label="Arrastar para reordenar"
                    >
                      <GripVerticalIcon size={14} />
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
                      {"Vídeo "}
                      {c + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => Qe(c, -1)}
                      disabled={c === 0}
                      className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors disabled:opacity-20 disabled:pointer-events-none"
                      aria-label="Mover vídeo para cima"
                      title="Mover para cima"
                    >
                      <ChevronUpIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => Qe(c, 1)}
                      disabled={c === j.length - 1}
                      className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors disabled:opacity-20 disabled:pointer-events-none"
                      aria-label="Mover vídeo para baixo"
                      title="Mover para baixo"
                    >
                      <ChevronDownIcon size={14} />
                    </button>
                    {j.length > 1 && (
                      <button
                        type="button"
                        onClick={() => Ca(c)}
                        className="p-1 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        aria-label="Remover vídeo"
                      >
                        <XIcon size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Título do vídeo (ex: Show ao vivo, Entrevista)"
                  value={l.titulo}
                  onChange={(m) => He(c, "titulo", m.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-palette-yellow"
                />
                <div className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                  <VideoIcon size={18} className="text-red-400 shrink-0" />
                  <input
                    type="url"
                    placeholder="Link do YouTube"
                    value={l.url}
                    onChange={(m) => He(c, "url", m.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6">
          {p && (
            <div className="mb-4 p-4 bg-palette-yellow/10 border border-palette-yellow/20 rounded-lg flex items-center gap-3 text-palette-yellow">
              <LoaderCircleIcon className="animate-spin" />
              <span>{o}</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={p}
              onClick={(l) => Ye(l, false)}
              className="sm:flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Salvar como Rascunho
            </button>
            <button
              type="submit"
              disabled={p}
              className="sm:flex-1 bg-palette-yellow hover:bg-white text-primary font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {p
                ? "Processando..."
                : id
                  ? u
                    ? "Salvar Alterações"
                    : "Publicar"
                  : "Cadastrar Obra"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
