"use client";

import { useEffect, useRef } from "react";
import styles from "./Sello3DIcon.module.css";

const EDGE_LAYERS = 9;

/**
 * The Sello icon as a real 3D object: a thick orange tile, the cream bubble lifted off its face,
 * and the black dot lifted again. It floats on an idle loop and leans towards the pointer.
 */
export function Sello3DIcon({ size = 124 }: { size?: number }) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tilt = tiltRef.current;
    if (!tilt || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = tilt.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 220));
      const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 220));
      tilt.style.transform = `rotateX(${(-dy * 16).toFixed(2)}deg) rotateY(${(dx * 20).toFixed(2)}deg)`;
    };
    const reset = () => (tilt.style.transform = "");

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", reset);
    window.addEventListener("pointerup", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
      window.removeEventListener("pointerup", reset);
    };
  }, []);

  return (
    <div className={styles.scene} style={{ "--size": `${size}px` } as React.CSSProperties} role="img" aria-label="Sello">
      <span className={styles.ground} aria-hidden="true" />
      <div className={styles.tilt} ref={tiltRef}>
        <div className={styles.float}>
          {Array.from({ length: EDGE_LAYERS }, (_, i) => (
            <span
              key={i}
              className={styles.edge}
              style={{ transform: `translateZ(${-(i + 1) * 1.3}px)`, filter: `brightness(${1 - i * 0.045})` }}
              aria-hidden="true"
            />
          ))}
          <div className={styles.face} aria-hidden="true">
            <span className={styles.sheen} />
          </div>
          <svg className={styles.bubble} viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="sello3d-cream" x1="0" y1="0" x2="0.35" y2="1">
                <stop offset="0" stopColor="#FFF8EF" />
                <stop offset="1" stopColor="#EBD6C0" />
              </linearGradient>
              <linearGradient id="sello3d-eye" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#E4521C" />
                <stop offset="1" stopColor="#F77A45" />
              </linearGradient>
            </defs>
            <g transform="translate(18 17.5) scale(0.64)">
              <path
                fill="url(#sello3d-cream)"
                d="M42 10H58C63.43 10 68.44 11.05 72.84 12.99C72.62 13.96 72.5 14.96 72.5 16C72.5 23.46 78.54 29.5 86 29.5C87.04 29.5 88.04 29.38 89.01 29.16C90.95 33.56 92 38.57 92 44V46C92 65.9 77.9 80 58 80H45C39.5 86.5 30.5 90.5 19.5 91C23.5 86.5 25 81 24 76.5C14 70.8 8 59.8 8 46V44C8 24.1 22.1 10 42 10Z"
              />
              <rect x="36" y="30" width="10" height="25" rx="5" fill="url(#sello3d-eye)" />
              <rect x="54" y="30" width="10" height="25" rx="5" fill="url(#sello3d-eye)" />
            </g>
          </svg>
          <span className={styles.dot} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
