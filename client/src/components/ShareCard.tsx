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
}

const CardContent = forwardRef<HTMLDivElement, { data: AnalysisResult }>(
  ({ data }, ref) => {
    const themes = (data.topThemes || []).slice(0, 3);

    return (
      <div
        ref={ref}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0px',
          width: '540px',
          height: '960px',
          backgroundColor: '#0a0a0a',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 56px 60px',
          boxSizing: 'border-box',
        }}
      >
        {/* Pink/purple blob — top right */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-100px',
          width: '520px', height: '520px',
          background: 'radial-gradient(ellipse at center, rgba(188,24,136,0.55) 0%, rgba(188,24,136,0.18) 38%, transparent 62%)',
          pointerEvents: 'none',
        }} />
        {/* Orange blob — bottom left */}
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-80px',
          width: '460px', height: '460px',
          background: 'radial-gradient(ellipse at center, rgba(240,148,51,0.45) 0%, rgba(240,148,51,0.12) 38%, transparent 62%)',
          pointerEvents: 'none',
        }} />
        {/* Red blob — mid right */}
        <div style={{
          position: 'absolute', top: '400px', right: '-60px',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(220,39,67,0.28) 0%, transparent 58%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Top label */}
          <div style={{
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.01em',
            lineHeight: 1.4,
            marginBottom: '18px',
          }}>
            my algorithm thinks i am a —
          </div>

          {/* Vibe — white, bold */}
          <div style={{
            fontSize: '72px',
            fontWeight: 800,
            lineHeight: 1.0,
            color: '#ffffff',
            marginBottom: '32px',
            letterSpacing: '-0.03em',
            wordBreak: 'break-word',
          }}>
            {data.vibe || 'Your Vibe'}
          </div>

          {/* Gradient divider — solid colors, html2canvas supports linear-gradient on divs */}
          <div style={{
            width: '60px',
            height: '3px',
            backgroundColor: '#f09433',
            marginBottom: '24px',
            borderRadius: '2px',
          }} />

          {/* Mirror moment */}
          {data.mirrorMoment && (
            <div style={{
              fontSize: '18px',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.62)',
              lineHeight: 1.55,
              marginBottom: '52px',
              fontWeight: 300,
            }}>
              "{data.mirrorMoment}"
            </div>
          )}

          {/* Themes label */}
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.28)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Your Themes
          </div>

          {/* Theme pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {themes.map((theme, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '13px 18px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#f09433',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.88)',
                  letterSpacing: '-0.01em',
                }}>
                  {theme.title}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom branding — pushed to bottom */}
          <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '36px' }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(240,148,51,0.55)',
              fontWeight: 500,
              letterSpacing: '0.06em',
            }}>
              An experiment by Meet Ahluwalia
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// Render via portal so html2canvas captures outside any stacking context
const ShareCard = forwardRef<HTMLDivElement, { data: AnalysisResult }>(
  (props, ref) => createPortal(<CardContent ref={ref} {...props} />, document.body)
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
