/**
 * Icon system — exact paths from docs/linker-app-screens.html ICONS map.
 * Stroke icons inherit `color`; fill icons render like the source.
 */
import React from 'react';
import Svg, { Path, Line, Polyline, Rect, Circle } from 'react-native-svg';

export type IconName =
  | 'link2'
  | 'image'
  | 'folder'
  | 'search'
  | 'heart'
  | 'arrowRight'
  | 'arrowLeft'
  | 'mail'
  | 'user'
  | 'lock'
  | 'plus'
  | 'home'
  | 'grid'
  | 'external'
  | 'chevronRight'
  | 'chevronDown'
  | 'dots'
  | 'settings'
  | 'refresh'
  | 'help'
  | 'info'
  | 'briefcase'
  | 'sparkles'
  | 'box'
  | 'close'
  | 'trash'
  | 'google'
  | 'apple';

function Stroke({
  size,
  color,
  width,
  children,
}: {
  size: number;
  color: string;
  width: number;
  children: React.ReactNode;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

export function Icon({
  name,
  size = 18,
  color = '#14161a',
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  switch (name) {
    case 'link2':
      return (
        <Stroke size={size} color={color} width={2}>
          <Path d="M9 17H7a5 5 0 1 1 0-10h2" />
          <Path d="M15 7h2a5 5 0 1 1 0 10h-2" />
          <Line x1="8" y1="12" x2="16" y2="12" />
        </Stroke>
      );
    case 'image':
      return (
        <Stroke size={size} color={color} width={2}>
          <Rect x="3" y="3" width="18" height="18" rx="3" />
          <Circle cx="8.5" cy="8.5" r="1.6" />
          <Path d="M21 15.5 16.5 11 5 21" />
        </Stroke>
      );
    case 'folder':
      return (
        <Stroke size={size} color={color} width={2}>
          <Path d="M3 7a2 2 0 0 1 2-2h4.2l1.8 2H19a2 2 0 0 1 2 2v8.5A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5V7Z" />
        </Stroke>
      );
    case 'search':
      return (
        <Stroke size={size} color={color} width={2}>
          <Circle cx="11" cy="11" r="7" />
          <Line x1="21" y1="21" x2="16.6" y2="16.6" />
        </Stroke>
      );
    case 'heart':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path d="M12 20.5s-7.2-4.4-9.8-8.7C.7 8.7 1.6 4.9 5 3.6c2.3-.9 4.7 0 6 2 .3.4.6.9 1 1.5.4-.6.7-1.1 1-1.5 1.3-2 3.7-2.9 6-2 3.4 1.3 4.3 5.1 2.8 8.2-2.6 4.3-9.8 8.7-9.8 8.7Z" />
        </Svg>
      );
    case 'arrowRight':
      return (
        <Stroke size={size} color={color} width={2}>
          <Line x1="5" y1="12" x2="19" y2="12" />
          <Polyline points="12,5 19,12 12,19" />
        </Stroke>
      );
    case 'arrowLeft':
      return (
        <Stroke size={size} color={color} width={2.2}>
          <Line x1="19" y1="12" x2="5" y2="12" />
          <Polyline points="12,19 5,12 12,5" />
        </Stroke>
      );
    case 'mail':
      return (
        <Stroke size={size} color={color} width={2}>
          <Rect x="2" y="4.5" width="20" height="15" rx="2.5" />
          <Path d="m2.5 6.5 9.5 7 9.5-7" />
        </Stroke>
      );
    case 'user':
      return (
        <Stroke size={size} color={color} width={2}>
          <Circle cx="12" cy="7.5" r="4" />
          <Path d="M4.2 21c0-4 3.5-6.8 7.8-6.8s7.8 2.8 7.8 6.8" />
        </Stroke>
      );
    case 'lock':
      return (
        <Stroke size={size} color={color} width={2}>
          <Rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
          <Path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
        </Stroke>
      );
    case 'plus':
      return (
        <Stroke size={size} color={color} width={2.3}>
          <Line x1="12" y1="5" x2="12" y2="19" />
          <Line x1="5" y1="12" x2="19" y2="12" />
        </Stroke>
      );
    case 'home':
      return (
        <Stroke size={size} color={color} width={2}>
          <Path d="m3.5 10.5 8.5-7 8.5 7" />
          <Path d="M5.5 9.5V19a1 1 0 0 0 1 1h3.5v-5.5h4V20H17a1 1 0 0 0 1-1V9.5" />
        </Stroke>
      );
    case 'grid':
      return (
        <Stroke size={size} color={color} width={2}>
          <Rect x="3" y="3" width="7.5" height="7.5" rx="1.8" />
          <Rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8" />
          <Rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" />
          <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8" />
        </Stroke>
      );
    case 'external':
      return (
        <Stroke size={size} color={color} width={2}>
          <Path d="M17 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4.5" />
          <Polyline points="14,3 21,3 21,10" />
          <Line x1="10.5" y1="13.5" x2="21" y2="3" />
        </Stroke>
      );
    case 'chevronRight':
      return (
        <Stroke size={size} color={color} width={2.2}>
          <Polyline points="9,6 15,12 9,18" />
        </Stroke>
      );
    case 'chevronDown':
      return (
        <Stroke size={size} color={color} width={2.2}>
          <Polyline points="6,9 12,15 18,9" />
        </Stroke>
      );
    case 'dots':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Circle cx="12" cy="5.5" r="1.6" />
          <Circle cx="12" cy="12" r="1.6" />
          <Circle cx="12" cy="18.5" r="1.6" />
        </Svg>
      );
    case 'settings':
      return (
        <Stroke size={size} color={color} width={2}>
          <Circle cx="12" cy="12" r="7" />
          <Circle cx="12" cy="12" r="2.8" />
          <Line x1="12" y1="2.5" x2="12" y2="5" />
          <Line x1="12" y1="19" x2="12" y2="21.5" />
          <Line x1="19" y1="12" x2="21.5" y2="12" />
          <Line x1="2.5" y1="12" x2="5" y2="12" />
          <Line x1="16.95" y1="7.05" x2="18.72" y2="5.28" />
          <Line x1="7.05" y1="7.05" x2="5.28" y2="5.28" />
          <Line x1="16.95" y1="16.95" x2="18.72" y2="18.72" />
          <Line x1="7.05" y1="16.95" x2="5.28" y2="18.72" />
        </Stroke>
      );
    case 'refresh':
      return (
        <Stroke size={size} color={color} width={2}>
          <Polyline points="21,4 21,9.5 15.5,9.5" />
          <Polyline points="3,20 3,14.5 8.5,14.5" />
          <Path d="M4 9.5a8.5 8.5 0 0 1 14-3.2l3 3.2M20 14.5a8.5 8.5 0 0 1-14 3.2l-3-3.2" />
        </Stroke>
      );
    case 'help':
      return (
        <Stroke size={size} color={color} width={2}>
          <Circle cx="12" cy="12" r="9.5" />
          <Path d="M9.1 9.3a2.9 2.9 0 0 1 5.6.9c0 1.9-2.8 1.9-2.8 3.8" />
          <Circle cx="12" cy="17" r="0.9" fill={color} stroke="none" />
        </Stroke>
      );
    case 'info':
      return (
        <Stroke size={size} color={color} width={2}>
          <Circle cx="12" cy="12" r="9.5" />
          <Line x1="12" y1="11" x2="12" y2="16.5" />
          <Circle cx="12" cy="7.5" r="0.9" fill={color} stroke="none" />
        </Stroke>
      );
    case 'briefcase':
      return (
        <Stroke size={size} color={color} width={2}>
          <Rect x="2.5" y="7" width="19" height="13" rx="2.3" />
          <Path d="M15.5 7V5.3a1.8 1.8 0 0 0-1.8-1.8h-3.4a1.8 1.8 0 0 0-1.8 1.8V7" />
          <Line x1="2.5" y1="12.5" x2="21.5" y2="12.5" />
        </Stroke>
      );
    case 'sparkles':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path d="M11.5 2.5 13.3 8l5.7 1.7-5.7 1.7-1.8 5.6-1.8-5.6L4 9.7l5.7-1.7 1.8-5.5Z" />
          <Path d="M18.7 14.2l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" />
        </Svg>
      );
    case 'box':
      return (
        <Stroke size={size} color={color} width={2}>
          <Path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" />
          <Path d="M3.5 7.5v9L12 21l8.5-4.5v-9" />
          <Line x1="12" y1="12" x2="12" y2="21" />
        </Stroke>
      );
    case 'close':
      return (
        <Stroke size={size} color={color} width={2.2}>
          <Line x1="18" y1="6" x2="6" y2="18" />
          <Line x1="6" y1="6" x2="18" y2="18" />
        </Stroke>
      );
    case 'trash':
      return (
        <Stroke size={size} color={color} width={2}>
          <Path d="M3 6h18" />
          <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <Path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <Line x1="10" y1="11" x2="10" y2="17" />
          <Line x1="14" y1="11" x2="14" y2="17" />
        </Stroke>
      );
    case 'google':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            fill="#4285F4"
            d="M23.5 12.3c0-.85-.08-1.66-.22-2.44H12v4.62h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.56-5.18 3.56-8.81Z"
          />
          <Path
            fill="#34A853"
            d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3a7.4 7.4 0 0 1-11-3.9H1.1v3.1A12 12 0 0 0 12 24Z"
          />
          <Path
            fill="#FBBC05"
            d="M5.06 14.2A7.3 7.3 0 0 1 4.68 12c0-.77.13-1.5.38-2.2V6.7H1.1A12 12 0 0 0 0 12c0 1.94.46 3.77 1.1 5.3l3.96-3.1Z"
          />
          <Path
            fill="#EA4335"
            d="M12 4.75c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.2 15.24 0 12 0A12 12 0 0 0 1.1 6.7l3.96 3.1c.93-2.8 3.57-5.05 6.94-5.05Z"
          />
        </Svg>
      );
    case 'apple':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path d="M17.05 12.5c-.03-2.5 2.03-3.7 2.13-3.76-1.16-1.7-2.96-1.93-3.6-1.96-1.53-.16-2.98.9-3.76.9-.78 0-1.98-.87-3.25-.85-1.67.02-3.22.97-4.08 2.46-1.74 3.02-.44 7.48 1.25 9.93.83 1.2 1.82 2.55 3.11 2.5 1.25-.05 1.72-.8 3.23-.8s1.93.8 3.25.78c1.34-.02 2.19-1.22 3.01-2.42.95-1.39 1.34-2.73 1.36-2.8-.03-.01-2.6-1-2.63-3.98Z" />
          <Path d="M14.7 5.1c.68-.83 1.14-1.98 1.02-3.13-.98.04-2.18.66-2.88 1.48-.63.73-1.19 1.9-1.04 3.02 1.1.09 2.22-.56 2.9-1.37Z" />
        </Svg>
      );
  }
}

/** Collection icon_key values used in mockData. */
export function CollectionIcon({ iconKey, size, color }: { iconKey: string; size: number; color: string }) {
  const map: Record<string, IconName> = {
    heart: 'heart',
    briefcase: 'briefcase',
    user: 'user',
    sparkles: 'sparkles',
    box: 'box',
    folder: 'folder',
  };
  return <Icon name={map[iconKey] ?? 'folder'} size={size} color={color} />;
}
