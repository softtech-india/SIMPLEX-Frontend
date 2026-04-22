import { useEffect, useState } from "react";

export default function useResponsivePopup(defaultWidth = "80vw", defaultHeight = "80vh") {
  const [popupSize, setPopupSize] = useState<{ width: string | number; height: string | number }>({ width: defaultWidth, height: defaultHeight });

  useEffect(() => {
    const setSize = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (w >= 1900) {
        setPopupSize({ width: Math.min(1300, Math.floor(w * 0.6)), height: Math.min(1000, Math.floor(h * 0.85)) });
      } else if (w >= 1440) {
        setPopupSize({ width: Math.min(1100, Math.floor(w * 0.7)), height: Math.min(900, Math.floor(h * 0.85)) });
      } else if (w >= 1280) {
        setPopupSize({ width: Math.min(1000, Math.floor(w * 0.75)), height: Math.min(800, Math.floor(h * 0.85)) });
      } else if (w >= 1024) {
        setPopupSize({ width: defaultWidth, height: defaultHeight });
      } else {
        setPopupSize({ width: "95vw", height: "95vh" });
      }
    };

    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [defaultWidth, defaultHeight]);

  return { popupSize };
}
