import * as React from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/firebase.js";

export function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);
  React.useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);
  return null;
}
