import { Home, MessageCircle, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  /** Show the bottom nav bar (default: true) */
  showNav?: boolean;
  /** Custom header content; if omitted, renders default header */
  header?: React.ReactNode;
}

/**
 * App shell — mobile-first, max-w-md, WhatsApp-style.
 * - Dark green header (accent color)
 * - White/beige content area
 * - Bottom navigation bar with Home + Settings
 */
export function AppLayout({
  children,
  showNav = true,
  header,
}: AppLayoutProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      path: "/chats",
      icon: MessageCircle,
      label: t("conversations.title"),
      ocid: "nav.conversations_tab",
    },
    {
      path: "/settings",
      icon: Settings,
      label: t("settings.title"),
      ocid: "nav.settings_tab",
    },
  ] as const;

  const isActive = (path: string) =>
    path === "/chats"
      ? location.pathname === "/chats" || location.pathname.startsWith("/chat/")
      : location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-muted">
      {/* Phone-frame container */}
      <div className="relative flex w-full max-w-md flex-1 flex-col bg-background shadow-2xl min-h-screen">
        {/* Header slot */}
        {header !== undefined ? (
          header
        ) : (
          <header
            className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: "oklch(0.28 0.10 163)" }}
          >
            <div className="flex items-center gap-2">
              <Home size={22} className="text-white opacity-90" />
              <span className="font-display text-lg font-bold tracking-wide text-white">
                MyApp
              </span>
            </div>
          </header>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Bottom navigation */}
        {showNav && (
          <nav
            className="sticky bottom-0 z-30 flex border-t border-border bg-card"
            aria-label="Main navigation"
          >
            {navItems.map(({ path, icon: Icon, label, ocid }) => (
              <Link
                key={path}
                to={path}
                data-ocid={ocid}
                className={[
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors duration-200",
                  isActive(path)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
                aria-current={isActive(path) ? "page" : undefined}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive(path) ? 2.5 : 1.8}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

export default AppLayout;
