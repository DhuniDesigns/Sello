"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TopBar } from "./TopBar";
import styles from "./Onboarding.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** 02 Onboarding / Enter your email */
export function EmailStep() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const valid = EMAIL.test(email.trim());

  const goToVerify = (address: string) => {
    try {
      sessionStorage.setItem("sello:email", address);
    } catch {}
    router.push("/verify");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
    setSending(true);
    // No backend yet: pretend to send the code, then move on.
    setTimeout(() => goToVerify(email.trim()), 700);
  };

  return (
    <form className={styles.screen} onSubmit={submit} noValidate>
      <TopBar progress={0.5} from={0} backHref="/" />

      <span className={styles.chip}>Create Account</span>
      <h1 className={styles.title}>Enter your email</h1>
      <p className={styles.sub}>We&apos;ll send a verification code to your email.</p>

      <label htmlFor="email" className="sr-only">Email address</label>
      <input
        id="email"
        className={styles.field}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        autoFocus
        placeholder="example@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className={styles.actions}>
        <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={!valid || sending}>
          {sending ? <span className={styles.busy} aria-label="Sending code" /> : "Verify"}
        </button>
        <button type="button" className={`${styles.btn} ${styles.primary}`} onClick={() => goToVerify("amara@gmail.com")}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#fff" d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.33Z" />
            <path fill="#fff" d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H3.06v2.58A10 10 0 0 0 12 22Z" opacity=".85" />
            <path fill="#fff" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.06a10 10 0 0 0 0 8.96L6.4 13.9Z" opacity=".7" />
            <path fill="#fff" d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.52L6.4 10.1C7.19 7.74 9.4 5.98 12 5.98Z" opacity=".55" />
          </svg>
          Continue with google
        </button>
      </div>
    </form>
  );
}
