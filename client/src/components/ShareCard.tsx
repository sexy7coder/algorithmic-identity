import { forwardRef } from 'react';
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

const CardContent = forwardRef<HTMLDivElement, { data: AnalysisResult }>(
  ({ data }, ref) => {
    const truth = data.shadowTruth || data.mirrorMoment || "Your feed reveals what you won't say out loud.";

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
          backgroundColor: '#070707',
          fontFamily: "'Space Mono', 'Courier New', Courier, monospace",
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* CRT scanlines overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.14) 3px, rgba(0,0,0,0.14) 4px)',
          pointerEvents: 'none', zIndex: 10,
        }} />
        {/* Vignette — CRT screen edge darkening */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.72) 100%)',
          pointerEvents: 'none', zIndex: 10,
        }} />
        {/* Subtle amber glow at top-center */}
        <div style={{
          position: 'absolute', top: '-60px', left: '50%',
          transform: 'translateX(-50%)',
          width: '400px', height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(240,148,51,0.12) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 5,
        }} />

        {/* Classified header bar */}
        <div style={{
          backgroundColor: '#f09433',
          padding: '11px 44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative', zIndex: 20,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#070707', letterSpacing: '0.18em' }}>
            ■ ALGORITHMIC PROFILE
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#070707', letterSpacing: '0.12em' }}>
            [CLASSIFIED]
          </span>
        </div>

        {/* Amber separator line */}
        <div style={{ height: '1px', backgroundColor: 'rgba(240,148,51,0.25)', flexShrink: 0, position: 'relative', zIndex: 20 }} />

        {/* Main content */}
        <div style={{
          position: 'relative', zIndex: 20,
          display: 'flex', flexDirection: 'column',
          flex: 1,
          padding: '52px 44px 44px',
        }}>

          {/* Identity framing — prominent two-line label */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.38)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              lineHeight: 1.6,
            }}>
              MY INSTAGRAM ALGORITHM
            </div>
            <div style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              THINKS I AM A/AN:
            </div>
          </div>

          {/* Vibe — large, white, uppercase monospace */}
          <div style={{
            fontSize: '58px',
            fontWeight: 700,
            lineHeight: 1.0,
            color: '#ffffff',
            letterSpacing: '-0.01em',
            wordBreak: 'break-word',
            textTransform: 'uppercase',
            marginTop: '24px',
            marginBottom: '40px',
          }}>
            {data.vibe || 'UNKNOWN'}
          </div>

          {/* Dashed horizontal rule */}
          <div style={{
            borderTop: '1px dashed rgba(255,255,255,0.2)',
            marginBottom: '36px',
            flexShrink: 0,
          }} />

          {/* Shadow Truth label */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#f09433',
              letterSpacing: '0.18em',
            }}>
              {'> SHADOW TRUTH:'}
            </span>
          </div>

          {/* Shadow Truth text */}
          <div style={{
            fontSize: '21px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.88)',
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
            paddingTop: '22px',
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

// Render via portal so html2canvas captures outside any parent stacking context
const ShareCard = forwardRef<HTMLDivElement, { data: AnalysisResult }>(
  (props, ref) => createPortal(<CardContent ref={ref} {...props} />, document.body)
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
