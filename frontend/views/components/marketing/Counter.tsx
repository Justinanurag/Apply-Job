import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function Counter({ to, duration = 1600 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const format = (v: number) => {
    if (to >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
    if (to >= 1_000) return (v / 1_000).toFixed(1) + "k";
    if (!Number.isInteger(to)) return v.toFixed(2);
    return Math.round(v).toLocaleString();
  };

  return <span ref={ref}>{format(n)}</span>;
}
