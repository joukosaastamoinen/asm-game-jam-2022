export type Point = {
  x: number;
  y: number;
};

export const vectorLength = (point: Point) =>
  Math.sqrt(point.x * point.x + point.y * point.y);

export const identityVector = (point: Point) => {
  const l = vectorLength(point);
  return { x: point.x / l, y: point.y / l };
};

export const vectorMul = (coefficient: number, point: Point) => {
  return { x: coefficient * point.x, y: coefficient * point.y };
};

export const vectorAdd = (a: Point, b: Point): Point => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
};

export const vectorSub = (a: Point, b: Point): Point => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
};

export const distance = (a: Point, b: Point): number => {
  return vectorLength(vectorSub(a, b));
};
