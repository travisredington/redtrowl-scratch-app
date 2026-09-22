export function linearScale(domain: [number, number], range: [number, number]) {
    const [domainMin, domainMax] = domain;
    const [rangeMin, rangeMax] = range;

    return (value: number) =>
        rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);
}

export function ticks(min: number, max: number, count: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
        out.push(min + (i / (count - 1)) * (max - min));
    }
    return out;
}
