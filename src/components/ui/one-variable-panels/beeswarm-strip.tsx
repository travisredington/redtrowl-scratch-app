import { useState } from 'react';
import type { AxisMeta } from '../../../lib/results-viz/axes';
import { linearScale, ticks } from '../../../lib/results-viz/scales';
import { beeswarmLayout, computeQuartiles } from '../../../lib/results-viz/beeswarm';
import ChartTooltip from '../chart-tooltip/chart-tooltip';
import type { BarStripRow } from './bar-strip';

interface BeeswarmStripProps {
    axis: AxisMeta;
    rows: BarStripRow[];
}

const WIDTH = 400;
const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 40;
const MARGIN_TOP = 12;
const SWARM_HEIGHT = 56;
const IQR_GAP = 12;
const IQR_HEIGHT = 8;
const DOT_RADIUS = 3;

function BeeswarmStrip({ axis, rows }: BeeswarmStripProps) {
    const [hover, setHover] = useState<{ x: number; y: number; content: string } | null>(null);

    const axisBand = axis.diverging ? 30 : 24;
    const plotLeft = MARGIN_LEFT;
    const plotRight = WIDTH - MARGIN_RIGHT;
    const swarmTop = MARGIN_TOP;
    const swarmCenterY = swarmTop + SWARM_HEIGHT / 2;
    const iqrY = swarmTop + SWARM_HEIGHT + IQR_GAP;
    const height = iqrY + IQR_HEIGHT + axisBand;

    const x = linearScale([axis.min, axis.max], [plotLeft, plotRight]);
    const zeroX = axis.diverging ? x(0) : plotLeft;

    const placed = beeswarmLayout(rows, x, {
        minDistance: DOT_RADIUS * 2 + 1,
        step: DOT_RADIUS * 2 + 1,
        maxOffset: SWARM_HEIGHT / 2 - DOT_RADIUS,
    });

    const { q1, median, q3 } = computeQuartiles(rows.map((r) => r.value));

    return (
        <>
            <svg viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={`${axis.label} scores, ${rows.length} respondents`}>
                {ticks(axis.min, axis.max, 5).map((v) => (
                    <g key={v}>
                        <line x1={x(v)} x2={x(v)} y1={swarmTop} y2={iqrY + IQR_HEIGHT} stroke="var(--viz-gridline)" strokeWidth={1} />
                        <text className="axis-label" x={x(v)} y={iqrY + IQR_HEIGHT + 16} textAnchor="middle">
                            {Math.round(v)}
                        </text>
                    </g>
                ))}

                {axis.diverging ? (
                    <>
                        <text className="pole-label" x={plotLeft} y={iqrY + IQR_HEIGHT + 27} textAnchor="start">
                            {axis.negPole}
                        </text>
                        <text className="pole-label" x={plotRight} y={iqrY + IQR_HEIGHT + 27} textAnchor="end">
                            {axis.posPole}
                        </text>
                        <line x1={zeroX} x2={zeroX} y1={swarmTop} y2={iqrY + IQR_HEIGHT} stroke="var(--viz-baseline)" strokeWidth={1.5} />
                    </>
                ) : (
                    <line x1={plotLeft} x2={plotLeft} y1={swarmTop} y2={iqrY + IQR_HEIGHT} stroke="var(--viz-baseline)" strokeWidth={1} />
                )}

                <line
                    x1={x(q1)}
                    x2={x(q3)}
                    y1={iqrY + IQR_HEIGHT / 2}
                    y2={iqrY + IQR_HEIGHT / 2}
                    stroke="var(--viz-text-muted)"
                    strokeWidth={2}
                    opacity={0.6}
                />
                <line
                    x1={x(median)}
                    x2={x(median)}
                    y1={iqrY}
                    y2={iqrY + IQR_HEIGHT}
                    stroke="var(--viz-text-primary)"
                    strokeWidth={2}
                    opacity={0.7}
                />

                {placed.map((p) => {
                    const cy = swarmCenterY + p.offset;
                    const fill = axis.diverging ? (p.value >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)') : 'var(--viz-series-1)';
                    const tooltipContent = `${p.label} — ${axis.label}: ${p.value}${
                        axis.diverging ? ` (${p.value >= 0 ? axis.posPole : axis.negPole}-leaning)` : ''
                    }`;

                    return (
                        <g key={p.id}>
                            <circle
                                className="hit"
                                cx={p.pixelPosition}
                                cy={cy}
                                r={DOT_RADIUS + 5}
                                fill="transparent"
                                onMouseEnter={(e) => setHover({ x: e.clientX, y: e.clientY, content: tooltipContent })}
                                onMouseMove={(e) => setHover({ x: e.clientX, y: e.clientY, content: tooltipContent })}
                                onMouseLeave={() => setHover(null)}
                            />
                            <circle cx={p.pixelPosition} cy={cy} r={DOT_RADIUS} fill={fill} stroke="var(--viz-surface-1)" strokeWidth={1} />
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

export default BeeswarmStrip;
