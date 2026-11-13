/**
 * Monochrome Technical Silhouette Placeholder System
 * - Strictly black/graphite line art on warm ivory archival paper (#FEF7E5)
 * - Geometric construction circles, axis hairlines, and registration ticks
 * - Zero facial features, zero cartoon expressions, zero invented likeness
 * - 4 distinct drafting compositions so cards never appear mechanically identical
 */
export function PortraitPlaceholder({
  variant = 0,
  label = 'Architectural silhouette placeholder awaiting verified portrait',
  className = '',
}) {
  const idx = Math.abs(Number(variant) || 0) % 4;

  return (
    <svg
      viewBox="0 0 320 400"
      role="img"
      aria-label={label}
      className={`h-full w-full bg-fcit-ivory select-none ${className}`}
    >
      <defs>
        <pattern
          id={`mono-draft-grid-${idx}`}
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 32 0 L 0 0 0 32"
            fill="none"
            stroke="#2A2E35"
            strokeOpacity="0.06"
            strokeWidth="0.75"
          />
        </pattern>
      </defs>

      {/* Warm ivory technical drawing sheet */}
      <rect width="320" height="400" fill="#FEF7E5" />
      <rect width="320" height="400" fill={`url(#mono-draft-grid-${idx})`} />

      {/* Outer perimeter border & vernier registration ticks */}
      <rect
        x="16"
        y="16"
        width="288"
        height="368"
        fill="none"
        stroke="#2A2E35"
        strokeOpacity="0.16"
        strokeWidth="0.9"
      />
      <path
        d="M16 44 H28 M304 44 H292 M16 356 H28 M304 356 H292 M160 16 V26 M160 384 V374"
        stroke="#2A2E35"
        strokeOpacity="0.28"
        strokeWidth="0.9"
      />

      {/* Composition 01: Concentric axis compass & rounded bust silhouette */}
      {idx === 0 && (
        <g stroke="#2A2E35" fill="none">
          <circle cx="160" cy="144" r="78" strokeOpacity="0.14" strokeWidth="0.9" strokeDasharray="3 4" />
          <circle cx="160" cy="144" r="110" strokeOpacity="0.08" strokeWidth="0.9" />
          <line x1="160" y1="36" x2="160" y2="364" strokeOpacity="0.12" strokeWidth="0.9" />
          <line x1="48" y1="144" x2="272" y2="144" strokeOpacity="0.12" strokeWidth="0.9" />
          <path
            d="M68 370 C72 296 108 262 160 262 C212 262 248 296 252 370"
            fill="#F2ECDF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <path
            d="M134 266 L140 220 H180 L186 266"
            fill="#FBF6EF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <ellipse
            cx="160"
            cy="148"
            rx="42"
            ry="54"
            fill="#FBF6EF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <line x1="118" y1="144" x2="202" y2="144" strokeOpacity="0.22" strokeWidth="0.9" />
        </g>
      )}

      {/* Composition 02: Triangular datum frame & faceted collar bust */}
      {idx === 1 && (
        <g stroke="#2A2E35" fill="none">
          <circle cx="160" cy="150" r="88" strokeOpacity="0.12" strokeWidth="0.9" />
          <polygon
            points="160,48 254,214 66,214"
            strokeOpacity="0.15"
            strokeWidth="0.9"
            strokeDasharray="4 4"
          />
          <line x1="60" y1="368" x2="260" y2="168" strokeOpacity="0.08" strokeWidth="0.9" />
          <path
            d="M64 370 L84 288 C104 268 130 260 160 260 C190 260 216 268 236 288 L256 370"
            fill="#F2ECDF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <rect
            x="142"
            y="214"
            width="36"
            height="48"
            fill="#FBF6EF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <path
            d="M119 144 C119 106 138 92 160 92 C182 92 201 106 201 144 C201 182 182 212 160 212 C138 212 119 182 119 144 Z"
            fill="#FBF6EF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <circle cx="160" cy="144" r="22" strokeOpacity="0.16" strokeWidth="0.9" />
        </g>
      )}

      {/* Composition 03: Vitruvian chord circles & notched lapel geometry */}
      {idx === 2 && (
        <g stroke="#2A2E35" fill="none">
          <circle cx="160" cy="146" r="64" strokeOpacity="0.16" strokeWidth="0.9" />
          <circle cx="160" cy="146" r="98" strokeOpacity="0.09" strokeWidth="0.9" strokeDasharray="2 4" />
          <line x1="160" y1="32" x2="160" y2="372" strokeOpacity="0.12" strokeWidth="0.9" />
          <path
            d="M76 370 C80 294 114 266 160 266 C206 266 240 294 244 370"
            fill="#F2ECDF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <path d="M124 274 L160 302 L196 274" stroke="#0D0D0C" strokeWidth="1.2" />
          <path
            d="M139 266 V220 H181 V266"
            fill="#FBF6EF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <ellipse
            cx="160"
            cy="146"
            rx="41"
            ry="52"
            fill="#FBF6EF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <path d="M122 126 H198" strokeOpacity="0.18" strokeWidth="0.9" />
        </g>
      )}

      {/* Composition 04: Capsule proportion guide & dual tangent horizon */}
      {idx === 3 && (
        <g stroke="#2A2E35" fill="none">
          <rect
            x="84"
            y="74"
            width="152"
            height="196"
            rx="76"
            strokeOpacity="0.13"
            strokeWidth="0.9"
          />
          <circle cx="160" cy="148" r="82" strokeOpacity="0.12" strokeWidth="0.9" strokeDasharray="5 3" />
          <line x1="56" y1="262" x2="264" y2="262" strokeOpacity="0.11" strokeWidth="0.9" />
          <path
            d="M66 370 C72 298 106 262 160 262 C214 262 248 298 254 370"
            fill="#F2ECDF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <path
            d="M137 264 L142 220 H178 L183 264"
            fill="#FBF6EF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <path
            d="M120 146 C120 110 138 92 160 92 C182 92 200 110 200 146 C200 180 182 210 160 210 C138 210 120 180 120 146 Z"
            fill="#FBF6EF"
            stroke="#0D0D0C"
            strokeWidth="1.4"
          />
          <path d="M104 146 H216" strokeOpacity="0.14" strokeWidth="0.9" />
        </g>
      )}

      {/* Minimal technical index plate stamp cleanly in top-left drafting margin */}
      <text
        x="26"
        y="36"
        fontSize="9.5"
        fontFamily="Geist Mono, monospace"
        fill="#2A2E35"
        fillOpacity="0.56"
        letterSpacing="1.2"
      >
        FIG.0{idx + 1} · SILHOUETTE PLATE
      </text>
    </svg>
  );
}
