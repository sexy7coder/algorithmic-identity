import { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ThemeItem {
  title: string;
  surface?: string;
  deeper?: string;
  description?: string;
}

interface AnalysisResult {
  vibe: string;
  algorithmicPersona: string;
  topThemes: ThemeItem[];
  emotionalLandscape?: string;
  missing: string;
  blindSpots: string;
  mirrorMoment?: string;
  shadowTruth?: string;
}

const INNER_W = 452; // 540px card − 44px padding × 2

// Draws the vibe name as a gradient onto a <canvas> so html2canvas captures it.
// CSS background-clip:text is invisible in html2canvas; canvas pixel data is not.
const VibeCanvas = ({ text }: { text: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const FONT_SIZE = 60;
      const LINE_H = FONT_SIZE * 1.08;
      const fontDecl = `800 ${FONT_SIZE}px "Outfit", "Inter", Arial, sans-serif`;

      // Measure pass: calculate needed height
      canvas.width = INNER_W;
      canvas.height = 10; // temp — triggers a clear, but we need width set first
      ctx.font = fontDecl;

      const words = text.split(' ');
      let line = '';
      const lines: string[] = [];
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > INNER_W - 2 && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      lines.push(line);

      const totalH = Math.ceil(lines.length * LINE_H + 6);
      canvas.height = totalH;
      // Setting height clears the canvas — redraw
      ctx.font = fontDecl;
      ctx.textBaseline = 'top';

      const grad = ctx.createLinearGradient(0, 0, INNER_W, 0);
      grad.addColorStop(0, '#f09433');
      grad.addColorStop(0.38, '#dc2743');
      grad.addColorStop(1, '#bc1888');
      ctx.fillStyle = grad;

      lines.forEach((l, i) => ctx.fillText(l, 0, i * LINE_H));
    };

    // Wait for Outfit to be loaded so canvas uses the right font metrics
    if (document.fonts?.load) {
      document.fonts.load(`800 60px "Outfit"`).then(draw).catch(draw);
    } else {
      draw();
    }
  }, [text]);

  return <canvas ref={ref} style={{ display: 'block' }} />;
};

const CardContent = forwardRef<HTMLDivElement, { data: AnalysisResult }>(
  ({ data }, ref) => {
    const truth =
      data.shadowTruth ||
      data.mirrorMoment ||
      "Your feed reveals what you won't say out loud.";

    return (
      <div
        ref={ref}
        data-share-card="1"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0px',
          width: '540px',
          height: '960px',
          backgroundColor: '#0a0a0a',
          fontFamily: "'Outfit', 'Inter', Arial, sans-serif",
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle Instagram gradient bloom — very faint */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-60px',
          width: '340px', height: '340px',
          background: 'radial-gradient(ellipse at center, rgba(188,24,136,0.09) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-40px',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(240,148,51,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* ── CLASSIFIED HEADER BAR (keep as-is per brief) ─────────────────── */}
        <div style={{
          backgroundColor: '#f09433',
          padding: '11px 44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          fontFamily: "'Space Mono', 'Courier New', Courier, monospace",
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '0.18em' }}>
            ■ ALGORITHMIC PROFILE
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '0.12em' }}>
            [CLASSIFIED]
          </span>
        </div>

        {/* Thin gradient rule below header */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(to right, #f09433, #dc2743, #bc1888)',
          flexShrink: 0,
        }} />

        {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '44px 44px 44px',
          position: 'relative',
          zIndex: 1,
        }}>

          {/* Instagram logo mark */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '36px',
          }}>
            {/* Camera icon with Instagram gradient stroke */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <defs>
                <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" stroke="url(#ig-grad)" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-grad)" />
            </svg>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.32)',
              letterSpacing: '0.06em',
            }}>
              Instagram
            </span>
          </div>

          {/* Identity label — exact text per brief */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.42)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              lineHeight: 1.55,
            }}>
              MY INSTAGRAM ALGORITHM
            </div>
            <div style={{
              fontSize: '19px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.78)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              THINKS I AM
            </div>
          </div>

          {/* Vibe name — Instagram gradient via canvas (captured by html2canvas) */}
          <div style={{ marginBottom: '32px' }}>
            <VibeCanvas text={(data.vibe || 'Unknown').toUpperCase()} />
          </div>

          {/* Instagram gradient accent line */}
          <div style={{
            width: '56px',
            height: '3px',
            background: 'linear-gradient(to right, #f09433, #dc2743, #bc1888)',
            borderRadius: '2px',
            marginBottom: '34px',
          }} />

          {/* Shadow Truth label */}
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#f09433',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              Shadow Truth
            </span>
          </div>

          {/* Shadow Truth text */}
          <div style={{
            fontSize: '20px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.55,
            fontStyle: 'italic',
            flex: 1,
          }}>
            "{truth}"
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '20px',
            textAlign: 'center',
          }}>
            <span style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.05em',
            }}>
              An experiment by Meet Ahluwalia
            </span>
          </div>
        </div>
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

const ShareCard = forwardRef<HTMLDivElement, { data: AnalysisResult }>(
  (props, ref) => createPortal(<CardContent ref={ref} {...props} />, document.body)
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
