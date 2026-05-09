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
          padding: '64px 52px 56px',
          boxSizing: 'border-box',
        }}
      >
        {/* Pink blob — top right */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-80px',
          width: '480px', height: '480px',
          background: 'radial-gradient(ellipse at center, rgba(188,24,136,0.45) 0%, rgba(188,24,136,0.1) 45%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Orange blob — bottom left */}
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-60px',
          width: '400px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(240,148,51,0.35) 0%, rgba(240,148,51,0.08) 45%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Subtle red mid-blob */}
        <div style={{
          position: 'absolute', bottom: '220px', right: '-40px',
          width: '280px', height: '280px',
          background: 'radial-gradient(ellipse at center, rgba(220,39,67,0.2) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Top label */}
          <div style={{
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.38)',
            letterSpacing: '0.02em',
            lineHeight: 1.5,
            marginBottom: '20px',
          }}>
            my algorithm thinks i am a —
          </div>

          {/* Vibe — solid orange, html2canvas doesn't support gradient text */}
          <div style={{
            fontSize: '68px',
            fontWeight: 800,
            lineHeight: 1.0,
            color: '#f09433',
            marginBottom: '28px',
            letterSpacing: '-0.03em',
            wordBreak: 'break-word',
          }}>
            {data.vibe || 'Your Vibe'}
          </div>

          {/* Mirror moment */}
          {data.mirrorMoment && (
            <div style={{
              fontSize: '17px',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.6,
              marginBottom: '40px',
              fontWeight: 300,
            }}>
              "{data.mirrorMoment}"
            </div>
          )}

          {/* Divider */}
          <div style={{
            width: '40px',
            height: '2px',
            backgroundColor: '#dc2743',
            marginBottom: '28px',
            borderRadius: '2px',
          }} />

          {/* Themes label */}
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.28)',
            textTransform: 'uppercase',
            marginBottom: '18px',
          }}>
            Your Themes
          </div>

          {/* Theme list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>
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
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '-0.01em',
                }}>
                  {theme.title}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom branding */}
          <div style={{ textAlign: 'center', paddingTop: '32px' }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(240,148,51,0.5)',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}>
              algorithmic-identity.vercel.app
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
