import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

export const SearchIcon: React.FC<{ color?: string; size?: number }> = ({
  color = '#747473',
  size = 18,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={1.8} />
    <Path
      d="M16.5 16.5L21 21"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

interface IconProps {
  color: string;
  size?: number;
}

const STROKE = 1.75;

export const HomeIcon: React.FC<IconProps> = ({ color, size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* House outline */}
    <Path
      d="M3 10.5L12 3L21 10.5V20C21 20.552 20.552 21 20 21H15.5V16C15.5 15.448 15.052 15 14.5 15H9.5C8.948 15 8.5 15.448 8.5 16V21H4C3.448 21 3 20.552 3 20V10.5Z"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
    {/* Eyes */}
    <Circle cx="9.8" cy="12.5" r="0.85" fill={color} />
    <Circle cx="14.2" cy="12.5" r="0.85" fill={color} />
    {/* Smile */}
    <Path
      d="M9.5 14.8 Q12 16.8 14.5 14.8"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

export const TasksIcon: React.FC<IconProps> = ({ color, size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Clipboard body */}
    <Rect
      x="4.5"
      y="4.5"
      width="15"
      height="17"
      rx="2"
      stroke={color}
      strokeWidth={STROKE}
    />
    {/* Clip bar at top */}
    <Rect
      x="8.5"
      y="2.5"
      width="7"
      height="4"
      rx="1.5"
      stroke={color}
      strokeWidth={STROKE}
    />
    {/* Heart inside */}
    <Path
      d="M12 18L8 14.5C7 13.3 7.8 11.5 9.3 11.5C10.1 11.5 10.8 12 12 13.2C13.2 12 13.9 11.5 14.7 11.5C16.2 11.5 17 13.3 16 14.5L12 18Z"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
  </Svg>
);

export const AppointmentsIcon: React.FC<IconProps> = ({ color, size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Calendar body */}
    <Rect
      x="3"
      y="4"
      width="18"
      height="17"
      rx="2"
      stroke={color}
      strokeWidth={STROKE}
    />
    {/* Header divider */}
    <Line
      x1="3"
      y1="9.5"
      x2="21"
      y2="9.5"
      stroke={color}
      strokeWidth={STROKE}
    />
    {/* Left pin */}
    <Line
      x1="8"
      y1="2"
      x2="8"
      y2="6.5"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinecap="round"
    />
    {/* Right pin */}
    <Line
      x1="16"
      y1="2"
      x2="16"
      y2="6.5"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinecap="round"
    />
  </Svg>
);

export const DocumentsIcon: React.FC<IconProps> = ({ color, size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* File body with dog-ear */}
    <Path
      d="M4 2.5H14.5L20 8V21C20 21.55 19.55 22 19 22H4C3.45 22 3 21.55 3 21V3.5C3 2.95 3.45 2.5 4 2.5Z"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
    {/* Dog-ear fold */}
    <Path
      d="M14.5 2.5V8H20"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
    {/* Bookmark ribbon on right */}
    <Path
      d="M16 10V18L13.5 16L11 18V10H16Z"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
  </Svg>
);
