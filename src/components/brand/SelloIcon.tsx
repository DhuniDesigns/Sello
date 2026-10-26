type Props = { size?: number; className?: string };

/** Sello app icon: cream bubble buddy on an orange tile, with the black "needs you" dot. */
export function SelloIcon({ size = 56, className }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Sello"
    >
      <rect width="100" height="100" rx="23" fill="#F3642A" />
      <g transform="translate(18 17.5) scale(0.64)">
        <path
          fill="#F5E9DB"
          d="M42 10H58C63.43 10 68.44 11.05 72.84 12.99C72.62 13.96 72.5 14.96 72.5 16C72.5 23.46 78.54 29.5 86 29.5C87.04 29.5 88.04 29.38 89.01 29.16C90.95 33.56 92 38.57 92 44V46C92 65.9 77.9 80 58 80H45C39.5 86.5 30.5 90.5 19.5 91C23.5 86.5 25 81 24 76.5C14 70.8 8 59.8 8 46V44C8 24.1 22.1 10 42 10Z"
        />
        <rect x="36" y="30" width="10" height="25" rx="5" fill="#F3642A" />
        <rect x="54" y="30" width="10" height="25" rx="5" fill="#F3642A" />
        <circle cx="86" cy="16" r="9" fill="#111111" />
      </g>
    </svg>
  );
}
