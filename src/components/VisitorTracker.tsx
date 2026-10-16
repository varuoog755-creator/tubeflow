"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const payload = {
        path: pathname,
        referrer: document.referrer || "",
        screenWidth: window.innerWidth,
      };

      fetch("/api/track/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Non-blocking visitor tracking
      });
    } catch {
      // Ignore tracker errors
    }
  }, [pathname]);

  return null;
}
