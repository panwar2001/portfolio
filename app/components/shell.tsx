import { Link } from "react-router";

import { ArrowLeftIcon, socialIcons } from "./icons";
import type { Profile } from "~/lib/types";

interface FooterProps {
  profile: Profile;
  appCount: number;
}

/** A single quiet footer line, the way the reference portfolio ends. */
export function SiteFooter({ profile, appCount }: FooterProps) {
  return (
    <footer
      className="faint flex flex-wrap items-center justify-between gap-3"
      style={{
        fontSize: 12,
        marginTop: 28,
        paddingTop: 18,
        borderTop: "1px solid var(--border)",
      }}
    >
      <span>
        © {new Date().getUTCFullYear()} {profile.name}
      </span>
      <span>{appCount} apps shipped</span>
    </footer>
  );
}

/**
 * Sticky bar for small screens. Carries the social links plus a home link on
 * inner pages, and scrolls away with the page (the sidebar already introduces
 * him on the home page).
 */
export function MobileNav({ profile, home = true }: { profile: Profile; home?: boolean }) {
  return (
    <nav
      className="lg:hidden surface flex items-center justify-between gap-2"
      style={{ padding: "9px 12px", marginBottom: 16 }}
    >
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--font-serif)",
          fontSize: 16,
        }}
        className="hover:opacity-80"
      >
        {home ? (
          profile.name
        ) : (
          <>
            <ArrowLeftIcon size={14} />
            All apps
          </>
        )}
      </Link>
      <span className="flex items-center gap-1">
        {profile.socials.slice(0, 4).map((social) => {
          const Icon = socialIcons[social.icon] ?? socialIcons.globe;
          return (
            <a
              key={social.label}
              href={social.url}
              className="social-icon"
              aria-label={social.label}
              style={{ width: 30, height: 30 }}
              {...(social.url.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              <Icon size={14} />
            </a>
          );
        })}
      </span>
    </nav>
  );
}
