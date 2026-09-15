import type { ReactElement, SVGProps } from "react";

/**
 * Hand-rolled inline icons — no icon dependency, so the whole site stays
 * a couple of KB of markup.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    ...props,
  } as const;
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M3.6 1.8a1.5 1.5 0 0 0-.6 1.2v18a1.5 1.5 0 0 0 .6 1.2l10.2-10.2zM15.2 13.4 5.5 23.1l11.3-6.5zm3.9-2.2-2.6-1.5-2.3 2.3 2.3 2.3 2.6-1.5c1.1-.7 1.1-2.4 0-3.1zM5.5.9l9.7 9.7 2.6-2.6z" />
    </svg>
  );
}

export function AppStoreIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M16.36 12.72c.02 2.6 2.28 3.46 2.3 3.47-.02.06-.36 1.23-1.19 2.44-.72 1.05-1.46 2.1-2.64 2.12-1.15.02-1.52-.68-2.84-.68-1.31 0-1.72.66-2.81.7-1.13.04-1.99-1.13-2.71-2.18-1.48-2.14-2.61-6.05-1.09-8.69.75-1.31 2.1-2.14 3.56-2.16 1.11-.02 2.16.75 2.84.75.68 0 1.96-.92 3.31-.79.56.03 2.15.2 3.17 1.55-.08.05-1.9 1.11-1.88 3.3zM14.3 5.75c.6-.73 1.01-1.74 0.9-2.75-.87.04-1.93.58-2.55 1.31-.56.64-1.05 1.67-.92 2.66.97.07 1.96-.49 2.57-1.22z" />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C17.6 4.4 18.6 4.7 18.6 4.7c.6 1.7.2 2.9.1 3.2.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6a11.5 11.5 0 0 0 7.8-10.9A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM2.4 21.5h5.2V9.4H2.4zM10 9.4h5v1.7h.1c.7-1.3 2.4-2.1 4-1.8 3 .4 4.6 2 4.6 5.5v6.7h-5.2v-6c0-1.5-.5-2.5-1.9-2.5-1.1 0-1.8.7-2.1 1.5-.1.3-.1.7-.1 1v6h-5.2z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-4.72-6.23-5.4 6.23H2.74l7.73-8.84L2.25 2.25h6.83l4.25 5.62zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6z" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="2.8" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="m12 2.8 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.6l6.5-.9z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function DatabaseIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** LeetCode's stacked-bars mark, with the stem of the "L". */
export function LeetcodeIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.9}>
      <path
        d="M13.3 2.6 5.2 10.7a2.6 2.6 0 0 0 0 3.7l6.9 6.9a2.6 2.6 0 0 0 3.7 0l2.1-2.1"
        strokeLinecap="round"
      />
      <path d="M8.6 12h11.2" strokeLinecap="round" />
      <path d="M15.6 7.4h4.2" strokeLinecap="round" />
    </svg>
  );
}

export const socialIcons = {
  play: PlayIcon,
  appstore: AppStoreIcon,
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  leetcode: LeetcodeIcon,
  mail: MailIcon,
  globe: GlobeIcon,
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
} as const;

/** Store/marketplace icons keyed by `Platform` and by `LinkKind`. */
export const storeIcons: Record<string, (props: IconProps) => ReactElement> = {
  android: PlayIcon,
  ios: AppStoreIcon,
  web: GlobeIcon,
  play: PlayIcon,
  appstore: AppStoreIcon,
  website: GlobeIcon,
  privacy: GlobeIcon,
  other: GlobeIcon,
};
