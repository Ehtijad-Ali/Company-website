import { useRef } from 'react';
import { useScrollSequence } from '../../hooks/useScrollSequence';

/**
 * Pinned, scroll-scrubbed image sequence.
 *
 * Layout: a tall <section> (scrollScreens × viewport height) holds a
 * `position: sticky` stage. While the section scrolls past, the stage stays
 * pinned and the scroll distance is mapped to frames; when the section ends
 * the stage is released and the page scrolls on. Scrolling back up re-enters
 * the pinned range and runs the same mapping in reverse.
 *
 * Children render in an overlay above the canvas. They can react to scroll
 * with pure CSS through the custom properties set on the section:
 *   --p     smoothed section progress, 0‥1 (includes the hold zones)
 *   --fp    smoothed frame progress,   0‥1 (first → last frame)
 *   --load  fraction of frames fetched, 0‥1
 * and through `[data-status="loading" | "ready"]` on the section.
 *
 * Props
 *   manifest      { count, digits, extension, tiers:{ lg, sm } }  (see scripts/extract-frames.sh)
 *   scrollScreens viewport heights of scroll to spend (default comes from CSS: --seq-screens)
 *   holdStart     share of the scroll spent on the first frame before playback starts
 *   holdEnd       share spent on the last frame after playback ends
 *   smoothing     damping rate in 1/s; higher = snappier, lower = silkier
 *   blend         cross-blend adjacent frames by the fractional frame position
 *   portraitFit   0 = whole frame visible … 1 = crop to fill, on tall screens
 *   background    hex colour matching the frame edges (letterbox / page)
 *   label         accessible description of the canvas
 *   onProgress    ({ progress, frameProgress, frame }) => void, called per rendered frame
 */
export default function ScrollSequence({
  manifest,
  scrollScreens,
  holdStart,
  holdEnd,
  smoothing,
  blend,
  portraitFit,
  portraitAnchorY,
  background,
  label,
  onProgress,
  className = '',
  children,
}) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  useScrollSequence(
    { sectionRef, stageRef, canvasRef },
    { manifest, holdStart, holdEnd, smoothing, blend, portraitFit, portraitAnchorY, background, onProgress },
  );

  const style = scrollScreens ? { '--seq-screens': scrollScreens } : undefined;

  return (
    <section ref={sectionRef} className={`seq ${className}`} data-status="loading" style={style}>
      <div ref={stageRef} className="seq__stage">
        <canvas ref={canvasRef} className="seq__canvas" role="img" aria-label={label} />
        <div className="seq__overlay">{children}</div>
      </div>
    </section>
  );
}
