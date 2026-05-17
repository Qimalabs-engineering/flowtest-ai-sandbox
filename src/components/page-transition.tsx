import { useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Page transition wrapper: re-mounts the inner element keyed by pathname so the
 * `fs-fade-up` keyframe replays on every route change. Tight (<250ms) and
 * subtle — pure opacity + 8px translate.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [key, setKey] = useState(pathname);
  const prev = useRef(pathname);

  useEffect(() => {
    if (prev.current !== pathname) {
      prev.current = pathname;
      setKey(pathname);
    }
  }, [pathname]);

  return (
    <div key={key} className="fs-fade-up">
      {children}
    </div>
  );
}
