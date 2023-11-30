import Point from "./Point";
import { rad2deg } from "./utils";

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
export function triangulatePolylineInMiter(points: Point[], strokeWidth: number): Point[] {
    const trianglePoints: Point[] = [];
    if (points.length == 2) {
        trianglePoints.push(...triangulatePolyline(points, strokeWidth))
    } else {
        const halfWidth = strokeWidth * 0.5
        for (let i = 1; i <= points.length - 2; i++) {
            const a = points[i - 1]
            const b = points[i]
            const c = points[i + 1]
            const ab = a.clone().sub(b);
            const ab_n1 = ab.getNormal().scale(halfWidth)
            const ab_n2 = ab_n1.clone().inverse()

            const cb = c.clone().sub(b);
            const cb_n1 = cb.getNormal().scale(halfWidth)
            const cb_n2 = cb_n1.clone().inverse()
            const beta = ab.angleWith(cb)
            const ab_len = ab.length()
            const cb_len = cb.length()
            let sin = Math.sin(beta)
           

            const u = ab.clone().scale(1 / ab_len).scale(halfWidth / sin)
            const v = cb.clone().scale(1 / cb_len).scale(halfWidth / sin)

            const d = b.clone().add(u).add(v)
            const e = b.clone().sub(u).sub(v)

            const p = {
                1: ab_n1.clone().add(a),
                2: ab_n2.clone().add(a),
                3: d,
                4: cb_n2.clone().add(c),
                5: cb_n1.clone().add(c),
                6: e
            }

            trianglePoints.push(p[1], p[6], p[3])
            trianglePoints.push(p[1], p[3], p[2])
            trianglePoints.push(p[3], p[4], p[5])
            trianglePoints.push(p[6], p[4], p[3])

            //normal
            const _ = ""

        }
    }

    return trianglePoints;
}