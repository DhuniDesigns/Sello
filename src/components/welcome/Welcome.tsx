"use client";

import Link from "next/link";
import { useState } from "react";
import { SelloIcon } from "@/components/brand/SelloIcon";
import styles from "./Welcome.module.css";

/**
 * 01 Onboarding / Welcome
 *
 * Sequence (about 3 seconds):
 * 1. Orange rises from the bottom of the screen and flows up past the top.
 * 2. As it leaves, it settles into the soft orange glow at the top.
 * 3. The app icon pops in, then the headline, subtext, button and log-in link rise in.
 * 4. The button finishes with a light sweep and a warm glow, and the sweep repeats every few seconds.
 *
 * Double-tap the icon to replay the sequence (handy for screen recordings).
 */
export function Welcome() {
  const [run, setRun] = useState(0);

  return (
    <main className={styles.screen} key={run}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.flood} aria-hidden="true" />

      <section className={styles.content} aria-labelledby="welcome-title">
        <button
          type="button"
          className={styles.icon}
          onDoubleClick={() => setRun((n) => n + 1)}
          aria-label="Sello"
          tabIndex={-1}
        >
          <SelloIcon size={56} />
        </button>

        <h1 id="welcome-title" className={styles.title}>
          <span className={styles.word} style={{ "--i": 0 } as React.CSSProperties}>Sell</span>{" "}
          <span className={styles.word} style={{ "--i": 1 } as React.CSSProperties}>more.</span>{" "}
          <span className={styles.word} style={{ "--i": 2 } as React.CSSProperties}>Reply</span>{" "}
          <span className={styles.word} style={{ "--i": 3 } as React.CSSProperties}>less.</span>
        </h1>

        <p className={styles.sub}>
          <b>Sello</b> replies to your DMs with your real prices and stock, and brings you in when a buyer is ready to pay.
        </p>

        <Link href="/create-account" className={styles.cta}>
          <span className={styles.ctaLabel}>Get started</span>
          <span className={styles.shine} aria-hidden="true" />
        </Link>

        <p className={styles.login}>
          Already have an account? <Link href="/log-in">Log in</Link>
        </p>
      </section>
    </main>
  );
}
