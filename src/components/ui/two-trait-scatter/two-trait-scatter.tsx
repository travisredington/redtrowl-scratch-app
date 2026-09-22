import { useState } from 'react';
import type { PersonResult, TraitKey } from '../../../lib/results-viz/types';
import { TRAITS } from '../../../lib/results-viz/axes';
import { linearScale, ticks } from '../../../lib/results-viz/scales';
import ChartTooltip from '../chart-tooltip/chart-tooltip';
import './two-trait-scatter.css';

interface TwoTraitScatterProps {
    data: PersonResult[];
    xTrait: TraitKey;
    yTrait: TraitKey;
    onXTraitChange: (trait: TraitKey) => void;
    onYTraitChange: (trait: TraitKey) => void;
}

const WIDTH = 640;
const HEIGHT = 460;
const MARGIN_LEFT = 60;
const MARGIN_RIGHT = 20;
const MARGIN_TOP = 16;
const MARGIN_BOTTOM = 44;
// Plot-area px^2 per point below which labels go hover-only — crowding depends on spread, not raw N.
const POINT_LABEL_DENSITY_THRESHOLD = 2000;

function nextTraitAfter(value: TraitKey): TraitKey {
    const index = TRAITS.findIndex((t) => t.key === value);
    return TRAITS[(index + 1) % TRAITS.length].key;
}

function TwoTraitScatter({ data, xTrait, yTrait, onXTraitChange, onYTraitChange }: TwoTraitScatterProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

    const xAxis = TRAITS.find((t) => t.key === xTrait)!;
    const yAxis = TRAITS.find((t) => t.key === yTrait)!;

    const plotLeft = MARGIN_LEFT;
    const plotRight = WIDTH - MARGIN_RIGHT;
    const plotTop = MARGIN_TOP;
    const plotBottom = HEIGHT - MARGIN_BOTTOM;

    const sx = linearScale([xAxis.min, xAxis.max], [plotLeft, plotRight]);
    const sy = linearScale([yAxis.min, yAxis.max], [plotBottom, plotTop]);

    const plotArea = (plotRight - plotLeft) * (plotBottom - plotTop);
    const alwaysShowLabels = data.length === 0 || plotArea / data.length >= POINT_LABEL_DENSITY_THRESHOLD;

    function handleXChange(value: TraitKey) {
        if (value === yTrait) onYTraitChange(nextTraitAfter(value));
        onXTraitChange(value);
    }

    function handleYChange(value: TraitKey) {
        if (value === xTrait) onXTraitChange(nextTraitAfter(value));
        onYTraitChange(value);
    }

    return (
        <div className="two-trait-scatter">
            <div className="controls">
                <label>
                    X axis
                    <select value={xTrait} onChange={(e) => handleXChange(e.target.value as TraitKey)}>
                        {TRAITS.map((t) => (
                            <option key={t.key} value={t.key}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Y axis
                    <select value={yTrait} onChange={(e) => handleYChange(e.target.value as TraitKey)}>
                        {TRAITS.map((t) => (
                            <option key={t.key} value={t.key}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="chart-mount">
                <svg
                    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                    role="img"
                    aria-label={`${xAxis.label} versus ${yAxis.label}, one point per person`}
                >
                    {ticks(xAxis.min, xAxis.max, 5).map((v) => (
                        <g key={`x-${v}`}>
                            <line x1={sx(v)} x2={sx(v)} y1={plotTop} y2={plotBottom} stroke="var(--viz-gridline)" />
                            <text className="axis-label" x={sx(v)} y={plotBottom + 16} textAnchor="middle">
                                {Math.round(v)}
                            </text>
                        </g>
                    ))}
                    {ticks(yAxis.min, yAxis.max, 5).map((v) => (
                        <g key={`y-${v}`}>
                            <line x1={plotLeft} x2={plotRight} y1={sy(v)} y2={sy(v)} stroke="var(--viz-gridline)" />
                            <text className="axis-label" x={plotLeft - 8} y={sy(v) + 3} textAnchor="end">
                                {Math.round(v)}
                            </text>
                        </g>
                    ))}
                    <line x1={plotLeft} x2={plotLeft} y1={plotTop} y2={plotBottom} stroke="var(--viz-baseline)" />
                    <line x1={plotLeft} x2={plotRight} y1={plotBottom} y2={plotBottom} stroke="var(--viz-baseline)" />

                    <text className="trait-title" x={(plotLeft + plotRight) / 2} y={HEIGHT - 6} textAnchor="middle">
                        {xAxis.label}
                    </text>
                    <text
                        className="trait-title"
                        x={-((plotTop + plotBottom) / 2)}
                        y={14}
                        textAnchor="middle"
                        transform="rotate(-90)"
                    >
                        {yAxis.label}
                    </text>

                    {data.map((person) => {
                        const cx = sx(person[xTrait]);
                        const cy = sy(person[yTrait]);
                        const showLabel = alwaysShowLabels || hoveredId === person.id;
                        const tooltipContent = `${person.name} — ${xAxis.label}: ${person[xTrait]}, ${yAxis.label}: ${person[yTrait]}`;

                        return (
                            <g key={person.id}>
                                <circle cx={cx} cy={cy} r={6} fill="var(--viz-series-1)" stroke="var(--viz-surface-1)" strokeWidth={2} />
                                {showLabel && (
                                    <text className="name-label" x={cx + 9} y={cy - 8}>
                                        {person.name}
                                    </text>
                                )}
                                <circle
                                    className="hit"
                                    cx={cx}
                                    cy={cy}
                                    r={13}
                                    fill="transparent"
                                    onMouseEnter={(e) => {
                                        setHoveredId(person.id);
                                        setTooltip({ x: e.clientX, y: e.clientY, content: tooltipContent });
                                    }}
                                    onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: tooltipContent })}
                                    onMouseLeave={() => {
                                        setHoveredId(null);
                                        setTooltip(null);
                                    }}
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>
            <ChartTooltip x={tooltip?.x ?? 0} y={tooltip?.y ?? 0} visible={tooltip !== null}>
                {tooltip?.content}
            </ChartTooltip>
        </div>
    );
}

export default TwoTraitScatter;
