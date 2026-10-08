import React from 'react';

// Consistent Lucide-style line icons (2px stroke, no emojis)
const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

export const LeafIcon = ({ size = 20, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const DashboardIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

export const UserIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const LogoutIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const BoxIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

export const ClipboardIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);

export const TractorIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.66 5a1 1 0 0 1-1 .9H16" />
    <path d="M16 18h-5" />
    <path d="M7 15a4 4 0 1 0 8 0 4 4 0 1 0-8 0" />
    <circle cx="5" cy="18" r="2" />
    <path d="M5 16V9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4" />
    <path d="M10 8V5a1 1 0 0 0-1-1H7" />
  </svg>
);

export const CalendarIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export const StethoscopeIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

export const UsersIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const PlusIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const SearchIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const MoreVerticalIcon = ({ size = 16, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export const EyeIcon = ({ size = 15, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EditIcon = ({ size = 15, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

export const TrashIcon = ({ size = 15, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export const MapPinIcon = ({ size = 14, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const PhoneIcon = ({ size = 14, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const UploadCloudIcon = ({ size = 32, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

export const CloseIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const CheckIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const RupeeIcon = ({ size = 20, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="m6 13 8.5 8" />
    <path d="M6 13h3a4 4 0 0 0 0-8" />
  </svg>
);

export const LayersIcon = ({ size = 20, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 12.5-8.58 3.9a2 2 0 0 1-1.66 0L2 12.5" />
    <path d="m22 17.5-8.58 3.9a2 2 0 0 1-1.66 0L2 17.5" />
  </svg>
);

export const SproutIcon = ({ size = 20, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4.1 1-4.9 2z" />
  </svg>
);

export const FlaskIcon = ({ size = 20, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M10 2v7.31L4.15 19.86A2 2 0 0 0 5.86 23h12.28a2 2 0 0 0 1.71-3.14L14 9.31V2" />
    <path d="M8.5 2h7" />
    <path d="M14 9.3a6.5 6.5 0 0 1-4 0" />
    <path d="M5.52 16h12.96" />
  </svg>
);

export const SidebarHillsIllustration = () => (
  <svg
    className="sidebar-hills-art"
    viewBox="0 0 230 85"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    {/* Far background hills */}
    <path d="M0 48 C45 32, 95 42, 140 28 C185 15, 210 22, 230 18 L230 85 L0 85 Z" fill="#113826" opacity="0.6" />
    {/* Mid hills */}
    <path d="M0 58 C50 42, 105 52, 155 40 C190 30, 215 36, 230 32 L230 85 L0 85 Z" fill="#14432F" opacity="0.8" />
    {/* Foreground rolling hills */}
    <path d="M0 68 C45 60, 95 70, 145 58 C185 48, 210 54, 230 50 L230 85 L0 85 Z" fill="#1B5A3F" />
    {/* Subtle pine trees on ridge */}
    <path d="M42 42 L46 32 L50 42 Z M47 43 L51 34 L55 43 Z M62 46 L65 38 L68 46 Z" fill="#0C261A" opacity="0.75" />
    <path d="M178 32 L181 24 L184 32 Z M183 33 L186 25 L189 33 Z" fill="#0C261A" opacity="0.75" />
    {/* Silhouetted tractor */}
    <g transform="translate(80, 46) scale(0.68)" fill="#0B2418" opacity="0.85">
      <circle cx="15" cy="22" r="9" />
      <circle cx="15" cy="22" r="5" fill="#164A34" />
      <circle cx="38" cy="24" r="5" />
      <circle cx="38" cy="24" r="2.5" fill="#164A34" />
      <path d="M12 13 L22 13 L25 18 L38 18 L38 22 L12 22 Z" />
      <path d="M14 6 L22 6 L22 13 L14 13 Z" />
      <rect x="33" y="10" width="2" height="8" />
    </g>
  </svg>
);

export const ZapIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const FarmerBannerIllustration = () => (
  <svg
    viewBox="0 0 320 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: 'auto', display: 'block' }}
  >
    {/* Soft sky and rolling green tea / crop terraces */}
    <rect width="320" height="130" fill="#E4F2E7" />
    <path d="M0 65 C60 48, 130 58, 200 44 C260 32, 290 38, 320 36 L320 130 L0 130 Z" fill="#C5E6CC" />
    <path d="M0 78 C70 62, 140 72, 210 58 C270 46, 300 52, 320 48 L320 130 L0 130 Z" fill="#A2D7AC" />
    <path d="M0 94 C80 80, 160 90, 230 74 C280 64, 305 70, 320 66 L320 130 L0 130 Z" fill="#75BA81" />
    <path d="M0 112 C70 98, 150 108, 220 92 C275 80, 300 86, 320 82 L320 130 L0 130 Z" fill="#4B9A59" />

    {/* Crops / botanical sprouts on left */}
    <g fill="#215A33">
      <path d="M14 130 C12 112, 20 100, 28 96 C30 104, 27 116, 18 130 Z" />
      <path d="M26 130 C28 116, 40 108, 48 106 C46 116, 38 124, 30 130 Z" />
      <path d="M36 130 C38 118, 50 112, 60 114 C56 122, 46 127, 40 130 Z" />
    </g>

    {/* Farmer in straw hat looking out at the hills on right */}
    <g transform="translate(242, 68)">
      {/* Body / green shirt */}
      <path d="M18 36 C10 32, -4 34, -12 62 L48 62 C40 34, 26 32, 18 36 Z" fill="#246037" />
      {/* Neck */}
      <rect x="15" y="26" width="6" height="12" fill="#E8B084" />
      {/* Head */}
      <ellipse cx="18" cy="22" rx="9" ry="11" fill="#E8B084" />
      {/* Hair */}
      <path d="M10 20 C10 14, 14 11, 22 13 C26 14, 27 20, 27 24 C23 21, 14 22, 10 20 Z" fill="#2C1810" />
      {/* Straw Hat */}
      <ellipse cx="18" cy="14" rx="24" ry="7" fill="#DDB065" />
      <path d="M8 13 C8 4, 28 4, 28 13 Z" fill="#CD9B4A" />
      <path d="M9 12 C12 10, 24 10, 27 12" stroke="#8A5F1C" strokeWidth="1.5" />
    </g>
  </svg>
);

export const FertilizerIcon = ({ size = 20, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M6 3h12l2 5v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l2-5Z" />
    <path d="M6 8h12" />
    <path d="m10 13 2 2 4-4" />
  </svg>
);

export const SpeakerIcon = ({ size = 20, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const RefreshCwIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export const GovtSchemeIcon = ({ size = 18, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className} viewBox="0 0 24 24">
    <line x1="2" y1="22" x2="22" y2="22" />
    <path d="m3 7 9-5 9 5v2H3V7Z" />
    <line x1="6" y1="11" x2="6" y2="18" />
    <line x1="10" y1="11" x2="10" y2="18" />
    <line x1="14" y1="11" x2="14" y2="18" />
    <line x1="18" y1="11" x2="18" y2="18" />
  </svg>
);



