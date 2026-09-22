import { ALL_AXES } from '../../../lib/results-viz/axes';
import type { PersonResult } from '../../../lib/results-viz/types';
import BarStrip, { type BarStripRow } from './bar-strip';
import BeeswarmStrip from './beeswarm-strip';
import './one-variable-panels.css';

export const BAR_MODE_MAX_N = 40;

interface OneVariablePanelsProps {
    data: PersonResult[];
}

function OneVariablePanels({ data }: OneVariablePanelsProps) {
    const useBeeswarm = data.length > BAR_MODE_MAX_N;

    return (
        <div className="one-variable-panels">
            {ALL_AXES.map((axis) => {
                const rows: BarStripRow[] = data.map((person) => ({
                    id: person.id,
                    label: person.name,
                    value: person[axis.key],
                }));

                return (
                    <div className="panel-card" key={axis.key}>
                        <h3>{axis.label}</h3>
                        <div className="chart-mount">
                            {useBeeswarm ? <BeeswarmStrip axis={axis} rows={rows} /> : <BarStrip axis={axis} rows={rows} />}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default OneVariablePanels;
