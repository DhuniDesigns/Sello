"use client";

import { useEffect, useRef } from "react";
import { REPLAY_EVENT } from "./ReplayButton";
import styles from "./AppShell.module.css";

const W = 410;
const H = 864;

/**
 * Phones: the app fills the screen.
 * Desktop and tablets: the app runs inside a black iPhone frame (same frame as the 4AM demo) on a soft paper stage,
 * scaled to fit the window, with a floating control pill underneath.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const s = Math.min(1, (window.innerHeight - 120) / H, (window.innerWidth - 32) / W);
      el.style.setProperty("--s", String(Math.max(0.5, s)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className={styles.stage}>
      <div className={styles.pbox} ref={box}>
        <div className={styles.phone}>
          <i className={`${styles.hw} ${styles.action}`} />
          <i className={`${styles.hw} ${styles.vol1}`} />
          <i className={`${styles.hw} ${styles.vol2}`} />
          <i className={`${styles.hw} ${styles.power}`} />
          <div className={styles.screen}>
            <div className={styles.status} aria-hidden="true">
              <span>9:41</span>
              <span className={styles.island} />
              <span className={styles.icons}>
                <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></svg>
                <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3C13.3 1.4 10.8.4 8 .4S2.7 1.4.8 3.3L2 4.6c1.6-1.5 3.7-2.4 6-2.4Zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 3.8a7 7 0 0 0-4.8 1.9L4.4 7A5.2 5.2 0 0 1 8 5.6Zm0 3.3c-.6 0-1.2.2-1.6.6L8 11l1.6-1.5c-.4-.4-1-.6-1.6-.6Z" /></svg>
                <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="20" height="9" rx="2.4" /><rect x="25" y="4.5" width="1.6" height="4" rx=".8" opacity=".4" /></svg>
              </span>
            </div>
            <div className={styles.viewport}>{children}</div>
            <span className={styles.home} aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className={styles.ctrl}>
        <button type="button" className={styles.play} onClick={() => window.dispatchEvent(new Event(REPLAY_EVENT))}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          Replay
        </button>
        <span className={styles.hint}>Best on your phone</span>
      </div>
    </div>
  );
}
