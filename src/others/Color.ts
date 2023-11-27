export class Color {
    constructor(
        public r = 0,
        public g = 0,
        public b = 0,
        public a = 255) {
    }
    // Create a Color instance from a hexadecimal color string
    public static fromHex(hex: string): Color {
        // Remove the leading '#' if present
        hex = hex.replace("#", "");

        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = parseInt(hex.slice(6, 8), 16) || 255;

        return new Color(r, g, b, a);
    }

    
    //return color in canvas color format
    public get color(): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }
    //create function drawLines(Point[] points, Color color = Color.black, int thickness = 1)

}
