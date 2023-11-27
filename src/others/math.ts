import Point from "./Point";

function cross(a: Point, b: Point, o: Point) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
}
//https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain#JavaScript
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

export function triangulatePolyline(points: Point[], strokeWidth: number): Point[] {
    const trianglePoints: Point[] = [];
    const halfWidth = strokeWidth * 0.5
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i]
        const p2 = points[i + 1]

        //normal
        const n = p2.clone().sub(p1).getNormal().scale(halfWidth)
        const n1 = n
        const n2 = n.clone().inverse()

        const pt1 = n1.clone().add(p1)
        const pt2 = n2.clone().add(p1)
        const pt3 = n2.clone().add(p2)
        const pt4 = n1.clone().add(p2)

        trianglePoints.push(pt1, pt4, pt3)
        trianglePoints.push(pt1, pt3, pt2)
    }

    return trianglePoints;
}