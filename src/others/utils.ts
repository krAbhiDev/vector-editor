import Point from "./Point";


export function repeat(times: number, callback: (i: number) => void) {
    for (let i = 0; i < times; i++) {
        callback(i)
    }
}

export function randomRange(a: number, b: number) {
    return a + (b - a) * Math.random()
}

export function randomPoints(width: number, height: number, count: number): Point[] {
    const points: Point[] = [];

    for (let i = 0; i < count; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        points.push(new Point(x, y));
    }

    return points;
}
export const rad2deg = 180 / Math.PI
export const deg2rad = 1 / rad2deg