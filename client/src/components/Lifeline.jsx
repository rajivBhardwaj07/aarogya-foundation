/**
 * The signature element. A thin EKG/heartbeat pulse that doubles as a route
 * connecting "village" dots — tying HEALTH (the pulse) to HUMANITARIAN REACH
 * (connected communities). Used large in the hero and as a hairline section
 * divider. Honours prefers-reduced-motion (static line, no draw-in).
 * See /docs/design-system.md — "Signature element".
 */
import { useId } from 'react';

const PULSE_PATH =
  'M0 60 H120 l16 -34 14 64 22 -96 18 80 14 -26 12 12 H320 l16 -40 14 64 20 -50 16 26 H520 l18 -30 14 50 18 -70 16 60 14 -10 H820';

const DOTS = [120, 320, 520, 820];

export default function Lifeline({
  className = '',
  height = 120,
  color = 'currentColor',
  animate = true,
  showDots = true,
  strokeWidth = 2.5,
}) {
  const id = useId();
  return (
    <svg
      className={className}
      viewBox="0 0 840 120"
      width="100%"
      height={height}
      fill="none"
      preserveAspectRatio="none"
      role="img"
      aria-label="A heartbeat line tracing a route between communities"
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="12%" stopColor={color} stopOpacity="1" />
          <stop offset="88%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <path
        d={PULSE_PATH}
        stroke={`url(#grad-${id})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1000"
        className={animate ? 'motion-safe:animate-draw-line' : ''}
        style={animate ? {} : { strokeDashoffset: 0 }}
      />

      {showDots &&
        DOTS.map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy="60"
            r="5"
            fill={color}
            className="motion-safe:animate-pulse-dot"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
    </svg>
  );
}

/** A quiet hairline divider variant — recurs between sections. */
export function LifelineDivider({ className = '' }) {
  return (
    <div className={`text-healing/30 ${className}`} aria-hidden="true">
      <Lifeline height={40} animate={false} showDots={false} strokeWidth={1.5} />
    </div>
  );
}
