"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Onboarding.module.css";

/** Back button on the left, step progress on the right. `from` lets the bar animate from the previous step's value. */
export function TopBar({ progress, from = progress, backHref }: { progress: number; from?: number; backHref?: string }) {
  const router = useRouter();
  const [width, setWidth] = useState(from);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(progress));
    return () => cancelAnimationFrame(id);
  }, [progress]);

  return (
    <div className={styles.top}>
      <button
        type="button"
        className={styles.back}
        aria-label="Back"
        onClick={() => (backHref ? router.push(backHref) : router.back())}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="M11 6l-6 6 6 6" />
        </svg>
      </button>
      <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Sign-up progress">
        <span className={styles.progressFill} style={{ width: `${width * 100}%` }} />
      </div>
    </div>
  );
}
