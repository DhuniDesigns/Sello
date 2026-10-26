import { ReplayButton } from "./ReplayButton";
import styles from "./AppShell.module.css";

/**
 * Phones: the app fills the screen.
 * Desktop and tablets: the app runs inside an iPhone-sized frame (390 × 844) on a quiet stage,
 * with a status bar drawn in, so testers see it exactly as it will look on a phone.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.stage}>
      <div className={styles.device}>
        <div className={styles.viewport}>
          <div className={styles.status} aria-hidden="true">
            <span>9:41</span>
            <span className={styles.island} />
            <span className={styles.icons}>
              <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></svg>
              <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3C13.3 1.4 10.8.4 8 .4S2.7 1.4.8 3.3L2 4.6c1.6-1.5 3.7-2.4 6-2.4Zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 3.8a7 7 0 0 0-4.8 1.9L4.4 7A5.2 5.2 0 0 1 8 5.6Zm0 3.3c-.6 0-1.2.2-1.6.6L8 11l1.6-1.5c-.4-.4-1-.6-1.6-.6Z" /></svg>
              <svg width="26" height="12" viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".45" /><rect x="2" y="2" width="19" height="8" rx="2" /><rect x="24" y="4" width="1.6" height="4" rx=".8" opacity=".45" /></svg>
            </span>
          </div>
          {children}
          <span className={styles.home} aria-hidden="true" />
        </div>
      </div>
      <div className={styles.controls}>
        <ReplayButton />
        <p>Best on your phone. On desktop you&apos;re seeing it in an iPhone frame.</p>
      </div>
    </div>
  );
}
