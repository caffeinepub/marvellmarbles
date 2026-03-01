import { useEffect, useRef } from "react";

/**
 * Hook that attaches an IntersectionObserver to add/remove the
 * "visible" class for the scroll-triggered .section-fade animation.
 */
export function useSectionFade() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.12 },
    );

    const elements = containerRef.current?.querySelectorAll(".section-fade");
    if (elements) {
      for (const el of elements) {
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, []);

  return containerRef;
}
