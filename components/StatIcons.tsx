export function GoalIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9.5" fill="white" stroke="#222" strokeWidth="1"/>
      <polygon points="10,2.5 12.4,5.2 11.5,8.2 8.5,8.2 7.6,5.2" fill="#222"/>
      <polygon points="17.2,7 14.9,8.6 15.2,11.7 17.8,12.7 19.2,10.3" fill="#222"/>
      <polygon points="15.4,16.4 12.8,15 10.9,17 11.9,19.4 14.8,19" fill="#222"/>
      <polygon points="4.6,16.4 7.2,15 9.1,17 8.1,19.4 5.2,19" fill="#222"/>
      <polygon points="2.8,7 5.1,8.6 4.8,11.7 2.2,12.7 0.8,10.3" fill="#222"/>
      <line x1="10" y1="2.5" x2="10" y2="0.5" stroke="#222" strokeWidth="0.8"/>
      <line x1="11.5" y1="8.2" x2="14.9" y2="8.6" stroke="#222" strokeWidth="0.8"/>
      <line x1="8.5" y1="8.2" x2="5.1" y2="8.6" stroke="#222" strokeWidth="0.8"/>
      <line x1="15.2" y1="11.7" x2="12.8" y2="15" stroke="#222" strokeWidth="0.8"/>
      <line x1="4.8" y1="11.7" x2="7.2" y2="15" stroke="#222" strokeWidth="0.8"/>
      <line x1="10.9" y1="17" x2="9.1" y2="17" stroke="#222" strokeWidth="0.8"/>
    </svg>
  );
}

// Football boot / cleat icon
export function AssistIcon({ size = 14, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      {/* Boot upper */}
      <path d="M3 17.5 C3 17.5 2 14 3.5 10.5 C4.5 8 6 6.5 8.5 5.5 C10.5 4.5 13 4 15 4.5 C17 5 18 6 18.5 7 C19 8 19 9.5 18.5 10.5 C18 11.5 17 12 16 12 L10 12 C9 12 8.5 12.5 8.5 13.5 L8.5 17.5 Z" />
      {/* Sole */}
      <rect x="3" y="17.5" width="5.5" height="2" rx="1" />
      {/* Toe cap */}
      <path d="M8.5 17.5 L8.5 19.5 L16 19.5 L17 18.5 L17 17.5 Z" />
      {/* Cleats */}
      <rect x="4"  y="19.5" width="1.5" height="1.5" rx="0.4" />
      <rect x="6.5" y="19.5" width="1.5" height="1.5" rx="0.4" />
      <rect x="10" y="19.5" width="1.5" height="1.5" rx="0.4" />
      <rect x="13" y="19.5" width="1.5" height="1.5" rx="0.4" />
      <rect x="15.5" y="19" width="1.5" height="1.5" rx="0.4" />
      {/* Adidas-style stripes (cutout white lines on the boot) */}
      <line x1="10.5" y1="6.5"  x2="8"   y2="11.5" stroke="#1a2235" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="12.5" y1="6"    x2="10"  y2="11.5" stroke="#1a2235" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="14.5" y1="5.8"  x2="12"  y2="11"   stroke="#1a2235" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}
