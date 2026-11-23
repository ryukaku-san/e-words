import React, { useId } from 'react';
import type { BadgeDefinition, BadgeIconType, BadgeShape, BadgeTier } from '../data/badges';

interface BadgeGraphicProps {
  badge: BadgeDefinition;
  locked?: boolean;
  size?: number;
  showShine?: boolean;
  className?: string;
}

interface TierPalette {
  rimLight: string;
  rimMid: string;
  rimDark: string;
  bevel: string;
  faceTop: string;
  faceBottom: string;
  iconColor: string;
  pillBg: string;
  pillText: string;
  accent: string;
}

const TIER_PALETTES: Record<BadgeTier, TierPalette> = {
  bronze: {
    rimLight: '#F6C28B',
    rimMid: '#C97B3A',
    rimDark: '#7C3E16',
    bevel: '#FDE0B8',
    faceTop: '#8B451B',
    faceBottom: '#4A2109',
    iconColor: '#FFF3E0',
    pillBg: '#5C290B',
    pillText: '#FFE4C4',
    accent: '#F59E0B',
  },
  silver: {
    rimLight: '#F8FAFC',
    rimMid: '#94A3B8',
    rimDark: '#475569',
    bevel: '#FFFFFF',
    faceTop: '#475569',
    faceBottom: '#1E293B',
    iconColor: '#F8FAFC',
    pillBg: '#1E293B',
    pillText: '#E2E8F0',
    accent: '#CBD5E1',
  },
  gold: {
    rimLight: '#FEF08A',
    rimMid: '#EAB308',
    rimDark: '#92400E',
    bevel: '#FEF9C3',
    faceTop: '#B45309',
    faceBottom: '#5C2406',
    iconColor: '#FEF9C3',
    pillBg: '#78350F',
    pillText: '#FEF08A',
    accent: '#FACC15',
  },
  platinum: {
    rimLight: '#E0E7FF',
    rimMid: '#818CF8',
    rimDark: '#3730A3',
    bevel: '#F5F3FF',
    faceTop: '#312E81',
    faceBottom: '#1E1B4B',
    iconColor: '#F0F9FF',
    pillBg: '#1E1B4B',
    pillText: '#E0E7FF',
    accent: '#38BDF8',
  },
};

const LOCKED_PALETTE: TierPalette = {
  rimLight: '#CBD5E1',
  rimMid: '#94A3B8',
  rimDark: '#64748B',
  bevel: '#E2E8F0',
  faceTop: '#E2E8F0',
  faceBottom: '#CBD5E1',
  iconColor: '#94A3B8',
  pillBg: '#94A3B8',
  pillText: '#F8FAFC',
  accent: '#94A3B8',
};

function renderShapePaths(shape: BadgeShape): { outer: string; inner: string } {
  switch (shape) {
    case 'shield':
      return {
        outer: 'M60 6 L104 20 L104 60 C104 88 83 106 60 115 C37 106 16 88 16 60 L16 20 Z',
        inner: 'M60 14 L96 26 L96 59 C96 82 78 98 60 106 C42 98 24 82 24 59 L24 26 Z',
      };
    case 'hex':
      return {
        outer: 'M60 6 L107 33 L107 87 L60 114 L13 87 L13 33 Z',
        inner: 'M60 14 L99 37 L99 83 L60 106 L21 83 L21 37 Z',
      };
    case 'star':
      return {
        outer:
          'M60 5 L73 23 L95 18 L94 40 L113 52 L100 71 L107 93 L85 95 L74 114 L60 102 L46 114 L35 95 L13 93 L20 71 L7 52 L26 40 L25 18 L47 23 Z',
        inner:
          'M60 15 L70 29 L88 25 L87 43 L102 53 L92 68 L97 86 L79 88 L71 103 L60 93 L49 103 L41 88 L23 86 L28 68 L18 53 L33 43 L32 25 L50 29 Z',
      };
    case 'crown':
      return {
        outer: 'M60 6 L86 14 L106 34 L114 60 L106 86 L86 106 L60 114 L34 106 L14 86 L6 60 L14 34 L34 14 Z',
        inner: 'M60 14 L82 21 L99 38 L106 60 L99 82 L82 99 L60 106 L38 99 L21 82 L14 60 L21 38 L38 21 Z',
      };
    case 'crest':
      return {
        outer: 'M60 6 L110 48 L90 112 L30 112 L10 48 Z',
        inner: 'M60 15 L101 50 L84 104 L36 104 L19 50 Z',
      };
    case 'medal':
    default:
      return {
        outer:
          'M60 6 A54 54 0 1 1 59.99 6 Z',
        inner:
          'M60 14 A46 46 0 1 1 59.99 14 Z',
      };
  }
}

function renderCenterIcon(icon: BadgeIconType, color: string): React.ReactNode {
  const strokeProps = {
    fill: 'none',
    stroke: color,
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (icon) {
    case 'flame':
      return (
        <path
          d="M60 28 C67 38 74 44 74 55 C74 64 68 71 60 71 C52 71 46 64 46 55 C46 48 50 42 54 38 C54 44 57 46 59 46 C58 39 58 33 60 28 Z"
          fill={color}
          opacity={0.95}
        />
      );
    case 'calendar':
      return (
        <g {...strokeProps}>
          <rect x="42" y="34" width="36" height="33" rx="5" />
          <line x1="42" y1="45" x2="78" y2="45" />
          <line x1="51" y1="29" x2="51" y2="37" />
          <line x1="69" y1="29" x2="69" y2="37" />
          <path d="M53 56 L58 61 L68 51" />
        </g>
      );
    case 'trophy':
      return (
        <g {...strokeProps}>
          <path d="M47 32 H73 V46 C73 54 67 59 60 59 C53 59 47 54 47 46 Z" fill={color} fillOpacity={0.22} />
          <path d="M47 36 H40 C38 36 37 38 37 41 C37 46 41 49 47 49" />
          <path d="M73 36 H80 C82 36 83 38 83 41 C83 46 79 49 73 49" />
          <line x1="60" y1="59" x2="60" y2="68" />
          <line x1="50" y1="68" x2="70" y2="68" />
        </g>
      );
    case 'target':
      return (
        <g {...strokeProps}>
          <circle cx="60" cy="50" r="18" />
          <circle cx="60" cy="50" r="10" />
          <circle cx="60" cy="50" r="3.5" fill={color} />
        </g>
      );
    case 'bolt':
      return (
        <path
          d="M63 28 L44 53 H58 L55 72 L76 47 H62 Z"
          fill={color}
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      );
    case 'book':
      return (
        <g {...strokeProps}>
          <path d="M41 34 C48 34 55 36 60 40 C65 36 72 34 79 34 V65 C72 65 65 67 60 70 C55 67 48 65 41 65 Z" />
          <line x1="60" y1="40" x2="60" y2="70" />
        </g>
      );
    case 'cpu':
      return (
        <g {...strokeProps}>
          <rect x="46" y="36" width="28" height="28" rx="4" />
          <rect x="54" y="44" width="12" height="12" rx="1.5" fill={color} fillOpacity={0.3} />
          <line x1="53" y1="30" x2="53" y2="36" />
          <line x1="67" y1="30" x2="67" y2="36" />
          <line x1="53" y1="64" x2="53" y2="70" />
          <line x1="67" y1="64" x2="67" y2="70" />
          <line x1="40" y1="44" x2="46" y2="44" />
          <line x1="40" y1="56" x2="46" y2="56" />
          <line x1="74" y1="44" x2="80" y2="44" />
          <line x1="74" y1="56" x2="80" y2="56" />
        </g>
      );
    case 'sparkles':
      return (
        <g fill={color}>
          <path d="M60 28 L64 43 L79 47 L64 51 L60 66 L56 51 L41 47 L56 43 Z" />
          <path d="M77 56 L79 62 L85 64 L79 66 L77 72 L75 66 L69 64 L75 62 Z" opacity={0.85} />
        </g>
      );
    case 'compass':
      return (
        <g {...strokeProps}>
          <circle cx="60" cy="50" r="18" />
          <polygon points="67,43 62,55 53,57 58,45" fill={color} stroke="none" />
        </g>
      );
    case 'layers':
      return (
        <g {...strokeProps}>
          <polygon points="60,31 80,41 60,51 40,41" fill={color} fillOpacity={0.25} />
          <polyline points="40,51 60,61 80,51" />
          <polyline points="40,60 60,70 80,60" />
        </g>
      );
    case 'shuffle':
      return (
        <g {...strokeProps}>
          <path d="M40 40 H50 L70 60 H80" />
          <path d="M40 60 H50 L57 53" />
          <path d="M63 47 L70 40 H80" />
          <polyline points="75,35 80,40 75,45" />
          <polyline points="75,55 80,60 75,65" />
        </g>
      );
    case 'translate':
      return (
        <g {...strokeProps}>
          <path d="M41 41 H59" />
          <path d="M50 36 V41 C50 51 45 58 40 61" />
          <path d="M45 48 C48 53 52 57 56 59" />
          <path d="M61 65 L69 44 L77 65" />
          <path d="M64 58 H74" />
        </g>
      );
    case 'star':
      return (
        <polygon
          points="60,29 66,42 80,44 70,54 72,68 60,61 48,68 50,54 40,44 54,42"
          fill={color}
        />
      );
    case 'volume':
      return (
        <g {...strokeProps}>
          <polygon points="42,45 50,45 60,36 60,64 50,55 42,55" fill={color} />
          <path d="M67 43 C70 46 70 54 67 57" />
          <path d="M73 38 C78 44 78 56 73 62" />
        </g>
      );
    case 'heart':
      return (
        <path
          d="M60 68 C60 68 41 56 41 43 C41 37 46 33 52 33 C56 33 59 35 60 38 C61 35 64 33 68 33 C74 33 79 37 79 43 C79 56 60 68 60 68 Z"
          fill={color}
        />
      );
    case 'sunrise':
      return (
        <g {...strokeProps}>
          <path d="M42 58 H78" />
          <path d="M48 58 A12 12 0 0 1 72 58" fill={color} fillOpacity={0.35} />
          <line x1="60" y1="33" x2="60" y2="39" />
          <line x1="45" y1="41" x2="49" y2="45" />
          <line x1="75" y1="41" x2="71" y2="45" />
          <path d="M46 66 H74" />
        </g>
      );
    case 'moon':
      return (
        <path
          d="M66 32 C55 33 47 42 47 52 C47 63 56 71 67 71 C71 71 75 70 78 67 C71 67 64 61 64 52 C64 43 69 36 74 34 C71 33 69 32 66 32 Z"
          fill={color}
        />
      );
    case 'refresh':
      return (
        <g {...strokeProps}>
          <path d="M75 45 A16 16 0 0 0 46 41" />
          <polyline points="45,34 46,42 54,41" />
          <path d="M45 55 A16 16 0 0 0 74 59" />
          <polyline points="75,66 74,58 66,59" />
        </g>
      );
    case 'gem':
      return (
        <g {...strokeProps}>
          <polygon points="46,35 74,35 82,47 60,71 38,47" fill={color} fillOpacity={0.25} />
          <line x1="38" y1="47" x2="82" y2="47" />
          <polyline points="52,35 49,47 60,71 71,47 68,35" />
        </g>
      );
    case 'crown':
      return (
        <path
          d="M40 64 L37 40 L50 50 L60 33 L70 50 L83 40 L80 64 Z"
          fill={color}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      );
  }
}

export const BadgeGraphic: React.FC<BadgeGraphicProps> = React.memo(({
  badge,
  locked = false,
  size = 80,
  showShine = false,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '_');
  const palette = locked ? LOCKED_PALETTE : TIER_PALETTES[badge.tier];
  const { outer, inner } = renderShapePaths(badge.shape);

  const rimGradId = `${uid}_rim`;
  const platGradId = `${uid}_plat`;
  const faceGradId = `${uid}_face`;
  const shineGradId = `${uid}_shine`;
  const outerClipId = `${uid}_clip`;
  const shadowId = `${uid}_shadow`;

  const useFilterShadow = size >= 100;
  const isPlatinumUnlocked = !locked && badge.tier === 'platinum';
  const showShineLayer = showShine && !locked;

  const isSecretLocked = locked && badge.secret;
  const labelText = isSecretLocked ? '???' : badge.shortLabel;
  const fontSize = labelText.length >= 5 ? 9.5 : labelText.length >= 4 ? 10.5 : 11.5;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`select-none shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {!isPlatinumUnlocked && (
          <linearGradient id={rimGradId} x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor={palette.rimLight} />
            <stop offset="45%" stopColor={palette.rimMid} />
            <stop offset="100%" stopColor={palette.rimDark} />
          </linearGradient>
        )}

        {isPlatinumUnlocked && (
          <linearGradient id={platGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0F9FF" />
            <stop offset="28%" stopColor="#A5B4FC" />
            <stop offset="55%" stopColor="#F472B6" />
            <stop offset="80%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        )}

        <radialGradient id={faceGradId} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor={palette.faceTop} />
          <stop offset="100%" stopColor={palette.faceBottom} />
        </radialGradient>

        {showShineLayer && (
          <>
            <linearGradient id={shineGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            <clipPath id={outerClipId}>
              <path d={outer} />
            </clipPath>
          </>
        )}

        {useFilterShadow && (
          <filter id={shadowId} x="-15%" y="-15%" width="130%" height="135%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0F172A" floodOpacity={locked ? '0.12' : '0.28'} />
          </filter>
        )}
      </defs>

      {!useFilterShadow && (
        <path
          d={outer}
          transform="translate(0 2.5)"
          fill="#0F172A"
          opacity={locked ? 0.08 : 0.16}
        />
      )}

      <g filter={useFilterShadow ? `url(#${shadowId})` : undefined} opacity={locked ? 0.65 : 1}>
        {/* 1. 外枠メタリックリム */}
        <path
          d={outer}
          fill={isPlatinumUnlocked ? `url(#${platGradId})` : `url(#${rimGradId})`}
          stroke={palette.bevel}
          strokeWidth={1.5}
          strokeOpacity={0.65}
        />

        {/* 2. 内側エンボス文字盤 */}
        <path
          d={inner}
          fill={`url(#${faceGradId})`}
          stroke={palette.rimLight}
          strokeWidth={1.2}
          strokeOpacity={locked ? 0.4 : 0.75}
        />

        {/* 3. ゴールド/プラチナ用の月桂樹風アクセントアーク */}
        {!locked && (badge.tier === 'gold' || badge.tier === 'platinum') && (
          <g fill="none" stroke={palette.accent} strokeWidth={1.6} strokeOpacity={0.55} strokeLinecap="round">
            <path d="M27 72 C24 58 27 42 36 31" strokeDasharray="3 4" />
            <path d="M93 72 C96 58 93 42 84 31" strokeDasharray="3 4" />
          </g>
        )}

        {/* 4. 上部ガラススペキュラハイライト */}
        {!locked && (
          <path
            d="M28 42 C36 22 84 22 92 42 C78 33 42 33 28 42 Z"
            fill="#FFFFFF"
            opacity={0.18}
          />
        )}

        {/* 5. 中央アイコン or シークレット「？」 */}
        {isSecretLocked ? (
          <text
            x="60"
            y="60"
            textAnchor="middle"
            fill={palette.iconColor}
            fontSize="30"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
          >
            ?
          </text>
        ) : (
          renderCenterIcon(badge.icon, palette.iconColor)
        )}

        {/* 6. 下部刻印プレート */}
        <rect
          x="33"
          y="78"
          width="54"
          height="18"
          rx="9"
          fill={palette.pillBg}
          stroke={palette.rimLight}
          strokeWidth={1}
          strokeOpacity={0.55}
        />
        <text
          x="60"
          y="90.5"
          textAnchor="middle"
          fill={palette.pillText}
          fontSize={fontSize}
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.02em"
        >
          {labelText}
        </text>
      </g>

      {/* 7. 斜め光沢シマー（獲得演出・タップ時） */}
      {showShineLayer && (
        <g clipPath={`url(#${outerClipId})`}>
          <g className="badge-shine-sweep">
            <rect
              x="0"
              y="-20"
              width="38"
              height="160"
              transform="rotate(24 60 60)"
              fill={`url(#${shineGradId})`}
            />
          </g>
        </g>
      )}
    </svg>
  );
});

BadgeGraphic.displayName = 'BadgeGraphic';
