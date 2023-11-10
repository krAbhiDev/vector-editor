

export function repeat(times: number, callback: (i: number) => void) {
    for (let i = 0; i < times; i++) {
        callback(i)
    }
}

export function randomRange(a: number, b: number) {
    return a + (b - a) * Math.random()
}