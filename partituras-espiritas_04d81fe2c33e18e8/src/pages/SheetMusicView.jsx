import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { DownloadIcon, HeadphonesIcon, VideoIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PdfViewer } from "@/components/PdfViewer";
import {
  OperationType,
  db,
  handleFirestoreError,
  registrarDownload,
} from "@/lib/firebase";

export function SheetMusicView({
  collectionName = "obras_musicais",
  basePath = "album",
}) {
  const { id } = useParams();
  const f = useNavigate();
  const [t, setT] = React.useState(null);
  React.useEffect(() => {
    if (!id) {
      return;
    }
    const x = onSnapshot(
      doc(db, collectionName, id),
      (c) => {
        if (c.exists()) {
          setT({
            id: c.id,
            ...c.data(),
          });
        }
      },
      (c) => {
        handleFirestoreError(c, OperationType.GET, `${collectionName}/${id}`);
      },
    );
    return () => x();
  }, [id, collectionName]);
  if (!t) {
    return <div className="p-8 text-center">Carregando...</div>;
  }
  const t_url_arquivo_pdf = t.url_arquivo_pdf;
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-10rem)] max-w-6xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 shrink-0">
        <h2 className="font-title text-2xl truncate w-full md:w-auto text-center md:text-left">
          {t.titulo}
          {" - Partitura"}
        </h2>
        <div className="flex gap-4 w-full md:w-auto">
          {t_url_arquivo_pdf && (
            <a
              href={t_url_arquivo_pdf}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                registrarDownload(
                  t.id,
                  basePath === "partitura" ? "partitura" : "obra",
                  "pdf",
                  t.titulo,
                  t.autor,
                )
              }
              className="flex-1 md:flex-none bg-white/10 border border-white/20 text-white font-bold py-2.5 px-6 rounded-full hover:bg-white hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <DownloadIcon size={20} />
              {" Baixar PDF"}
            </a>
          )}
          <button
            type="button"
            onClick={() => f(`/${basePath}/${t.id}/audios`)}
            className="flex-1 md:flex-none bg-palette-yellow text-primary font-bold py-2.5 px-6 rounded-full shadow-md hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <HeadphonesIcon size={20} />
            {" Ouvir Áudios"}
          </button>
          {t.videos_autor?.length > 0 && (
            <button
              type="button"
              onClick={() => f(`/${basePath}/${t.id}/videos`)}
              className="flex-1 md:flex-none bg-red-600 text-white font-bold py-2.5 px-6 rounded-full shadow-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <VideoIcon size={20} />
              {" Vídeos"}
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden shadow-2xl relative border-4 border-white/10">
        {t_url_arquivo_pdf ? (
          <PdfViewer key={t_url_arquivo_pdf} url={t_url_arquivo_pdf} />
        ) : (
          <div className="h-full flex items-center justify-center text-primary font-bold">
            Arquivo PDF não disponível para esta obra.
          </div>
        )}
      </div>
    </div>
  );
}
