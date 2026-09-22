interface ColorLegendProps {
    lowLabel: string;
    highLabel: string;
}

function ColorLegend({ lowLabel, highLabel }: ColorLegendProps) {
    return (
        <div className="grad-legend">
            <span>{lowLabel}</span>
            <span className="grad-bar" />
            <span>{highLabel}</span>
        </div>
    );
}

export default ColorLegend;
