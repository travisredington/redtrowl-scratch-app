import { useState } from 'react';
import type { PersonResult } from '../../../lib/results-viz/types';
import { ALL_AXES } from '../../../lib/results-viz/axes';
import { linearScale } from '../../../lib/results-viz/scales';
import ChartTooltip from '../chart-tooltip/chart-tooltip';
import './parallel-coordinates.css';

interface ParallelCoordinatesProps {
    data: PersonResult[];
    highlightSelector: string;
    onHighlightSelectorChange: (selector: string) => void;
}

const WIDTH = 760;
const HEIGHT = 400;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 50;
const MARGIN_TOP = 34;
const MARGIN_BOTTOM = 28;

function personSelector(id: string) {
    return `person:${id}`;
}

function identitySelector(identity: string) {
    return `identity:${identity}`;
}

function matchesSelector(person: PersonResult, selector: string): boolean {
    if (!selector) return false;
    if (selector.startsWith('person:')) return person.id === selector.slice('person:'.length);
    if (selector.startsWith('identity:')) return person.identity === selector.slice('identity:'.length);
    return false;
}

// Roughly 0.35 opacity at N<=20 down to ~0.08 at N>=300, so dense datasets don't turn into gray mush.
function unhighlightedOpacity(n: number): number {
    const MIN_N = 20;
    const MAX_N = 300;
    const MAX_OPACITY = 0.35;
    const MIN_OPACITY = 0.08;

    if (n <= MIN_N) return MAX_OPACITY;
    if (n >= MAX_N) return MIN_OPACITY;

    const scale = linearScale([MIN_N, MAX_N], [MAX_OPACITY, MIN_OPACITY]);
    return scale(n);
}

function ParallelCoordinates({ data, highlightSelector, onHighlightSelectorChange }: ParallelCoordinatesProps) {
    const [hoverSelector, setHoverSelector] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

    const identityValues = [...new Set(data.map((p) => p.identity).filter((v): v is string => v !== undefined))].sort();
    const activeSelector = hoverSelector ?? highlightSelector;
    const restOpacity = unhighlightedOpacity(data.length);

    const plotTop = MARGIN_TOP;
    const plotBottom = HEIGHT - MARGIN_BOTTOM;
    const axisCount = ALL_AXES.length;
    const axisX = (i: number) => MARGIN_LEFT + i * ((WIDTH - MARGIN_LEFT - MARGIN_RIGHT) / (axisCount - 1));
    const axisScales = ALL_AXES.map((axis) => linearScale([axis.min, axis.max], [plotBottom, plotTop]));

    const ordered = [...data].sort(
        (a, b) => (matchesSelector(a, activeSelector) ? 1 : 0) - (matchesSelector(b, activeSelector) ? 1 : 0)
    );

    return (
        <div className="parallel-coordinates">
            <div className="controls">
                <label>
                    Highlight
                    <select value={highlightSelector} onChange={(e) => onHighlightSelectorChange(e.target.value)}>
                        <option value="">— none —</option>
                        {data.length > 0 && (
                            <optgroup label="Person">
                                {data.map((p) => (
                                    <option key={p.id} value={personSelector(p.id)}>
                                        {p.name}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                        {identityValues.length > 0 && (
                            <optgroup label="Identity">
                                {identityValues.map((identity) => (
                                    <option key={identity} value={identitySelector(identity)}>
                                        Everyone: {identity}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                    </select>
                </label>
                <span className="note">or hover any line to preview a highlight, click to pin it</span>
            </div>

            <div className="chart-mount">
                <svg
                    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                    role="img"
                    aria-label="All five traits and both compass axes per person, parallel coordinates"
                >
                    <line
                        x1={MARGIN_LEFT}
                        x2={WIDTH - MARGIN_RIGHT}
                        y1={(plotTop + plotBottom) / 2}
                        y2={(plotTop + plotBottom) / 2}
                        stroke="var(--viz-gridline)"
                    />

                    {ALL_AXES.map((axis, i) => {
                        const x = axisX(i);
                        const isLast = i === axisCount - 1;
                        const labelAnchor = isLast ? 'end' : 'start';
                        const labelX = isLast ? x - 4 : x + 4;

                        return (
                            <g key={axis.key}>
                                <line x1={x} x2={x} y1={plotTop} y2={plotBottom} stroke="var(--viz-baseline)" />
                                <text className="trait-title" x={x} y={plotTop - 18} textAnchor="middle">
                                    {axis.key}
                                </text>
                                <text className="axis-label" x={labelX} y={plotTop - 4} textAnchor={labelAnchor}>
                                    {axis.max}
                                    {axis.posPoleShort ? ` ${axis.posPoleShort}` : ''}
                                </text>
                                <text className="axis-label" x={labelX} y={plotBottom + 14} textAnchor={labelAnchor}>
                                    {axis.min}
                                    {axis.negPoleShort ? ` ${axis.negPoleShort}` : ''}
                                </text>
                            </g>
                        );
                    })}

                    {ordered.map((person) => {
                        const isActive = matchesSelector(person, activeSelector);
                        const points = ALL_AXES.map((axis, i) => `${axisX(i)},${axisScales[i](person[axis.key])}`).join(' ');
                        const selector = personSelector(person.id);
                        const tooltipContent = person.identity ? `${person.name} — ${person.identity}` : person.name;

                        return (
                            <g key={person.id}>
                                <polyline
                                    points={points}
                                    fill="none"
                                    stroke={isActive ? 'var(--viz-series-1)' : 'var(--viz-gray-line)'}
                                    strokeWidth={isActive ? 2.5 : 1.4}
                                    opacity={isActive ? 1 : restOpacity}
                                />
                                {isActive &&
                                    ALL_AXES.map((axis, i) => {
                                        const cx = axisX(i);
                                        const cy = axisScales[i](person[axis.key]);
                                        return (
                                            <g key={axis.key}>
                                                <circle cx={cx} cy={cy} r={3.5} fill="var(--viz-series-1)" stroke="var(--viz-surface-1)" strokeWidth={1.5} />
                                                <text className="value-label" x={cx} y={cy - 9} textAnchor="middle">
                                                    {person[axis.key]}
                                                </text>
                                            </g>
                                        );
                                    })}
                                <polyline
                                    className="hit"
                                    points={points}
                                    fill="none"
                                    stroke="transparent"
                                    strokeWidth={12}
                                    onMouseEnter={(e) => {
                                        setHoverSelector(selector);
                                        setTooltip({ x: e.clientX, y: e.clientY, content: tooltipContent });
                                    }}
                                    onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: tooltipContent })}
                                    onMouseLeave={() => {
                                        setHoverSelector(null);
                                        setTooltip(null);
                                    }}
                                    onClick={() => onHighlightSelectorChange(selector)}
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="legend">
                <span>
                    <span className="dot dot-active" />
                    Highlighted
                </span>
                <span>
                    <span className="dot dot-rest" />
                    Everyone else
                </span>
            </div>

            <ChartTooltip x={tooltip?.x ?? 0} y={tooltip?.y ?? 0} visible={tooltip !== null}>
                {tooltip?.content}
            </ChartTooltip>
        </div>
    );
}

export default ParallelCoordinates;
