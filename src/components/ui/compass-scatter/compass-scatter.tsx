import { useEffect, useState } from 'react';
import type { PersonResult, TraitKey } from '../../../lib/results-viz/types';
import { POLITICAL_AXES, TRAITS } from '../../../lib/results-viz/axes';
import { linearScale, ticks } from '../../../lib/results-viz/scales';
import { sequentialColor } from '../../../lib/results-viz/color';
import ChartTooltip from '../chart-tooltip/chart-tooltip';
import ColorLegend from './color-legend';
import './compass-scatter.css';

interface CompassScatterProps {
    data: PersonResult[];
    colorTrait: TraitKey;
    onColorTraitChange: (trait: TraitKey) => void;
    ringIdentity: string;
    onRingIdentityChange: (identity: string) => void;
}

const WIDTH = 640;
const HEIGHT = 500;
const MARGIN_LEFT = 60;
const MARGIN_RIGHT = 20;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 44;
const SEQ_LOW_FALLBACK = '#d6edef';
const SEQ_HIGH_FALLBACK = '#005257';

const econAxis = POLITICAL_AXES.find((a) => a.key === 'econ')!;
const socAxis = POLITICAL_AXES.find((a) => a.key === 'soc')!;

function readSeqColors(): [string, string] {
    if (typeof window === 'undefined') return [SEQ_LOW_FALLBACK, SEQ_HIGH_FALLBACK];
    const style = getComputedStyle(document.documentElement);
    const low = style.getPropertyValue('--viz-seq-low').trim() || SEQ_LOW_FALLBACK;
    const high = style.getPropertyValue('--viz-seq-high').trim() || SEQ_HIGH_FALLBACK;
    return [low, high];
}

function CompassScatter({ data, colorTrait, onColorTraitChange, ringIdentity, onRingIdentityChange }: CompassScatterProps) {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
    const [, forceThemeRefresh] = useState(0);

    useEffect(() => {
        if (typeof window.matchMedia !== 'function') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => forceThemeRefresh((n) => n + 1);
        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
    }, []);

    const colorAxis = TRAITS.find((t) => t.key === colorTrait)!;
    const [seqLow, seqHigh] = readSeqColors();

    const identityValues = [...new Set(data.map((p) => p.identity).filter((v): v is string => v !== undefined))].sort();

    const plotLeft = MARGIN_LEFT;
    const plotRight = WIDTH - MARGIN_RIGHT;
    const plotTop = MARGIN_TOP;
    const plotBottom = HEIGHT - MARGIN_BOTTOM;

    const sx = linearScale([econAxis.min, econAxis.max], [plotLeft, plotRight]);
    const sy = linearScale([socAxis.min, socAxis.max], [plotBottom, plotTop]);
    const zeroX = sx(0);
    const zeroY = sy(0);

    const quadrantLabels = [
        { x: plotLeft + 6, y: plotTop + 12, text: 'Authoritarian Left', anchor: 'start' as const },
        { x: plotRight - 6, y: plotTop + 12, text: 'Authoritarian Right', anchor: 'end' as const },
        { x: plotLeft + 6, y: plotBottom - 6, text: 'Libertarian Left', anchor: 'start' as const },
        { x: plotRight - 6, y: plotBottom - 6, text: 'Libertarian Right', anchor: 'end' as const },
    ];

    return (
        <div className="compass-scatter">
            <div className="controls">
                <label>
                    Color points by
                    <select value={colorTrait} onChange={(e) => onColorTraitChange(e.target.value as TraitKey)}>
                        {TRAITS.map((t) => (
                            <option key={t.key} value={t.key}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Ring around
                    <select value={ringIdentity} onChange={(e) => onRingIdentityChange(e.target.value)}>
                        <option value="">— none —</option>
                        {identityValues.map((identity) => (
                            <option key={identity} value={identity}>
                                {identity}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="chart-mount">
                <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Political compass, points colored by ${colorAxis.label}`}>
                    {ticks(econAxis.min, econAxis.max, 5).map((v) => (
                        <g key={`x-${v}`}>
                            <line x1={sx(v)} x2={sx(v)} y1={plotTop} y2={plotBottom} stroke="var(--viz-gridline)" />
                            <text className="axis-label" x={sx(v)} y={plotBottom + 16} textAnchor="middle">
                                {Math.round(v)}
                            </text>
                        </g>
                    ))}
                    {ticks(socAxis.min, socAxis.max, 5).map((v) => (
                        <g key={`y-${v}`}>
                            <line x1={plotLeft} x2={plotRight} y1={sy(v)} y2={sy(v)} stroke="var(--viz-gridline)" />
                            <text className="axis-label" x={plotLeft - 8} y={sy(v) + 3} textAnchor="end">
                                {Math.round(v)}
                            </text>
                        </g>
                    ))}

                    <line x1={zeroX} x2={zeroX} y1={plotTop} y2={plotBottom} stroke="var(--viz-baseline)" strokeWidth={1.5} />
                    <line x1={plotLeft} x2={plotRight} y1={zeroY} y2={zeroY} stroke="var(--viz-baseline)" strokeWidth={1.5} />

                    {quadrantLabels.map((q) => (
                        <text key={q.text} className="quadrant-label" x={q.x} y={q.y} textAnchor={q.anchor}>
                            {q.text}
                        </text>
                    ))}

                    <text className="trait-title" x={(plotLeft + plotRight) / 2} y={HEIGHT - 6} textAnchor="middle">
                        {econAxis.label}
                    </text>
                    <text
                        className="trait-title"
                        x={-((plotTop + plotBottom) / 2)}
                        y={14}
                        textAnchor="middle"
                        transform="rotate(-90)"
                    >
                        {socAxis.label}
                    </text>

                    {data.map((person) => {
                        const cx = sx(person.econ);
                        const cy = sy(person.soc);
                        const fill = sequentialColor(person[colorTrait], colorAxis.min, colorAxis.max, seqLow, seqHigh);
                        const isRinged = ringIdentity !== '' && person.identity === ringIdentity;
                        const identityLine = person.identity ? `Identity: ${person.identity}` : 'Identity: —';
                        const tooltipContent = `${person.name} — Economic: ${person.econ} (${person.econ >= 0 ? 'Right' : 'Left'}), Social: ${person.soc} (${person.soc >= 0 ? 'Authoritarian' : 'Libertarian'}), ${colorAxis.label}: ${person[colorTrait]}, ${identityLine}`;

                        return (
                            <g key={person.id}>
                                {isRinged && (
                                    <circle cx={cx} cy={cy} r={11} fill="none" stroke="var(--viz-text-primary)" strokeWidth={2} />
                                )}
                                <circle cx={cx} cy={cy} r={7} fill={fill} stroke="var(--viz-surface-1)" strokeWidth={2} />
                                <text className="name-label" x={cx + 10} y={cy - 9}>
                                    {person.name}
                                </text>
                                <circle
                                    className="hit"
                                    cx={cx}
                                    cy={cy}
                                    r={13}
                                    fill="transparent"
                                    onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: tooltipContent })}
                                    onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: tooltipContent })}
                                    onMouseLeave={() => setTooltip(null)}
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="legend-row">
                <ColorLegend lowLabel={`${colorAxis.label}: ${colorAxis.min}`} highLabel={String(colorAxis.max)} />
                <span className="note">the ring marks whichever identity group is selected, independent of fill color</span>
            </div>

            <ChartTooltip x={tooltip?.x ?? 0} y={tooltip?.y ?? 0} visible={tooltip !== null}>
                {tooltip?.content}
            </ChartTooltip>
        </div>
    );
}

export default CompassScatter;
