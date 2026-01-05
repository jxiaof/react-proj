export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main shape - stylized document with AI */}
      <g>
        {/* Document background */}
        <rect x="8" y="6" width="24" height="28" rx="2" fill="currentColor" opacity="0.1" />

        {/* Document outline */}
        <path
          d="M 10 6 L 30 6 Q 32 6 32 8 L 32 32 Q 32 34 30 34 L 10 34 Q 8 34 8 32 L 8 8 Q 8 6 10 6"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Text lines representing content */}
        <line x1="12" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="12" y1="19" x2="25" y2="19" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="12" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.6" />

        {/* AI spark in corner */}
        <g transform="translate(28, 10)">
          <circle cx="0" cy="0" r="3" fill="currentColor" />
          <circle cx="-2" cy="-2" r="1" fill="currentColor" opacity="0.4" />
          <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.4" />
          <circle cx="-2" cy="2" r="0.5" fill="currentColor" opacity="0.6" />
          <circle cx="2" cy="-2" r="0.5" fill="currentColor" opacity="0.6" />
        </g>
      </g>
    </svg>
  );
}