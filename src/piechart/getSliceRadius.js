function radiusFactor(level, factor) {
  return Array.apply(null, { length: level }).reduce((sum, v, k) => sum + Math.pow(factor, k), 0);
}

export default function getSliceRadius(hole, radius, level, factor, step = 1) {
  return {
    start: level ? hole + (radius - hole) * radiusFactor(level - 1, factor) * step : 0,
    end: hole + (radius - hole) * radiusFactor(level, factor) * step
  };
}
