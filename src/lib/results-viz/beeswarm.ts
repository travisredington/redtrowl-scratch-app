export interface BeeswarmOptions {
    minDistance: number;
    step: number;
    maxOffset: number;
}

type WithOffset<T> = T & { pixelPosition: number; offset: number };

export function beeswarmLayout<T extends { value: number }>(
    points: T[],
    valueToPixel: (value: number) => number,
    { minDistance, step, maxOffset }: BeeswarmOptions
): WithOffset<T>[] {
    const sorted = [...points].sort((a, b) => a.value - b.value);
    const placed: { pixelPosition: number; offset: number }[] = [];
    const result: WithOffset<T>[] = [];

    sorted.forEach((point) => {
        const pixelPosition = valueToPixel(point.value);
        let offset = 0;
        let i = 0;

        while (!clearsAll(pixelPosition, offset, placed, minDistance)) {
            i += 1;
            const magnitude = Math.ceil(i / 2);
            const sign = i % 2 === 1 ? 1 : -1;
            offset = sign * magnitude * step;

            if (Math.abs(offset) > maxOffset) {
                offset = sign * maxOffset;
                break;
            }
        }

        placed.push({ pixelPosition, offset });
        result.push({ ...point, pixelPosition, offset });
    });

    return result;
}

function clearsAll(
    pixelPosition: number,
    offset: number,
    placed: { pixelPosition: number; offset: number }[],
    minDistance: number
): boolean {
    return placed.every((p) => {
        const dx = pixelPosition - p.pixelPosition;
        const dy = offset - p.offset;
        return Math.sqrt(dx * dx + dy * dy) >= minDistance;
    });
}

export interface Quartiles {
    q1: number;
    median: number;
    q3: number;
}

export function computeQuartiles(values: number[]): Quartiles {
    const sorted = [...values].sort((a, b) => a - b);

    return {
        q1: percentile(sorted, 0.25),
        median: percentile(sorted, 0.5),
        q3: percentile(sorted, 0.75),
    };
}

function percentile(sorted: number[], p: number): number {
    const index = p * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) return sorted[lower];

    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}
