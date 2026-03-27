"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Mail, MessageSquareText, Phone, Sparkles, X } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

type ModalStep = "wheel" | "success" | "form" | "submitted";
type FormErrors = {
  email?: string;
  phone?: string;
};

const wheelStyle = {
  background:
    "conic-gradient(from -90deg, #35ff6b 0deg 3.6deg, #8f122e 3.6deg 360deg)",
} satisfies CSSProperties;

const GREEN_SLICE_SIZE = 3.6;
const GREEN_TARGET_OFFSET = 90 - GREEN_SLICE_SIZE / 2;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[+\d\s().-]{7,25}$/.test(value);
}

function playExplosionSound() {
  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const duration = 1.45;
  const now = audioContext.currentTime;
  const frequencies = [523.25, 659.25, 783.99, 1046.5];

  frequencies.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const startTime = now + index * 0.045;

    oscillator.type = index % 2 === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 1.45,
      startTime + 0.22,
    );

    filter.type = "highpass";
    filter.frequency.setValueAtTime(180, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  });

  const shimmer = audioContext.createOscillator();
  const shimmerGain = audioContext.createGain();
  shimmer.type = "triangle";
  shimmer.frequency.setValueAtTime(1567.98, now + 0.08);
  shimmer.frequency.exponentialRampToValueAtTime(2093, now + 0.45);
  shimmerGain.gain.setValueAtTime(0.0001, now + 0.08);
  shimmerGain.gain.exponentialRampToValueAtTime(0.1, now + 0.12);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(audioContext.destination);
  shimmer.start(now + 0.08);
  shimmer.stop(now + 0.84);
}

function playSpinSound() {
  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const duration = 4.6;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(480, now);
  oscillator.frequency.exponentialRampToValueAtTime(140, now + duration);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(980, now);
  filter.frequency.exponentialRampToValueAtTime(220, now + duration);
  filter.Q.setValueAtTime(1.2, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.015, now + duration - 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + duration);
}

function playConfirmationSound() {
  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const now = audioContext.currentTime;
  const notes = [523.25, 659.25, 783.99];

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.11);

    gain.gain.setValueAtTime(0.0001, now + index * 0.11);
    gain.gain.exponentialRampToValueAtTime(0.22, now + index * 0.11 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.11 + 0.35);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now + index * 0.11);
    oscillator.stop(now + index * 0.11 + 0.38);
  });
}

export function LuckySpinSection() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [step, setStep] = useState<ModalStep>("wheel");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);
  const spinTimeoutRef = useRef<number | null>(null);
  const revealTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current);
      if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
    };
  }, []);

  const closeModal = () => {
    window.dispatchEvent(new CustomEvent("lucky-spin:close"));
    if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current);
    if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
    setIsOpen(false);
    setIsSpinning(false);
    setStep("wheel");
    setError("");
    setFieldErrors({});
    setShakeForm(false);
    setIsSubmitting(false);
  };

  const openModal = () => {
    window.dispatchEvent(new CustomEvent("lucky-spin:open"));
    setRotation(0);
    setStep("wheel");
    setEmail("");
    setPhone("");
    setMessage("");
    setError("");
    setFieldErrors({});
    setShakeForm(false);
    setIsOpen(true);
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setError("");
    setStep("wheel");
    playSpinSound();

    const extraTurns = 7 + Math.floor(Math.random() * 3);
    const totalRotation = extraTurns * 360 + GREEN_TARGET_OFFSET;

    setRotation((current) => current + totalRotation);

    spinTimeoutRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      playExplosionSound();
      revealTimeoutRef.current = window.setTimeout(() => {
        setStep("success");
      }, 1000);
    }, 5000);
  };

  const triggerValidationFeedback = (errors: FormErrors, messageText: string) => {
    setFieldErrors(errors);
    setError(messageText);
    setShakeForm(true);
    window.setTimeout(() => setShakeForm(false), 520);
  };

  const submitPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const nextErrors: FormErrors = {};

    if (!isValidEmail(email.trim())) {
      nextErrors.email = "Geçerli bir mail adresi girin.";
    }

    if (!isValidPhone(phone.trim())) {
      nextErrors.phone = "Geçerli bir telefon numarası girin.";
    }

    if (nextErrors.email || nextErrors.phone) {
      triggerValidationFeedback(nextErrors, "Lütfen hatalı alanları düzeltin.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/beer-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone,
          message,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        field?: "email" | "phone";
      };

      if (!response.ok || !payload.success) {
        const apiErrors: FormErrors = payload.field ? { [payload.field]: payload.message } : {};
        if (payload.field) {
          triggerValidationFeedback(apiErrors, payload.message ?? "Lütfen hatalı alanları düzeltin.");
        } else {
          setError(payload.message ?? "Form gönderilemedi. Lütfen tekrar deneyin.");
        }
        setIsSubmitting(false);
        return;
      }

      playConfirmationSound();
      setStep("submitted");
      setIsSubmitting(false);
    } catch {
      setError("Bağlantı sırasında hata oluştu. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  };

  const invalidFieldClass =
    "border-rose-400/50 shadow-[0_0_0_1px_rgba(251,113,133,0.22),0_0_24px_rgba(251,113,133,0.18)]";

  return (
    <>
      <section className="relative py-8 sm:py-10">
        <Reveal>
          <div className="section-shell-wide">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/28" />
              <div className="group relative shrink-0 overflow-visible">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[14%] top-[42%] z-0 text-[2rem] font-black leading-none text-white opacity-0 transition-all duration-700 ease-out [text-shadow:-2px_-2px_0_#ff5e00,2px_-2px_0_#ff5e00,-2px_2px_0_#ff5e00,2px_2px_0_#ff5e00,0_0_18px_rgba(255,94,0,0.4)] group-hover:top-[-98%] group-hover:opacity-100"
                >
                  ?
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[26%] z-0 -translate-x-1/2 text-[2.7rem] font-black leading-none text-white opacity-0 transition-all duration-700 delay-75 ease-out [text-shadow:-2px_-2px_0_#ff5e00,2px_-2px_0_#ff5e00,-2px_2px_0_#ff5e00,2px_2px_0_#ff5e00,0_0_22px_rgba(255,94,0,0.45)] group-hover:top-[-126%] group-hover:opacity-100"
                >
                  ?
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[14%] top-[40%] z-0 text-[2.1rem] font-black leading-none text-white opacity-0 transition-all duration-700 delay-150 ease-out [text-shadow:-2px_-2px_0_#ff5e00,2px_-2px_0_#ff5e00,-2px_2px_0_#ff5e00,2px_2px_0_#ff5e00,0_0_18px_rgba(255,94,0,0.4)] group-hover:top-[-108%] group-hover:opacity-100"
                >
                  ?
                </span>
                <button
                  type="button"
                  onClick={openModal}
                  className="relative z-10 inline-flex items-center justify-center rounded-full border border-[#ff5e00]/55 bg-[#ff5e00] px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_0_0_1px_rgba(255,94,0,0.24),0_18px_40px_rgba(255,94,0,0.28)] transition-transform duration-300 hover:-translate-y-0.5 sm:px-8 sm:text-xs"
                >
                  KENDİNİ ŞANSLI HİSSEDİYORSAN TIKLA
                </button>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/28" />
            </div>
          </div>
        </Reveal>
      </section>

      {mounted && isOpen
        ? createPortal(
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[180] flex items-center justify-center bg-black/84 p-3 sm:p-6"
                onClick={closeModal}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={
                    shakeForm
                      ? { opacity: 1, scale: 1, y: [0, -4, 4, -3, 3, 0], x: [0, -7, 7, -5, 5, 0] }
                      : { opacity: 1, scale: 1, y: 0, x: 0 }
                  }
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={{ duration: shakeForm ? 0.45 : 0.3, ease: "easeOut" }}
                  className="glass-panel soft-outline relative w-full max-w-4xl overflow-hidden rounded-[34px] p-5 sm:p-8"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,0,0.16),transparent_34%)]" />
                  <button
                    type="button"
                    onClick={closeModal}
                    className="glow-hover absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/80 transition hover:text-white"
                    aria-label="Kapat"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {step === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      className="relative flex min-h-[480px] flex-col items-center justify-center text-center"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(53,255,107,0.16),transparent_42%)]" />
                      <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/14 text-emerald-300 shadow-[0_0_48px_rgba(53,255,107,0.34)]">
                        <Sparkles className="h-8 w-8" />
                      </div>
                      <h3 className="relative mt-8 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
                        TEBRİKLER BENİMLE BİRA İÇMEYE HAK KAZANDINIZ!
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep("form")}
                        className="glow-hover relative mt-8 inline-flex rounded-full border border-emerald-300/30 bg-emerald-400/14 px-6 py-3 text-sm font-semibold text-white"
                        style={{ "--hover-glow": "#35ff6b" } as CSSProperties}
                      >
                        PLANLA
                      </button>
                    </motion.div>
                  ) : step === "form" ? (
                    <div className="relative mx-auto w-full max-w-2xl">
                      <motion.form
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={submitPlan}
                        className="space-y-4 rounded-[26px] border border-white/10 bg-black/28 p-5 sm:p-6"
                      >
                        <div>
                          <p className="font-display text-xl font-semibold text-white">
                            Planı başlatalım
                          </p>
                          <p className="mt-2 text-sm text-white/65">
                            Mail, telefon ve istersen kısa bir not bırak.
                          </p>
                        </div>

                        <label className="block space-y-2">
                          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50">
                            <Mail className="h-3.5 w-3.5" />
                            Mail
                          </span>
                          <input
                            type="email"
                            value={email}
                            onChange={(event) => {
                              setEmail(event.target.value);
                              if (fieldErrors.email) {
                                setFieldErrors((current) => ({ ...current, email: undefined }));
                              }
                            }}
                            required
                            className={`w-full rounded-2xl border bg-white/6 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--color-accent)]/50 focus:bg-white/10 ${
                              fieldErrors.email ? invalidFieldClass : "border-white/10"
                            }`}
                            placeholder="ornek@mail.com"
                          />
                        </label>

                        <label className="block space-y-2">
                          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50">
                            <Phone className="h-3.5 w-3.5" />
                            Telefon numarası
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(event) => {
                              setPhone(event.target.value);
                              if (fieldErrors.phone) {
                                setFieldErrors((current) => ({ ...current, phone: undefined }));
                              }
                            }}
                            required
                            className={`w-full rounded-2xl border bg-white/6 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--color-accent)]/50 focus:bg-white/10 ${
                              fieldErrors.phone ? invalidFieldClass : "border-white/10"
                            }`}
                            placeholder="+90 5xx xxx xx xx"
                          />
                        </label>

                        <label className="block space-y-2">
                          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50">
                            <MessageSquareText className="h-3.5 w-3.5" />
                            Mesaj
                          </span>
                          <textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--color-accent)]/50 focus:bg-white/10"
                            placeholder="İstersen kısa bir not bırakabilirsin."
                          />
                        </label>

                        {error ? (
                          <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                            {error}
                          </p>
                        ) : null}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="glow-hover inline-flex rounded-full border border-[var(--color-accent)]/35 bg-[rgba(255,94,0,0.14)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-70"
                        >
                          {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                        </button>
                      </motion.form>
                    </div>
                  ) : step === "submitted" ? (
                    <div className="relative mx-auto w-full max-w-2xl">
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[26px] border border-sky-300/20 bg-sky-300/10 p-5"
                      >
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-300/16 text-sky-200 shadow-[0_0_32px_rgba(125,211,252,0.28)]">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0.6 }}
                            animate={{ scale: [0.9, 1.08, 1], opacity: 1 }}
                            transition={{ duration: 0.55 }}
                          >
                            <CheckCircle2 className="h-7 w-7" />
                          </motion.div>
                        </div>
                        <p className="mt-4 font-display text-2xl font-semibold text-white">
                          En kısa sürede size dönüş sağlayacağız.
                        </p>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                      <div className="space-y-5">
                        <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent)]">
                          Şans çarkı
                        </p>
                        <h3 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                          Şansını dene ve kazan!
                        </h3>
                        <p className="max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                          Çok düşük bir şans gibi gözükebilir, ama hiçbir şey
                          imkansız değildir..
                        </p>
                      </div>

                      <div className="relative mx-auto w-full max-w-[420px]">
                        <div className="relative aspect-square rounded-full border border-white/10 bg-black/35 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
                          <div className="absolute left-1/2 top-2 z-20 h-0 w-0 -translate-x-1/2 border-x-[16px] border-b-0 border-t-[24px] border-x-transparent border-t-white drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]" />
                          <motion.div
                            animate={{ rotate: rotation }}
                            transition={{
                              duration: isSpinning ? 4.9 : 0,
                              ease: [0.15, 0.85, 0.12, 1],
                            }}
                            className="relative h-full w-full rounded-full border-[10px] border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.35),0_0_50px_rgba(255,94,0,0.1)]"
                            style={wheelStyle}
                          >
                            <div className="absolute inset-[10%] rounded-full border border-white/8 bg-[radial-gradient(circle,rgba(255,255,255,0.04),rgba(0,0,0,0.28))]" />
                            <div className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-center font-display text-xs uppercase tracking-[0.28em] text-white/70">
                              EB
                            </div>
                          </motion.div>
                        </div>

                        <div className="mt-5 flex justify-center">
                          <button
                            type="button"
                            onClick={spinWheel}
                            disabled={isSpinning || step !== "wheel"}
                            className="glow-hover inline-flex rounded-full border border-[var(--color-accent)]/35 bg-[rgba(255,94,0,0.14)] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSpinning ? "Çark dönüyor..." : "Çarkı çevir"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
