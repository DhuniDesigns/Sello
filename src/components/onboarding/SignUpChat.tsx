"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Sello3DIcon } from "@/components/brand/Sello3DIcon";
import { TopBar } from "./TopBar";
import base from "./Onboarding.module.css";
import styles from "./SignUpChat.module.css";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DEMO_CODE = "567758";
const PILL = 25;
const MORPH_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type Step = "email" | "sending" | "code" | "checking" | "done";
type Msg = { id: number; from: "sello" | "me"; text: string; time: string; flip?: DOMRect };

const now = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true }).replace(" ", "");
const formatCode = (d: string) => (d.length > 3 ? `${d.slice(0, 3)} ${d.slice(3)}` : d);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Sign-up as a conversation with Sello                                */
/* ------------------------------------------------------------------ */

type Props = {
  /** Shown as a layer over the welcome screen: no page-enter slide, Sello waits for the layer to land. */
  embedded?: boolean;
  onBack?: () => void;
};

export function SignUpChat({ embedded = false, onBack }: Props = {}) {
  const [step, setStep] = useState<Step>("sending");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

  const idRef = useRef(0);
  const threadRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);

  const push = useCallback((m: Omit<Msg, "id" | "time">) => {
    setMsgs((list) => [...list, { ...m, id: ++idRef.current, time: now() }]);
  }, []);

  /** Sello "types" for a moment, then says each line in turn. */
  const selloSays = useCallback(
    async (...lines: string[]) => {
      for (const text of lines) {
        setTyping(true);
        await wait(Math.min(1200, 520 + text.length * 9));
        setTyping(false);
        push({ from: "sello", text });
        await wait(260);
      }
    },
    [push]
  );

  // Opening line
  useEffect(() => {
    let live = true;
    (async () => {
      await wait(embedded ? 700 : 450);
      if (!live) return;
      await selloSays("Hi! I'm Sello. What's your email? I'll send you a code to make sure it's you.");
      setStep("email");
    })();
    return () => {
      live = false;
    };
  }, [selloSays, embedded]);

  // Focus the field whenever it's the user's turn
  useEffect(() => {
    if (step === "email" || step === "code") inputRef.current?.focus({ preventScroll: true });
  }, [step]);

  // Keep the newest line in view
  useEffect(() => {
    const t = threadRef.current;
    if (t) t.scrollTo({ top: t.scrollHeight, behavior: reduced() ? "auto" : "smooth" });
  }, [msgs, typing, step]);

  /** Turn what's in the field into my bubble, flying it up from where it was typed. */
  const sendLine = (text: string) => {
    push({ from: "me", text, flip: lineRef.current?.getBoundingClientRect() });
  };

  const submitEmail = async (address: string) => {
    sendLine(address);
    setEmail("");
    setStep("sending");
    try {
      sessionStorage.setItem("sello:email", address);
    } catch {}
    await wait(380);
    await selloSays(`Sent! Check ${address} for a 6-digit code and pop it in here.`, "Psst, this is a demo. The code is 567 758.");
    setStep("code");
  };

  const submitCode = async () => {
    sendLine(formatCode(code));
    const entered = code;
    setCode("");
    setStep("checking");
    await wait(950);
    if (entered === DEMO_CODE) {
      setStep("done");
      return;
    }
    navigator.vibrate?.([35, 45, 35]);
    setShakeKey((k) => k + 1);
    setStep("code");
    await selloSays("Hmm, that code isn't right. Check your email and try again.");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "email" && EMAIL.test(email.trim())) submitEmail(email.trim());
    if (step === "code" && code.length === 6) submitCode();
  };

  // "You're in" sheet grows out of the circular button
  useLayoutEffect(() => {
    if (step !== "done") return;
    const sheet = sheetRef.current;
    const btn = btnRef.current;
    if (!sheet || !btn) return;
    if (reduced()) {
      inkRef.current?.style.setProperty("opacity", "0");
      return;
    }
    const s = sheet.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const k = s.width / sheet.offsetWidth;
    const cx = b.left + b.width / 2;
    const r = PILL * k;
    const inset = [(b.top - s.top) / k, (s.right - (cx + r)) / k, (s.bottom - b.bottom) / k, (cx - r - s.left) / k]
      .map((v) => `${v.toFixed(1)}px`)
      .join(" ");
    sheet.animate([{ clipPath: `inset(${inset} round ${PILL}px)` }, { clipPath: "inset(0px 0px 0px 0px round 36px)" }], {
      duration: 620,
      easing: MORPH_EASE,
    });
    inkRef.current?.animate([{ opacity: 1 }, { opacity: 1, offset: 0.25 }, { opacity: 0 }], {
      duration: 520,
      easing: "ease-out",
      fill: "forwards",
    });
  }, [step]);

  const inputOpen = step === "email" || step === "code";
  const value = step === "code" || step === "checking" ? formatCode(code) : email;
  const ready = step === "email" ? EMAIL.test(email.trim()) : step === "code" && code.length === 6;
  const busy = step === "checking" || step === "done";
  const typingLine = inputOpen && value.length > 0;
  const lastId = msgs[msgs.length - 1]?.id;

  return (
    <form className={`${base.screen} ${embedded ? styles.embedded : ""}`} onSubmit={onSubmit} noValidate>
      <TopBar progress={step === "email" || msgs.length < 2 ? 0.5 : 1} from={0} backHref="/" onBack={onBack} />
      <span className={base.chip}>Create Account</span>

      <div className={styles.thread} ref={threadRef} aria-live="polite">
        {msgs.map((m, i) => (
          <Bubble
            key={m.id}
            msg={m}
            grouped={msgs[i - 1]?.from === m.from}
            dim={m.id !== lastId ? "past" : typingLine ? "soft" : undefined}
          />
        ))}
        {typing && <Typing />}

        {inputOpen && (
          <LyricField
            key={step}
            inputRef={inputRef}
            lineRef={lineRef}
            label={step === "email" ? "Email address" : "Six-digit verification code"}
            value={value}
            placeholder={step === "email" ? "example@gmail.com" : "123 456"}
            type={step === "email" ? "email" : "code"}
            onChange={(v) => (step === "email" ? setEmail(v) : setCode(v.replace(/\D/g, "").slice(0, 6)))}
          />
        )}
      </div>

      <div className={base.actions}>
        <button
          key={shakeKey}
          ref={btnRef}
          type="submit"
          className={`${base.btn} ${base.primary} ${busy ? base.shrink : ""} ${shakeKey && !busy ? styles.shake : ""}`}
          style={step === "done" ? { visibility: "hidden" } : undefined}
          disabled={!ready && !busy}
          aria-busy={step === "checking"}
        >
          {busy ? <span className={base.busy} aria-label="Checking code" /> : "Verify"}
        </button>
        {(step === "email" || (step === "sending" && msgs.length < 2)) && (
          <button
            type="button"
            className={`${base.btn} ${base.primary} ${styles.google}`}
            disabled={step !== "email"}
            onClick={() => submitEmail("amara@gmail.com")}
          >
            <GoogleMark />
            Continue with google
          </button>
        )}
      </div>

      {step === "done" && (
        <div className={base.overlay} role="dialog" aria-modal="true" aria-labelledby="youre-in">
          <span className={base.scrim} />
          <div className={base.sheet} ref={sheetRef}>
            <span className={base.ink} ref={inkRef} aria-hidden="true" />
            <div className={base.sheetIcon}>
              <Sello3DIcon size={124} />
            </div>
            <h2 id="youre-in" className={base.sheetTitle}>You&apos;re in!</h2>
            <p className={base.sheetSub}>Now let&apos;s teach Sello about your shop. It takes less than 5 minutes.</p>
            <Link href="/shop-setup" className={`${base.btn} ${base.primary}`} autoFocus>
              Set up your shop
            </Link>
          </div>
        </div>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Bubble({ msg, dim, grouped }: { msg: Msg; dim?: "past" | "soft"; grouped?: boolean }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const mine = msg.from === "me";

  // FLIP: my line flies from the big field up into its bubble
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!mine || !msg.flip || !el || reduced()) return;
    const to = el.getBoundingClientRect();
    const k = to.width / el.offsetWidth || 1;
    const scale = msg.flip.height / to.height;
    const dx = (msg.flip.left - to.left) / k;
    const dy = (msg.flip.top - to.top) / k;
    el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${scale})` }, { transform: "none" }], {
      duration: 560,
      easing: MORPH_EASE,
    });
    bgRef.current?.animate(
      [
        { opacity: 0, transform: "scale(0.86)" },
        { opacity: 0, transform: "scale(0.86)", offset: 0.25 },
        { opacity: 1, transform: "none" },
      ],
      { duration: 560, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${styles.row} ${mine ? styles.mine : styles.sello} ${dim === "past" ? styles.past : dim === "soft" ? styles.soft : ""} ${
        mine && msg.flip ? styles.flipped : ""
      }`}
    >
      {!mine && !grouped && (
        <span className={styles.meta}>
          Sello <time>{msg.time}</time>
        </span>
      )}
      <div className={styles.bubble}>
        <span className={styles.bg} ref={bgRef} aria-hidden="true" />
        <span className={styles.text} ref={textRef}>
          {mine
            ? msg.text
            : msg.text.split(" ").map((w, i) => (
                <span key={i} className={styles.word} style={{ animationDelay: `${i * 32}ms` }}>
                  {w}{" "}
                </span>
              ))}
        </span>
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className={`${styles.row} ${styles.sello}`} aria-label="Sello is typing">
      <div className={`${styles.bubble} ${styles.typing}`}>
        <span className={styles.bg} aria-hidden="true" />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

/**
 * The big input line. A real input sits underneath (native caret, paste, autofill);
 * on top, each character lights up as it arrives, like Apple Music lyrics.
 */
function LyricField(props: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  lineRef: React.RefObject<HTMLSpanElement | null>;
  label: string;
  value: string;
  placeholder: string;
  type: "email" | "code";
  onChange: (v: string) => void;
}) {
  const { inputRef, lineRef, label, value, placeholder, type, onChange } = props;
  const viewRef = useRef<HTMLDivElement>(null);
  const sync = () => {
    const i = inputRef.current;
    if (i && viewRef.current) viewRef.current.style.transform = `translateX(${-i.scrollLeft}px)`;
  };
  useLayoutEffect(sync);

  return (
    <div className={styles.lyric}>
      <label htmlFor="signup-field" className="sr-only">
        {label}
      </label>
      <input
        id="signup-field"
        ref={inputRef}
        className={`${base.field} ${styles.lyricInput}`}
        type={type === "email" ? "email" : "text"}
        inputMode={type === "email" ? "email" : "numeric"}
        autoComplete={type === "email" ? "email" : "one-time-code"}
        autoCapitalize="none"
        spellCheck={false}
        maxLength={type === "code" ? 7 : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={sync}
        onSelect={sync}
      />
      <div className={styles.lyricClip} aria-hidden="true">
        <div className={`${base.field} ${styles.lyricView}`} ref={viewRef}>
          <span ref={lineRef}>
            {value.split("").map((c, i) => (
              <span key={`${i}-${c}`} className={styles.ch}>
                {c}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#fff" d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.33Z" />
      <path fill="#fff" d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H3.06v2.58A10 10 0 0 0 12 22Z" opacity=".85" />
      <path fill="#fff" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.06a10 10 0 0 0 0 8.96L6.4 13.9Z" opacity=".7" />
      <path fill="#fff" d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.52L6.4 10.1C7.19 7.74 9.4 5.98 12 5.98Z" opacity=".55" />
    </svg>
  );
}
