import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  DownloadIcon,
  FacebookIcon,
  FileTextIcon,
  GlobeIcon,
  HeadphonesIcon,
  HeartIcon,
  InfoIcon,
  InstagramIcon,
  MessageCircleIcon,
  MusicIcon,
  SendIcon,
  Share2Icon,
  VideoIcon,
  YoutubeIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import acervoIcon from "@/assets/acervo-espirita-icon.png";
import { SpotifyIcon, TikTokIcon } from "@/components/BrandIcons";
import { useFavoritos } from "@/hooks/useFavoritos.js";
import {
  OperationType,
  db,
  handleFirestoreError,
  registrarDownload,
} from "@/lib/firebase";
import { getDirectImageUrl } from "@/lib/media.js";

export function AlbumDetails({
  collectionName = "obras_musicais",
  basePath = "album",
}) {
  const { id } = useParams();
  const f = useNavigate();
  const [t, setT] = React.useState(null);
  const { isFavorited, toggleFavorite } = useFavoritos();
  const x = basePath === "partitura" ? "partitura" : "obra";
  React.useEffect(() => {
    if (!id) {
      return;
    }
    const N = onSnapshot(
      doc(db, collectionName, id),
      (p) => {
        if (p.exists()) {
          setT({
            id: p.id,
            ...p.data(),
          });
        }
      },
      (p) => {
        handleFirestoreError(p, OperationType.GET, `${collectionName}/${id}`);
      },
    );
    return () => N();
  }, [id, collectionName]);
  if (!t) {
    return (
      <div className="p-8 text-center flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palette-yellow" />
        <p>Carregando obra...</p>
      </div>
    );
  }
  const c = `${window.location.origin}/${basePath}/${t.id}`;
  const d = t.titulo
    ? `Confira "${t.titulo}" no Partituras Espíritas`
    : "Confira esta obra no Partituras Espíritas";
  const u = async (N) => {
    try {
      await navigator.clipboard.writeText(c);
      toast.success(`Link copiado! Cole no ${N}.`);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };
  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-start">
        {t.url_foto_capa && (
          <div className="w-64 md:w-80 shrink-0">
            <motion.img
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              src={getDirectImageUrl(t.url_foto_capa)}
              alt={t.titulo}
              className="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          {t.categoria && (
            <span className="inline-block text-xs font-bold uppercase tracking-wide bg-palette-yellow/15 text-palette-yellow px-3 py-1 rounded-full mb-4">
              {t.categoria}
            </span>
          )}
          <h2 className="font-title text-4xl md:text-6xl mb-2">{t.titulo}</h2>
          <p className="text-xl md:text-2xl text-palette-yellow mb-6 font-medium">
            {t.autor}
          </p>
          <button
            type="button"
            onClick={() =>
              toggleFavorite({
                id: t.id,
                tipo: x,
                titulo: t.titulo,
                autor: t.autor,
                url_foto_capa: t.url_foto_capa,
              })
            }
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold mb-6 transition-colors border ${isFavorited(t.id) ? "bg-palette-yellow text-primary border-palette-yellow" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}
          >
            <HeartIcon
              size={18}
              fill={isFavorited(t.id) ? "currentColor" : "none"}
            />{" "}
            {isFavorited(t.id) ? "Favoritado" : "Favoritar"}
          </button>
          {t.biografia && (
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 w-full">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <InfoIcon size={20} className="text-palette-yellow" />
                {" Sobre a Obra / Autor"}
              </h3>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                {t.biografia}
              </p>
            </div>
          )}
          {t.redes_sociais && (
            <div className="flex gap-4 mb-10">
              {t.redes_sociais.url_instagram && (
                <a
                  href={t.redes_sociais.url_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-full hover:bg-palette-yellow hover:text-primary transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={24} />
                </a>
              )}
              {t.redes_sociais.url_facebook && (
                <a
                  href={t.redes_sociais.url_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-full hover:bg-palette-yellow hover:text-primary transition-all"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={24} />
                </a>
              )}
              {t.redes_sociais.url_youtube && (
                <a
                  href={t.redes_sociais.url_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-full hover:bg-palette-yellow hover:text-primary transition-all"
                  aria-label="YouTube"
                >
                  <YoutubeIcon size={24} />
                </a>
              )}
              {t.redes_sociais.url_spotify && (
                <a
                  href={t.redes_sociais.url_spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-full hover:bg-palette-yellow hover:text-primary transition-all"
                  aria-label="Spotify"
                >
                  <SpotifyIcon size={24} />
                </a>
              )}
              {t.redes_sociais.url_acervo_espirita && (
                <a
                  href={t.redes_sociais.url_acervo_espirita}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-full hover:bg-palette-yellow transition-all"
                  aria-label="Acervo Espírita"
                >
                  <img
                    src={acervoIcon}
                    alt="Acervo Espírita"
                    className="w-6 h-6 object-contain"
                  />
                </a>
              )}
              {t.redes_sociais.url_website && (
                <a
                  href={t.redes_sociais.url_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-full hover:bg-palette-yellow hover:text-primary transition-all"
                  aria-label="Website"
                >
                  <GlobeIcon size={24} />
                </a>
              )}
            </div>
          )}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => f(`/${basePath}/${t.id}/partituras`)}
              className="bg-white text-primary font-bold py-4 px-10 rounded-xl shadow-xl hover:bg-palette-yellow transition-all flex items-center justify-center gap-3 text-lg"
            >
              <FileTextIcon size={22} />
              {" Ver Partitura"}
            </button>
            <button
              type="button"
              onClick={() => f(`/${basePath}/${t.id}/audios`)}
              className="bg-secondary text-white font-bold py-4 px-10 rounded-xl shadow-xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <HeadphonesIcon size={22} />
              {" Ouvir Áudios"}
            </button>
            {t.videos_autor?.length > 0 && (
              <a
                href={`/${basePath}/${t.id}/videos`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white font-bold py-4 px-10 rounded-xl shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 text-lg"
              >
                <VideoIcon size={22} />
                {" Vídeos"}
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <span className="text-sm font-semibold text-white/60 flex items-center gap-2 mr-1">
              <Share2Icon size={16} />
              {" Compartilhar:"}
            </span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(c)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-blue-600 transition-colors"
              title="Compartilhar no Facebook"
              aria-label="Compartilhar no Facebook"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${d} ${c}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-green-600 transition-colors"
              title="Compartilhar no WhatsApp"
              aria-label="Compartilhar no WhatsApp"
            >
              <MessageCircleIcon size={18} />
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(c)}&text=${encodeURIComponent(d)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-sky-500 transition-colors"
              title="Compartilhar no Telegram"
              aria-label="Compartilhar no Telegram"
            >
              <SendIcon size={18} />
            </a>
            <button
              type="button"
              onClick={() => u("Instagram")}
              className="p-2.5 rounded-full bg-white/10 hover:bg-pink-600 transition-colors"
              title="Copiar link para o Instagram"
              aria-label="Copiar link para o Instagram"
            >
              <InstagramIcon size={18} />
            </button>
            <button
              type="button"
              onClick={() => u("TikTok")}
              className="p-2.5 rounded-full bg-white/10 hover:bg-black transition-colors"
              title="Copiar link para o TikTok"
              aria-label="Copiar link para o TikTok"
            >
              <TikTokIcon size={18} />
            </button>
          </div>
        </div>
      </div>
      {t.url_arquivo_musescore && (
        <div className="bg-palette-yellow/10 border border-palette-yellow/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-palette-yellow text-primary rounded-2xl">
              <MusicIcon size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold">
                Arquivo MuseScore Disponível
              </h4>
              <p className="text-white/60">
                Baixe o arquivo .mscz ou .zip para editar ou estudar a
                partitura.
              </p>
            </div>
          </div>
          <a
            href={t.url_arquivo_musescore}
            download
            onClick={() =>
              registrarDownload(t.id, x, "musescore", t.titulo, t.autor)
            }
            className="w-full md:w-auto bg-palette-yellow text-primary font-bold py-3 px-8 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <DownloadIcon size={20} />
            {" Baixar Arquivo"}
          </a>
        </div>
      )}
    </div>
  );
}
