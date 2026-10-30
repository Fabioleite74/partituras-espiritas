import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheckIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function CookieConsent() {
  const [u, setU] = React.useState(false);
  React.useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setU(true);
    }
  }, []);
  const e = () => {
    localStorage.setItem("cookie-consent", "true");
    setU(false);
  };
  return u ? (
    <motion.div
      initial={{
        y: 100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-[110]"
    >
      <div className="bg-neutral-800 border border-white/10 p-6 rounded-2xl shadow-2xl backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-palette-yellow/10 text-palette-yellow rounded-xl shrink-0">
            <ShieldCheckIcon size={24} />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-lg">Privacidade e Cookies</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              {
                "Utilizamos cookies para melhorar sua experiência e analisar o tráfego do site. Ao continuar navegando, você concorda com nossa "
              }
              <Link to="/privacy" className="text-palette-yellow underline">
                Política de Privacidade
              </Link>
              .
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={e}
                className="flex-1 bg-palette-yellow text-primary font-bold py-2.5 rounded-xl hover:bg-white transition-all text-sm"
              >
                Aceitar
              </button>
              <button
                onClick={() => setU(false)}
                className="px-4 py-2.5 text-white/60 hover:text-white transition-colors text-sm"
              >
                Recusar
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;
}
