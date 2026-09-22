import { useState } from 'react';
import type { AxisMeta } from '../../../lib/results-viz/axes';
import { linearScale, ticks } from '../../../lib/results-viz/scales';
import ChartTooltip from '../chart-tooltip/chart-tooltip';

export interface BarStripRow {
    id: string;
    label: string;
    value: number;
    n?: number;
}

interface BarStripProps {
    axis: AxisMeta;
    rows: BarStripRow[];
}

const WIDTH = 400;
const MARGIN_LEFT = 100;
const MARGIN_RIGHT = 40;
const MARGIN_TOP = 8;
const ROW_HEIGHT = 27;
const BAR_HEIGHT = 14;
const BAR_RADIUS = 4;

function roundedRightRect(x0: number, y0: number, w: number, h: number, r: number) {
    const x1 = x0 + w;
    if (w <= r) return `M${x0},${y0} H${x1} V${y0 + h} H${x0} Z`;
    return `M${x0},${y0} H${x1 - r} Q${x1},${y0} ${x1},${y0 + r} V${y0 + h - r} Q${x1},${y0 + h} ${x1 - r},${y0 + h} H${x0} Z`;
}

function roundedLeftRect(x0: number, y0: number, w: number, h: number, r: number) {
    const x1 = x0 + w;
    if (w <= r) return `M${x0},${y0} H${x1} V${y0 + h} H${x0} Z`;
    return `M${x0 + r},${y0} H${x1} V${y0 + h} H${x0 + r} Q${x0},${y0 + h} ${x0},${y0 + h - r} V${y0 + r} Q${x0},${y0} ${x0 + r},${y0} Z`;
}

function BarStrip({ axis, rows }: BarStripProps) {
    const [hover, setHover] = useState<{ x: number; y: number; content: string } | null>(null);

    const sorted = [...rows].sort((a, b) => b.value - a.value);
    const axisBand = axis.diverging ? 30 : 24;
    const plotH = sorted.length * ROW_HEIGHT;
    const height = MARGIN_TOP + plotH + axisBand;
    const plotLeft = MARGIN_LEFT;
    const plotRight = WIDTH - MARGIN_RIGHT;
    const x = linearScale([axis.min, axis.max], [plotLeft, plotRight]);
    const zeroX = axis.diverging ? x(0) : plotLeft;

    return (
        <>
            <svg viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={`${axis.label} scores by person`}>
                {ticks(axis.min, axis.max, 5).map((v) => (
                    <g key={v}>
                        <line x1={x(v)} x2={x(v)} y1={MARGIN_TOP} y2={MARGIN_TOP + plotH} stroke="var(--viz-gridline)" strokeWidth={1} />
                        <text className="axis-label" x={x(v)} y={MARGIN_TOP + plotH + 16} textAnchor="middle">
                            {Math.round(v)}
                        </text>
                    </g>
                ))}

                {axis.diverging ? (
                    <>
                        <text className="pole-label" x={plotLeft} y={MARGIN_TOP + plotH + 27} textAnchor="start">
                            {axis.negPole}
                        </text>
                        <text className="pole-label" x={plotRight} y={MARGIN_TOP + plotH + 27} textAnchor="end">
                            {axis.posPole}
                        </text>
                        <line x1={zeroX} x2={zeroX} y1={MARGIN_TOP} y2={MARGIN_TOP + plotH} stroke="var(--viz-baseline)" strokeWidth={1.5} />
                    </>
                ) : (
                    <line x1={plotLeft} x2={plotLeft} y1={MARGIN_TOP} y2={MARGIN_TOP + plotH} stroke="var(--viz-baseline)" strokeWidth={1} />
                )}

                {sorted.map((row, i) => {
                    const rowY = MARGIN_TOP + i * ROW_HEIGHT;
                    const barY = rowY + (ROW_HEIGHT - BAR_HEIGHT) / 2;
                    const val = row.value;
                    const showLabel = i === 0 || i === sorted.length - 1;

                    let path: string;
                    let labelX: number;
                    let anchor: 'start' | 'end';
                    let fill: string;

                    if (axis.diverging) {
                        const vx = x(val);
                        if (val >= 0) {
                            path = roundedRightRect(zeroX, barY, vx - zeroX, BAR_HEIGHT, BAR_RADIUS);
                            labelX = vx + 6;
                            anchor = 'start';
                        } else {
                            path = roundedLeftRect(vx, barY, zeroX - vx, BAR_HEIGHT, BAR_RADIUS);
                            labelX = vx - 6;
                            anchor = 'end';
                        }
                        fill = val >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)';
                    } else {
                        const bw = x(val) - plotLeft;
                        path = roundedRightRect(plotLeft, barY, bw, BAR_HEIGHT, BAR_RADIUS);
                        labelX = plotLeft + bw + 6;
                        anchor = 'start';
                        fill = 'var(--viz-series-1)';
                    }

                    const tooltipContent = `${row.label}${row.n ? ` (n=${row.n})` : ''} — ${axis.label}: ${val}${
                        axis.diverging ? ` (${val >= 0 ? axis.posPole : axis.negPole}-leaning)` : ''
                    }`;

                    return (
                        <g key={row.id}>
                            <text className="name-label" x={plotLeft - 8} y={barY + BAR_HEIGHT / 2 + 4} textAnchor="end">
                                {row.label}
                            </text>
                            <path d={path} fill={fill} />
                            {showLabel && (
                                <text className="value-label" x={labelX} y={barY + BAR_HEIGHT / 2 + 4} textAnchor={anchor}>
                                    {val}
                                </text>
                            )}
                            <rect
                                className="hit"
                                x={plotLeft}
                                y={rowY}
                                width={plotRight - plotLeft}
                                height={ROW_HEIGHT}
                                fill="transparent"
                                onMouseEnter={(e) => setHover({ x: e.clientX, y: e.clientY, content: tooltipContent })}
                                onMouseMove={(e) => setHover({ x: e.clientX, y: e.clientY, content: tooltipContent })}
                                onMouseLeave={() => setHover(null)}
                            />
                        </g>
                    );
                })}
            </svg>
            <ChartTooltip x={hover?.x ?? 0} y={hover?.y ?? 0} visible={hover !== null}>
                {hover?.content}
            </ChartTooltip>
        </>
    );
}

export default BarStrip;
