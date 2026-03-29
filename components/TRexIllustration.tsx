import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { colors } from '@/lib/theme';

interface Props {
  size?: number;
  color?: string;
}

/**
 * Minimal geometric T-Rex. Front-facing. Big head. Tiny arms. Flat expression.
 * ViewBox: 0 0 100 130
 */
export default function TRexIllustration({ size = 120, color = colors.primary }: Props) {
  const height = size * 1.3;

  return (
    <Svg viewBox="0 0 100 130" width={size} height={height}>
      {/* Body */}
      <Ellipse cx="50" cy="83" rx="16" ry="18" fill={color} />

      {/* Neck — bridges the gap between head and body */}
      <Rect x="43" y="52" width="14" height="20" fill={color} />

      {/* Head — the dominant feature */}
      <Circle cx="50" cy="30" r="27" fill={color} />

      {/* Tiny left arm (the punchline) */}
      <Rect x="13" y="76" width="21" height="7" rx="3.5" fill={color} />

      {/* Tiny right arm */}
      <Rect x="66" y="76" width="21" height="7" rx="3.5" fill={color} />

      {/* Left leg */}
      <Rect x="36" y="97" width="11" height="24" rx="4" fill={color} />

      {/* Right leg */}
      <Rect x="53" y="97" width="11" height="24" rx="4" fill={color} />

      {/* Left foot */}
      <Rect x="27" y="115" width="20" height="8" rx="4" fill={color} />

      {/* Right foot */}
      <Rect x="53" y="115" width="20" height="8" rx="4" fill={color} />

      {/* Left eye — white sclera */}
      <Circle cx="37" cy="27" r="9" fill="white" />
      {/* Left iris */}
      <Circle cx="37" cy="28" r="5" fill={color} />
      {/* Left eye highlight */}
      <Circle cx="39" cy="26" r="2" fill="white" />

      {/* Right eye — white sclera */}
      <Circle cx="63" cy="27" r="9" fill="white" />
      {/* Right iris */}
      <Circle cx="63" cy="28" r="5" fill={color} />
      {/* Right eye highlight */}
      <Circle cx="65" cy="26" r="2" fill="white" />

      {/* Nostrils */}
      <Circle cx="45" cy="42" r="1.5" fill="rgba(255,255,255,0.45)" />
      <Circle cx="55" cy="42" r="1.5" fill="rgba(255,255,255,0.45)" />

      {/* Mouth — completely flat, completely unimpressed */}
      <Path
        d="M 40 49 L 60 49"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
