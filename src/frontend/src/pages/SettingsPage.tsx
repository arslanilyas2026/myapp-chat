import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Camera,
  Check,
  ChevronRight,
  Info,
  Lock,
  LogOut,
  Phone,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../components/Layout/AppLayout";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../i18n";

// ─── Mock user (replace with real Firebase auth user) ─────────────────────────
const MOCK_USER = {
  displayName: "Alex Rivera",
  phoneNumber: "+1 (555) 012-3456",
  initials: "AR",
};

// ─── App version ─────────────────────────────────────────────────────────────
const APP_VERSION = "1.0.0";

// ─── Native language labels ───────────────────────────────────────────────────
const NATIVE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

/**
 * SettingsPage — WhatsApp-style settings screen.
 * Fully localized via i18next. Language switching is instant.
 */
export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Sync language state with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(
      "myapp_language",
    ) as SupportedLanguage | null;
    if (
      saved &&
      SUPPORTED_LANGUAGES.includes(saved) &&
      saved !== i18n.language
    ) {
      void i18n.changeLanguage(saved);
    }
  }, [i18n]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    void i18n.changeLanguage(lang);
    localStorage.setItem("myapp_language", lang);
  };

  const currentLang = (i18n.language?.slice(0, 2) ?? "en") as SupportedLanguage;

  // ─── Header ─────────────────────────────────────────────────────────────────
  const settingsHeader = (
    <header
      className="sticky top-0 z-30 flex items-center px-4 py-3"
      style={{ backgroundColor: "oklch(0.28 0.10 163)" }}
    >
      <h1 className="font-display text-lg font-bold tracking-wide text-accent-foreground">
        {t("settings.title")}
      </h1>
    </header>
  );

  return (
    <AppLayout header={settingsHeader}>
      <div className="flex flex-col bg-muted pb-8" data-ocid="settings.page">
        {/* ── Profile Card ────────────────────────────────────────────────── */}
        <div
          className="relative flex items-center gap-4 bg-card px-5 py-5"
          data-ocid="settings.profile_section"
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-accent-foreground shadow-md"
              style={{ backgroundColor: "oklch(var(--primary))" }}
              aria-label={t("settings.profile")}
            >
              {MOCK_USER.initials}
            </div>
            {/* Camera overlay button */}
            <button
              type="button"
              aria-label={t("settings.changePhoto")}
              data-ocid="settings.change_photo_button"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card shadow transition-smooth"
              style={{ backgroundColor: "oklch(var(--primary))" }}
            >
              <Camera size={13} className="text-accent-foreground" />
            </button>
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-bold text-foreground">
              {MOCK_USER.displayName}
            </p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {MOCK_USER.phoneNumber}
            </p>
          </div>
        </div>

        <div className="h-2 bg-muted" />

        {/* ── Section 1: Account ──────────────────────────────────────────── */}
        <section
          aria-labelledby="section-account"
          data-ocid="settings.account_section"
        >
          <h2
            id="section-account"
            className="px-5 pb-1.5 pt-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--primary))" }}
          >
            {t("settings.account")}
          </h2>
          <div className="bg-card">
            <SettingsRow
              icon={
                <Shield size={20} style={{ color: "oklch(var(--primary))" }} />
              }
              label={t("settings.privacy")}
              ocid="settings.privacy_row"
            />
            <SettingsRow
              icon={
                <Lock size={20} style={{ color: "oklch(var(--primary))" }} />
              }
              label={t("settings.security")}
              ocid="settings.security_row"
              hasDivider
            />
            <SettingsRow
              icon={
                <Phone size={20} style={{ color: "oklch(var(--primary))" }} />
              }
              label={t("settings.changeNumber")}
              ocid="settings.change_number_row"
              isLast
            />
          </div>
        </section>

        <div className="h-2 bg-muted" />

        {/* ── Section 2: App Language ──────────────────────────────────────── */}
        <section
          aria-labelledby="section-language"
          data-ocid="settings.language_section"
        >
          <h2
            id="section-language"
            className="px-5 pb-1.5 pt-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--primary))" }}
          >
            {t("settings.languageTitle")}
          </h2>
          <div className="bg-card">
            {SUPPORTED_LANGUAGES.map((lang, idx) => {
              const isActive = currentLang === lang;
              const isLast = idx === SUPPORTED_LANGUAGES.length - 1;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  data-ocid={`settings.language_option.${idx + 1}`}
                  className={[
                    "flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors duration-150",
                    !isLast ? "border-b border-border" : "",
                    "hover:bg-muted/40 active:bg-muted/60",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-pressed={isActive}
                >
                  {/* Color circle indicator */}
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-accent-foreground"
                    style={{
                      backgroundColor: isActive
                        ? "oklch(var(--primary))"
                        : "oklch(var(--muted))",
                      color: isActive
                        ? "oklch(var(--primary-foreground))"
                        : "oklch(var(--muted-foreground))",
                    }}
                  >
                    {lang.toUpperCase()}
                  </span>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={[
                        "text-sm font-medium",
                        isActive ? "text-foreground" : "text-foreground",
                      ].join(" ")}
                    >
                      {NATIVE_LABELS[lang]}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t(`settings.languages.${lang}`)}
                    </p>
                  </div>

                  {/* Active checkmark */}
                  {isActive && (
                    <Check
                      size={20}
                      strokeWidth={2.5}
                      style={{ color: "oklch(var(--primary))" }}
                      aria-label="selected"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <div className="h-2 bg-muted" />

        {/* ── Section 3: Notifications ─────────────────────────────────────── */}
        <section
          aria-labelledby="section-notifications"
          data-ocid="settings.notifications_section"
        >
          <h2
            id="section-notifications"
            className="px-5 pb-1.5 pt-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--primary))" }}
          >
            {t("settings.notifications")}
          </h2>
          <div className="bg-card">
            <div className="flex items-center gap-4 px-5 py-3.5">
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "oklch(var(--muted))" }}
              >
                <Bell size={20} style={{ color: "oklch(var(--primary))" }} />
              </span>
              <span className="flex-1 text-sm text-foreground">
                {t("settings.messageNotifications")}
              </span>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                aria-label={t("settings.messageNotifications")}
                data-ocid="settings.notifications_toggle"
              />
            </div>
          </div>
        </section>

        <div className="h-2 bg-muted" />

        {/* ── Section 4: General ───────────────────────────────────────────── */}
        <section
          aria-labelledby="section-general"
          data-ocid="settings.general_section"
        >
          <h2
            id="section-general"
            className="px-5 pb-1.5 pt-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--primary))" }}
          >
            {t("settings.general")}
          </h2>
          <div className="bg-card">
            {/* About / Version */}
            <div
              className="flex items-center gap-4 border-b border-border px-5 py-3.5"
              data-ocid="settings.about_row"
            >
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "oklch(var(--muted))" }}
              >
                <Info size={20} style={{ color: "oklch(var(--primary))" }} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{t("settings.about")}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("settings.appVersion")} {APP_VERSION}
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-muted-foreground flex-shrink-0"
              />
            </div>

            {/* Log out */}
            <button
              type="button"
              data-ocid="settings.logout_button"
              className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-muted/40 active:bg-muted/60"
              onClick={() => {
                // FIREBASE: signOut(auth) then navigate('/auth')
              }}
            >
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "oklch(var(--destructive) / 0.12)" }}
              >
                <LogOut
                  size={20}
                  style={{ color: "oklch(var(--destructive))" }}
                />
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "oklch(var(--destructive))" }}
              >
                {t("settings.logout")}
              </span>
            </button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

// ─── Reusable settings row ────────────────────────────────────────────────────
interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  ocid: string;
  hasDivider?: boolean;
  isLast?: boolean;
}

function SettingsRow({
  icon,
  label,
  ocid,
  hasDivider = false,
  isLast = false,
}: SettingsRowProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      className={[
        "flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-muted/40 active:bg-muted/60",
        !isLast && hasDivider ? "border-b border-border" : "",
        !isLast && !hasDivider ? "border-b border-border" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: "oklch(var(--muted))" }}
      >
        {icon}
      </span>
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <ChevronRight size={18} className="flex-shrink-0 text-muted-foreground" />
    </button>
  );
}
