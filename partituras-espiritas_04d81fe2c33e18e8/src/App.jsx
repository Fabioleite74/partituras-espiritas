import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageLoader } from "@/components/PageLoader";
import { ScrollToTop } from "@/components/ScrollToTop";

const page = (load, name) =>
  lazy(() => load().then((m) => ({ default: m[name] })));

const Home = page(() => import("@/pages/Home"), "Home");
const Catalog = page(() => import("@/pages/Catalog"), "Catalog");
const AlbumDetails = page(() => import("@/pages/AlbumDetails"), "AlbumDetails");
const AudioList = page(() => import("@/pages/AudioList"), "AudioList");
const AlbumVideos = page(() => import("@/pages/AlbumVideos"), "AlbumVideos");
const Tutoriais = page(() => import("@/pages/Tutoriais"), "Tutoriais");
const TutorialPlaylist = page(
  () => import("@/pages/TutorialPlaylist"),
  "TutorialPlaylist",
);
const SheetMusicView = page(
  () => import("@/pages/SheetMusicView"),
  "SheetMusicView",
);
const PartiturasAvulsasSearch = page(
  () => import("@/pages/PartiturasAvulsasSearch"),
  "PartiturasAvulsasSearch",
);
const TagCategoryBrowse = page(
  () => import("@/pages/TagCategoryBrowse"),
  "TagCategoryBrowse",
);
const Favoritos = page(() => import("@/pages/Favoritos"), "Favoritos");
const PrivacyPolicy = page(
  () => import("@/pages/PrivacyPolicy"),
  "PrivacyPolicy",
);
const TermsOfUse = page(() => import("@/pages/TermsOfUse"), "TermsOfUse");
const AdminLogin = page(() => import("@/pages/admin/AdminLogin"), "AdminLogin");
const AdminDashboard = page(
  () => import("@/pages/admin/AdminDashboard"),
  "AdminDashboard",
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="album/:id" element={<AlbumDetails />} />
            <Route path="album/:id/audios" element={<AudioList />} />
            <Route path="album/:id/videos" element={<AlbumVideos />} />
            <Route path="album/:id/partituras" element={<SheetMusicView />} />
            <Route path="tutoriais" element={<Tutoriais />} />
            <Route path="tutoriais/:id" element={<TutorialPlaylist />} />
            <Route
              path="partituras-avulsas"
              element={<PartiturasAvulsasSearch />}
            />
            <Route
              path="coral"
              element={
                <TagCategoryBrowse
                  tag="coral"
                  titulo="Partituras para Coral"
                  descricao="Todas as partituras do acervo marcadas para coral."
                />
              }
            />
            <Route
              path="arranjos-instrumentais"
              element={
                <TagCategoryBrowse
                  tag="instrument"
                  titulo="Partituras Instrumentais"
                  descricao="Todas as partituras e álbuns do acervo identificados como instrumentais."
                />
              }
            />
            <Route path="favoritos" element={<Favoritos />} />
            <Route
              path="partitura/:id"
              element={
                <AlbumDetails
                  collectionName="partituras_avulsas"
                  basePath="partitura"
                />
              }
            />
            <Route
              path="partitura/:id/audios"
              element={<AudioList collectionName="partituras_avulsas" />}
            />
            <Route
              path="partitura/:id/videos"
              element={<AlbumVideos collectionName="partituras_avulsas" />}
            />
            <Route
              path="partitura/:id/partituras"
              element={
                <SheetMusicView
                  collectionName="partituras_avulsas"
                  basePath="partitura"
                />
              }
            />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfUse />} />
          </Route>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
