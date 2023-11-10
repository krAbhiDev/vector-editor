export class Point {
    constructor(
        public x: number = 0,
        public y: number = 0
    ) { }
}
function cross(a: Point, b: Point, o: Point) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
}
export function convexHull(points_: Point[]): Point[] {
    const points = [...points_]
    points.sort(function (a, b) {
        return a.x == b.x ? a.y - b.y : a.x - b.x;
    });

    var lower = [];
    for (var i = 0; i < points.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
            lower.pop();
        }
        lower.push(points[i]);
    }

    var upper = [];
    for (var i = points.length - 1; i >= 0; i--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
            upper.pop();
        }
        upper.push(points[i]);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);

}