import {
  type ApplicationVerifier,
  type ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ADMIN_CONFIG } from "../config/admin";
import { auth } from "../config/firebase";
// ADMIN: Firebase phone auth must be enabled in Firebase Console > Authentication > Sign-in method

type AuthStep = "phone" | "otp";

type FirebaseAuthError = {
  code: string;
  message: string;
};

function isFirebaseError(err: unknown): err is FirebaseAuthError {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as Record<string, unknown>).code === "string"
  );
}

function isValidPhone(phone: string): boolean {
  // E.164 format: + followed by 7–15 digits
  return /^\+[1-9]\d{6,14}$/.test(phone.replace(/[\s()\-]/g, ""));
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s()\-]/g, "");
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  // ─── reCAPTCHA setup ────────────────────────────────────────────────────────
  useEffect(() => {
    // Invisible reCAPTCHA — renders into #recaptcha-container
    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" },
    );
    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  // ─── Step 1: Send OTP ───────────────────────────────────────────────────────
  async function handleSendOtp() {
    setError(null);
    const normalized = normalizePhone(phone);

    if (!isValidPhone(normalized)) {
      setError(t("auth.errors.invalidPhone"));
      return;
    }

    setLoading(true);
    try {
      const verifier = recaptchaVerifierRef.current as ApplicationVerifier;
      const result = await signInWithPhoneNumber(auth, normalized, verifier);
      confirmationResultRef.current = result;
      setStep("otp");
    } catch (err) {
      if (isFirebaseError(err)) {
        if (err.code === "auth/too-many-requests") {
          setError(t("auth.errors.otpExpired"));
        } else {
          setError(t("auth.errors.otpFailed"));
        }
      } else {
        setError(t("auth.errors.otpFailed"));
      }
    } finally {
      setLoading(false);
    }
  }

  // ─── Step 2: Verify OTP ─────────────────────────────────────────────────────
  async function handleVerifyOtp() {
    setError(null);
    if (!confirmationResultRef.current) {
      setError(t("auth.errors.otpExpired"));
      return;
    }

    setLoading(true);
    try {
      const credential = await confirmationResultRef.current.confirm(otp);
      const userPhone = credential.user.phoneNumber ?? "";

      // ADMIN: Add allowed phone numbers to src/config/admin.ts
      if (
        ADMIN_CONFIG.allowedPhoneNumbers.length > 0 &&
        !ADMIN_CONFIG.allowedPhoneNumbers.includes(userPhone)
      ) {
        await auth.signOut();
        setError(t("auth.errors.notAllowed"));
        setLoading(false);
        return;
      }

      navigate("/");
    } catch (err) {
      if (isFirebaseError(err)) {
        if (
          err.code === "auth/code-expired" ||
          err.code === "auth/session-cookie-expired"
        ) {
          setError(t("auth.errors.otpExpired"));
        } else {
          setError(t("auth.errors.otpFailed"));
        }
      } else {
        setError(t("auth.errors.otpFailed"));
      }
    } finally {
      setLoading(false);
    }
  }

  // ─── Resend OTP ─────────────────────────────────────────────────────────────
  async function handleResend() {
    setOtp("");
    setError(null);
    setStep("phone");
    // Re-initialize reCAPTCHA for a fresh send
    recaptchaVerifierRef.current?.clear();
    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" },
    );
  }

  // ─── Keyboard submit ────────────────────────────────────────────────────────
  function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !loading) handleSendOtp();
  }

  function handleOtpKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !loading) handleVerifyOtp();
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-10"
      data-ocid="auth.page"
    >
      {/* ── Logo ── */}
      <div className="mb-9 flex flex-col items-center gap-3">
        <div
          className="flex h-[88px] w-[88px] items-center justify-center rounded-full shadow-md"
          style={{ backgroundColor: "oklch(var(--primary))" }}
          aria-hidden="true"
        >
          <MessageSquare
            className="h-11 w-11 text-primary-foreground"
            strokeWidth={1.8}
          />
        </div>
        <h1 className="font-display text-[2rem] font-extrabold leading-none tracking-tight text-foreground">
          {t("auth.title")}
        </h1>
        <p className="max-w-[220px] text-center text-sm leading-snug text-muted-foreground">
          {t("auth.subtitle")}
        </p>
      </div>

      {/* ── Card ── */}
      <div className="w-full max-w-[360px] rounded-2xl border border-border bg-card px-6 pb-7 pt-6 shadow-sm">
        {step === "phone" ? (
          /* ── Phone step ── */
          <>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-[13px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {t("auth.phoneLabel")}
            </label>

            {/* Phone row: static prefix + input */}
            <div className="flex overflow-hidden rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
              <span className="flex items-center border-r border-input bg-muted px-3.5 text-sm font-medium text-foreground select-none">
                {t("auth.countryCode")}
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={handlePhoneKeyDown}
                placeholder={t("auth.phonePlaceholder")}
                className="min-w-0 flex-1 bg-transparent py-3 pl-3 pr-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                disabled={loading}
                data-ocid="auth.phone_input"
                aria-label={t("auth.phoneLabel")}
                aria-describedby={error ? "auth-error" : undefined}
              />
            </div>

            {/* Error */}
            {error && (
              <p
                id="auth-error"
                className="mt-2.5 text-sm text-destructive"
                role="alert"
                data-ocid="auth.error_state"
              >
                {error}
              </p>
            )}

            {/* Send OTP button */}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading || !phone.trim()}
              className="mt-5 w-full rounded-xl py-3.5 text-[15px] font-bold text-primary-foreground transition-smooth disabled:opacity-50 active:scale-[0.98]"
              style={{ backgroundColor: "oklch(var(--primary))" }}
              data-ocid="auth.send_otp_button"
            >
              {loading ? t("auth.sendingOtp") : t("auth.sendOtp")}
            </button>

            {/* Terms notice */}
            <p className="mt-4 text-center text-[11px] leading-snug text-muted-foreground">
              {t("auth.termsNotice")}
            </p>
          </>
        ) : (
          /* ── OTP step ── */
          <>
            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setError(null);
                setOtp("");
              }}
              className="mb-4 flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:opacity-75"
              data-ocid="auth.back_button"
              aria-label={t("auth.backToPhone")}
            >
              {t("auth.backToPhone")}
            </button>

            {/* OTP sent notice */}
            <p className="mb-4 text-[13px] leading-snug text-muted-foreground">
              {t("auth.otpSent", { phone: normalizePhone(phone) })}
            </p>

            <label
              htmlFor="otp"
              className="mb-1.5 block text-[13px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {t("auth.otpLabel")}
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={handleOtpKeyDown}
              placeholder={t("auth.otpPlaceholder")}
              className="w-full rounded-xl border border-input bg-background py-3 text-center text-2xl font-bold tracking-[0.5em] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
              data-ocid="auth.otp_input"
              aria-label={t("auth.otpLabel")}
              aria-describedby={error ? "auth-error" : undefined}
            />

            {/* Error */}
            {error && (
              <p
                id="auth-error"
                className="mt-2.5 text-sm text-destructive"
                role="alert"
                data-ocid="auth.error_state"
              >
                {error}
              </p>
            )}

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
              className="mt-5 w-full rounded-xl py-3.5 text-[15px] font-bold text-primary-foreground transition-smooth disabled:opacity-50 active:scale-[0.98]"
              style={{ backgroundColor: "oklch(var(--primary))" }}
              data-ocid="auth.verify_button"
            >
              {loading ? t("auth.verifying") : t("auth.verifyOtp")}
            </button>

            {/* Resend link */}
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="mt-4 w-full text-center text-sm font-medium text-primary transition-colors hover:opacity-75 disabled:opacity-40"
              data-ocid="auth.resend_button"
            >
              {t("auth.resendOtp")}
            </button>
          </>
        )}
      </div>

      {/* Invisible reCAPTCHA mount point */}
      <div id="recaptcha-container" aria-hidden="true" />
    </div>
  );
}
