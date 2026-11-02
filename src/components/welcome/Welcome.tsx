"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { REPLAY_EVENT } from "@/components/shell/ReplayButton";
import { SelloIcon } from "@/components/brand/SelloIcon";
import { SignUpChat } from "@/components/onboarding/SignUpChat";
import styles from "./Welcome.module.css";

/**
 * 01 Onboarding / Welcome
 *
 * Sequence (about 3 seconds):
 * 1. Orange rises from the bottom of the screen and flows up past the top.
 * 2. As it leaves, it settles into the soft orange glow at the top.
 * 3. The app icon drops in with a little bounce, then the headline, subtext, button and log-in link rise in.
 * 4. The button finishes with a light sweep and a warm glow, and the sweep repeats every few seconds.
 *
 * Double-tap the icon to replay the sequence (handy for screen recordings).
 *
 * "Get started" doesn't navigate away: Create account slides up as a layer over this screen
 * while the orange fades out underneath, like a sheet stacking on iOS. The URL still changes,
 * so refresh and the browser back button behave.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LAYER_MS = 560;

type Layer = "closed" | "open" | "closing";

export function Welcome() {
  const [run, setRun] = useState(0);
  const [layer, setLayer] = useState<Layer>("closed");

  const close = useCallback(() => {
    setLayer((l) => (l === "open" ? "closing" : l));
    setTimeout(() => setLayer("closed"), LAYER_MS);
  }, []);

  useEffect(() => {
    const replay = () => {
      setLayer("closed");
      setRun((n) => n + 1);
    };
    const onPop = () => close();
    window.addEventListener(REPLAY_EVENT, replay);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener(REPLAY_EVENT, replay);
      window.removeEventListener("popstate", onPop);
    };
  }, [close]);

  const open = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let new-tab clicks through
    e.preventDefault();
    window.history.pushState({ sello: "create-account" }, "", `${BASE}/create-account/`);
    setLayer("open");
  };

  const back = () => {
    if (window.history.state?.sello === "create-account") window.history.back();
    else close();
  };

  const covered = layer !== "closed";

  return (
    <main
      className={`${styles.screen} ${layer === "open" ? styles.covered : ""}`}
      key={run}
      data-status={layer === "open" ? "dark" : "light"}
      data-replay={layer === "closed" ? "" : undefined}
    >
      <div className={styles.glowWrap} aria-hidden="true">
        <div className={styles.glow} />
      </div>
      <div className={styles.flood} aria-hidden="true" />

      <section className={styles.content} aria-labelledby="welcome-title" aria-hidden={covered || undefined}>
        <button
          type="button"
          className={styles.icon}
          onDoubleClick={() => setRun((n) => n + 1)}
          aria-label="Sello"
          tabIndex={-1}
        >
          <SelloIcon size={60} />
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

        <Link href="/create-account" className={styles.cta} onClick={open}>
          <span className={styles.ctaLabel}>Get started</span>
          <span className={styles.shine} aria-hidden="true" />
        </Link>

        <p className={styles.login}>
          Already have an account? <Link href="/log-in">Log in</Link>
        </p>
      </section>

      {covered && (
        <div className={`${styles.layer} ${layer === "closing" ? styles.layerOut : ""}`}>
          <SignUpChat embedded onBack={back} />
        </div>
      )}
    </main>
  );
}
