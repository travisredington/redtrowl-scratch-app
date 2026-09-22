function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.trim().replace('#', '');
    return [
        parseInt(clean.substring(0, 2), 16),
        parseInt(clean.substring(2, 4), 16),
        parseInt(clean.substring(4, 6), 16),
    ];
}

export function lerpColor(t: number, lowHex: string, highHex: string): string {
    const low = hexToRgb(lowHex);
    const high = hexToRgb(highHex);
    const [r, g, b] = low.map((v, i) => Math.round(v + (high[i] - v) * t));
    return `rgb(${r},${g},${b})`;
}

export function sequentialColor(value: number, min: number, max: number, lowHex: string, highHex: string): string {
    const t = (value - min) / (max - min);
    return lerpColor(t, lowHex, highHex);
}
