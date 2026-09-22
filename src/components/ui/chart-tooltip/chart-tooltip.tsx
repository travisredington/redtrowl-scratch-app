import type { ReactNode } from 'react';
import './chart-tooltip.css';

interface ChartTooltipProps {
    x: number;
    y: number;
    visible: boolean;
    children: ReactNode;
}

function ChartTooltip({ x, y, visible, children }: ChartTooltipProps) {
    if (!visible) return null;

    return (
        <div className="chart-tooltip" style={{ left: x + 14, top: y + 14 }}>
            {children}
        </div>
    );
}

export default ChartTooltip;
