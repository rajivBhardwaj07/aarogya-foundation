/**
 * Counts a number up from 0 once it scrolls into view (IntersectionObserver).
 * Respects prefers-reduced-motion: shows the final value immediately.
 */
import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '../lib/format.js';

export default function CountUp({ value = 0, suffix = '', duration = 1600 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
            setDisplay(Math.round(eased * value));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className="data tabular-nums">
      {formatNumber(display)}
      {suffix}
    </span>
  );
}
