import { useWindowDimensions } from 'react-native';

/** Width of the HTML reference phone; all reference px values scale from this. */
export const REF_WIDTH = 248;

/**
 * Proportional scale so UI reads like the reference composition on any device.
 *
 * The HTML reference is a 248px miniature: using its px values 1:1 renders
 * too small on a real phone, but scaling 1:1 with width overshoots (an 83dp
 * CTA, 35sp onboarding titles). Damp the ratio so type and layout land in
 * a comfortable middle ground, capped for tablets.
 */
export function useRefScale() {
  const { width } = useWindowDimensions();
  const ratio = Math.min(width, 500) / REF_WIDTH;
  const s = Math.min(1 + (ratio - 1) * 0.45, 1.35);
  return (n: number) => n * s;
}
