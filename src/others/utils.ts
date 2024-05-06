import Point from "./Point";

export function repeat(times: number, callback: (i: number) => void) {
  for (let i = 0; i < times; i++) {
    callback(i);
  }
}

export function randomRange(a: number, b: number) {
  return a + (b - a) * Math.random();
}

export function randomPoints(
  width: number,
  height: number,
  count: number
): Point[] {
  const points: Point[] = [];

  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    points.push(new Point(x, y));
  }

  return points;
}
export const rad2deg = 180 / Math.PI;
export const deg2rad = 1 / rad2deg;

export function setTimer(
  callback: (times: number) => void,
  interval: number,
  delay: number = 0,
  repeat: number = -1,
  endCallback?: () => void
) {
  let count = 0;
  setTimeout(() => {
    const id = setInterval(() => {
      count++;

      if (count > repeat && repeat > 0) {
        clearInterval(id);
      } else {
        if (count == repeat) {
          endCallback?.();
        }
        callback(count);
      }
    }, interval);
  }, delay);
}

export function randomValue<T>(values: T[]) {
  return values[Math.floor(Math.random() * values.length)];
}

export function toInt(value: number | string) {
  return parseInt(value.toString());
}

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum as any)
    .map((n) => Number.parseInt(n))
    .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  console.log(enumValues, randomIndex)
  const randomEnumValue = enumValues[randomIndex];
  return randomEnumValue;
}
