import { useEffect, useRef } from "react";

/** Animated blurred gradient blobs + grid + mouse-follow glow */
export function BackgroundFx() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--mx" as never]: "50vw", ["--my" as never]: "20vh" }}
    >
      {/* Base radial */}
      <div className="absolute inset-0 bg-radial-brand opacity-70" />
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      {/* Blobs */}
      <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-[oklch(0.55_0.22_295)] opacity-25 blur-[120px] animate-float-slow" />
      <div className="absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full bg-[oklch(0.55_0.22_240)] opacity-20 blur-[140px] animate-float" />
      <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-[oklch(0.65_0.18_200)] opacity-15 blur-[120px] animate-float-slow" />
      {/* Mouse-follow glow */}
      <div
        className="absolute h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] transition-transform duration-300"
        style={{
          left: "var(--mx)",
          top: "var(--my)",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, oklch(0.72 0.20 295 / 90%), transparent 70%)",
        }}
      />
    </div>
  );
}
