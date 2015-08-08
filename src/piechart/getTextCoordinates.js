import getAnglePoint from './getAnglePoint';
import getSliceRadius from './getSliceRadius';

export default function getTextCoordinates(slice, hole, radius, center, factor) {
  const sliceRadius = getSliceRadius(hole, radius, slice.level, factor);
  const c = getAnglePoint(
    (slice.start + slice.end) / 2, 0,
    hole && (sliceRadius.start + sliceRadius.end) / 2, center, center
  );

  if (!slice.level) {
    return { x: 50, y: 50 };
  }

  return {
    x: c.x1 / (center * 2) * 100,
    y: c.y1 / (center * 2) * 100
  };
}
