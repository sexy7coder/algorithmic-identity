import { forwardRef } from 'react';

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
}

const ShareCard = forwardRef<HTMLDivElement, { data: AnalysisResult }>(
  ({ data }, ref) => {
    const themes = (data.topThemes || []).slice(0, 3);

    return (
      <div
        ref={ref}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '540px',
          height: '960px',
          backgroundColor: '#0a0a0a',
          fontFamily: "'Outfit', sans-serif",
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 52px 52px',
          boxSizing: 'border-box',
        }}
      >
        {/* Background blobs — radial gradients only, no filter:blur (unsupported in html2canvas) */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '420px', height: '520px',
          background: 'radial-gradient(ellipse at top right, rgba(188,24,136,0.38) 0%, transparent 62%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '380px', height: '420px',
          background: 'radial-gradient(ellipse at bottom left, rgba(240,148,51,0.28) 0%, transparent 62%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '200px', right: '-80px',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(220,39,67,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Top label */}
          <div style={{
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.01em',
            lineHeight: 1.6,
            marginBottom: '18px',
          }}>
            my algorithm thinks i am a —
          </div>

          {/* Vibe */}
          <div style={{
            fontSize: '62px',
            fontWeight: 800,
            lineHeight: 1.0,
            color: '#e8824a',
            marginBottom: '30px',
            letterSpacing: '-0.025em',
            wordBreak: 'break-word',
          }}>
            {data.vibe || 'Your Vibe'}
          </div>

          {/* Mirror moment */}
          {data.mirrorMoment && (
            <div style={{
              fontSize: '16px',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.68)',
              lineHeight: 1.6,
              marginBottom: '40px',
              fontWeight: 300,
              maxWidth: '420px',
            }}>
              "{data.mirrorMoment}"
            </div>
          )}

          {/* Divider */}
          <div style={{
            width: '36px',
            height: '2px',
            backgroundColor: '#dc2743',
            marginBottom: '30px',
            borderRadius: '2px',
          }} />

          {/* Themes label */}
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Your Themes
          </div>

          {/* Theme list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
            {themes.map((theme, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#dc2743',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.82)',
                  letterSpacing: '-0.01em',
                }}>
                  {theme.title}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom attribution */}
          <div style={{ textAlign: 'center', paddingTop: '36px' }}>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.22)',
              fontWeight: 400,
              letterSpacing: '0.05em',
              marginBottom: '5px',
            }}>
              an experiment by
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.01em',
              marginBottom: '3px',
            }}>
              Meet Ahluwalia
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(240,148,51,0.55)',
              fontWeight: 400,
              letterSpacing: '0.03em',
            }}>
              meetahluwalia.com
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
