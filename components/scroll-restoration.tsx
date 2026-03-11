"use client";

import { useEffect, useRef, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SCROLL_KEY = "nxcar_scroll_";
const BACK_FLAG = "nxcar_going_back";

function ScrollRestorationInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = pathname + (searchParams?.toString() ? "?" + searchParams.toString() : "");
  const blockUntil = useRef(0);
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);
  const historyLen = useRef(typeof window !== "undefined" ? window.history.length : 0);

  const clearTimers = useCallback(() => {
    timerIds.current.forEach(clearTimeout);
    timerIds.current = [];
    blockUntil.current = 0;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";

    const onPopState = () => {
      const newLen = window.history.length;
      if (newLen <= historyLen.current) {
        sessionStorage.setItem(BACK_FLAG, "1");
      }
      historyLen.current = newLen;
    };

    window.addEventListener("popstate", onPopState);

    const origScrollTo = window.scrollTo;
    const origScroll = window.scroll;

    const patchedScrollTo = function (this: any, ...args: any[]) {
      if (Date.now() < blockUntil.current) {
        const y = typeof args[0] === "number" ? args[1] : args[0]?.top;
        if (y === 0) return;
      }
      return origScrollTo.apply(window, args as any);
    } as typeof window.scrollTo;

    const patchedScroll = function (this: any, ...args: any[]) {
      if (Date.now() < blockUntil.current) {
        const y = typeof args[0] === "number" ? args[1] : args[0]?.top;
        if (y === 0) return;
      }
      return origScroll.apply(window, args as any);
    } as typeof window.scroll;

    window.scrollTo = patchedScrollTo;
    window.scroll = patchedScroll;

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.scrollTo = origScrollTo;
      window.scroll = origScroll;
    };
  }, []);

  useEffect(() => {
    clearTimers();
    const key = SCROLL_KEY + routeKey;
    const isBack = sessionStorage.getItem(BACK_FLAG) === "1";

    if (isBack) {
      sessionStorage.removeItem(BACK_FLAG);
      const saved = sessionStorage.getItem(key);
      if (saved) {
        const y = parseInt(saved, 10);
        if (y > 0) {
          blockUntil.current = Date.now() + 4000;
          const restore = () => {
            document.documentElement.scrollTop = y;
            document.body.scrollTop = y;
          };
          [0, 50, 150, 300, 600, 1000, 1500, 2000, 3000].forEach(ms => {
            timerIds.current.push(setTimeout(restore, ms));
          });
          timerIds.current.push(
            setTimeout(() => { blockUntil.current = 0; }, 4500)
          );
        }
      }
    }

    historyLen.current = window.history.length;

    let ticking = false;
    const onScroll = () => {
      if (!ticking && Date.now() > blockUntil.current) {
        ticking = true;
        requestAnimationFrame(() => {
          sessionStorage.setItem(key, String(window.scrollY));
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimers();
    };
  }, [routeKey, clearTimers]);

  return null;
}

export function ScrollRestoration() {
  return (
    <Suspense fallback={null}>
      <ScrollRestorationInner />
    </Suspense>
  );
}
