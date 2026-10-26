"use client";

import Link from "next/link";
import { useState } from "react";
import { SelloIcon } from "@/components/brand/SelloIcon";
import { TopBar } from "./TopBar";
import styles from "./Onboarding.module.css";

/** Shows the six digits as "567 758" while keeping the raw value digits-only. */
const format = (digits: string) => (digits.length > 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits);

/** 02 Onboarding / Verify your email, then the "You're in" sheet */
export function VerifyStep() {
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);
  const complete = code.length === 6;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete || checking) return;
    setChecking(true);
    // No backend yet: any six digits pass.
    setTimeout(() => {
      setChecking(false);
      setDone(true);
    }, 650);
  };

  return (
    <form className={styles.screen} onSubmit={submit} noValidate>
      <TopBar progress={1} from={0.5} backHref="/create-account" />

      <span className={styles.chip}>Create Account</span>
      <h1 className={styles.title}>Verify your email</h1>
      <p className={styles.sub}>Enter the verification code sent to your email</p>

      <label htmlFor="code" className="sr-only">Six-digit verification code</label>
      <input
        id="code"
        className={`${styles.field} ${styles.code}`}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        placeholder="123  456"
        value={format(code)}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
      />

      <div className={styles.actions}>
        <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={!complete || checking}>
          {checking ? <span className={styles.busy} aria-label="Checking code" /> : "Verify"}
        </button>
      </div>

      {done && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="youre-in">
          <div className={styles.sheet}>
            <span className={styles.sheetIcon}>
              <SelloIcon size={124} />
            </span>
            <h2 id="youre-in" className={styles.sheetTitle}>You&apos;re in!</h2>
            <p className={styles.sheetSub}>Now let&apos;s teach Sello about your shop. It takes less than 5 minutes.</p>
            <Link href="/shop-setup" className={`${styles.btn} ${styles.primary}`}>
              Set up your shop
            </Link>
          </div>
        </div>
      )}
    </form>
  );
}
