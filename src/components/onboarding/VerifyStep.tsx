"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { Sello3DIcon } from "@/components/brand/Sello3DIcon";
import { TopBar } from "./TopBar";
import styles from "./Onboarding.module.css";

type Phase = "idle" | "checking" | "done";

const PILL = 27; // half the 54px button height
const MORPH_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/** 02 Onboarding / Verify your email, then the "You're in" sheet that grows out of the Verify button */
export function VerifyStep() {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const btnRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const complete = code.length === 6;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete || phase !== "idle") return;
    (document.activeElement as HTMLElement | null)?.blur();
    setPhase("checking");
    // No backend yet: any six digits pass.
    setTimeout(() => setPhase("done"), 1000);
  };

  // Grow the sheet out of the (now circular) button.
  useLayoutEffect(() => {
    if (phase !== "done") return;
    const sheet = sheetRef.current;
    const btn = btnRef.current;
    if (!sheet || !btn) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      inkRef.current?.style.setProperty("opacity", "0");
      return;
    }

    const s = sheet.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const scale = s.width / sheet.offsetWidth; // the desktop phone frame is scaled
    const cx = b.left + b.width / 2;
    const r = PILL * scale;
    const inset = [
      (b.top - s.top) / scale,
      (s.right - (cx + r)) / scale,
      (s.bottom - b.bottom) / scale,
      (cx - r - s.left) / scale,
    ]
      .map((v) => `${v.toFixed(1)}px`)
      .join(" ");

    sheet.animate(
      [{ clipPath: `inset(${inset} round ${PILL}px)` }, { clipPath: "inset(0px 0px 0px 0px round 36px)" }],
      { duration: 620, easing: MORPH_EASE }
    );
    inkRef.current?.animate([{ opacity: 1 }, { opacity: 1, offset: 0.25 }, { opacity: 0 }], {
      duration: 520,
      easing: "ease-out",
      fill: "forwards",
    });
  }, [phase]);

  const digits = code.split("");

  return (
    <form className={styles.screen} onSubmit={submit} noValidate>
      <TopBar progress={1} from={0.5} backHref="/create-account" />

      <span className={styles.chip}>Create Account</span>
      <h1 className={styles.title}>Verify your email</h1>
      <p className={styles.sub}>Enter the verification code sent to your email</p>

      <label htmlFor="code" className="sr-only">Six-digit verification code</label>
      <div className={styles.codeWrap}>
        <input
          id="code"
          className={`${styles.field} ${styles.code} ${styles.codeInput}`}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          value={code}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
        <div className={`${styles.field} ${styles.code} ${styles.codeView}`} aria-hidden="true">
          {digits.map((d, i) => (
            <span key={i} className={`${styles.digit} ${i === 3 ? styles.gap : ""}`}>
              {d}
            </span>
          ))}
          {focused && !complete && <span className={`${styles.caret} ${code.length === 3 ? styles.gap : ""}`} />}
          {code.length === 0 && <span className={styles.placeholder}>123&nbsp;&nbsp;456</span>}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          ref={btnRef}
          type="submit"
          className={`${styles.btn} ${styles.primary} ${phase !== "idle" ? styles.shrink : ""}`}
          style={phase === "done" ? { visibility: "hidden" } : undefined}
          disabled={!complete}
          aria-busy={phase === "checking"}
        >
          {phase === "idle" ? <span className={styles.label}>Verify</span> : <span className={styles.busy} aria-label="Checking code" />}
        </button>
      </div>

      {phase === "done" && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="youre-in">
          <span className={styles.scrim} />
          <div className={styles.sheet} ref={sheetRef}>
            <span className={styles.ink} ref={inkRef} aria-hidden="true" />
            <div className={styles.sheetIcon}>
              <Sello3DIcon size={124} />
            </div>
            <h2 id="youre-in" className={styles.sheetTitle}>You&apos;re in!</h2>
            <p className={styles.sheetSub}>Now let&apos;s teach Sello about your shop. It takes less than 5 minutes.</p>
            <Link href="/shop-setup" className={`${styles.btn} ${styles.primary}`} autoFocus>
              Set up your shop
            </Link>
          </div>
        </div>
      )}
    </form>
  );
}
