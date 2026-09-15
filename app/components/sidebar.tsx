import { Link } from "react-router";

import { PinIcon, socialIcons, UsersIcon } from "./icons";
import { NewsletterBlock } from "./newsletter-form";
import { mobileProducts, totalInstallsLabel } from "~/lib/types";
import type { ExperienceItem, Product, Profile } from "~/lib/types";

interface SidebarProps {
  profile: Profile;
  experience: ExperienceItem[];
  products: Product[];
  /** Where the content came from — surfaced as a tiny link to /status. */
  source: "d1" | "mock";
  notice: string | null;
}

/**
 * Persistent left rail, following the reference portfolio: avatar, name,
 * location, audience count, italic tagline, newsletter form, social icons and
 * the experience timeline.
 */
export function Sidebar({
  profile,
  experience,
  products,
  source,
  notice,
}: SidebarProps) {
  const apps = mobileProducts(products);
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <aside className="sidebar w-full shrink-0 px-6 py-9 lg:sticky lg:top-0 lg:h-screen lg:w-[300px] lg:overflow-y-auto lg:pt-12 lg:pr-8 lg:pl-8">
      <div className="flex flex-col gap-5">
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            overflow: "hidden",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            display: "grid",
            placeItems: "center",
          }}
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              width={84}
              height={84}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                color: "var(--text-2)",
              }}
            >
              {initials}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 30,
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {profile.name}
          </h1>
          <span className="muted flex items-center gap-1.5 text-[13px]">
            <PinIcon size={14} />
            {profile.location}
          </span>
          <span className="muted flex items-center gap-1.5 text-[13px]">
            <UsersIcon size={14} />
            {totalInstallsLabel(products)} total installs
          </span>
        </div>

        <p
          className="muted"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 16,
            lineHeight: 1.45,
            margin: 0,
          }}
        >
          {profile.tagline}
        </p>

        <NewsletterBlock id="newsletter-sidebar" />

        <div className="flex flex-wrap items-center gap-2">
          {profile.socials.map((social) => {
            const Icon = socialIcons[social.icon] ?? socialIcons.globe;
            const external = !social.url.startsWith("mailto:");
            return (
              <a
                key={social.label}
                href={social.url}
                className="social-icon"
                aria-label={social.label}
                title={`${social.label} — ${social.url}`}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <Icon size={15} />
              </a>
            );
          })}
        </div>

        {experience.length ? (
          <div className="flex flex-col gap-3">
            <h2 className="eyebrow">Experience</h2>
            <ol className="flex list-none flex-col gap-4 p-0" style={{ margin: 0 }}>
              {experience.map((job, index) => (
                <li key={`${job.company}-${index}`} className="timeline">
                  <span
                    className={`timeline-dot${job.current ? " timeline-dot-current" : ""}`}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    {job.role}
                  </p>
                  <p className="muted" style={{ margin: "2px 0 0", fontSize: 12.5 }}>
                    {job.company}
                    <span className="faint"> · {job.period}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {profile.email ? (
          <a
            className="faint text-[12px] hover:opacity-80"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </a>
        ) : null}

        <p className="faint flex items-center gap-1.5" style={{ fontSize: 12, margin: 0 }}>
          {apps.length} apps shipped
          <span>·</span>
          <Link to="/status" className="hover:opacity-80" title={notice ?? undefined}>
            {source === "d1" ? "D1" : "mock"}
          </Link>
        </p>
      </div>
    </aside>
  );
}
