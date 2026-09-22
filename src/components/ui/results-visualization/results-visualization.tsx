import { useState } from 'react';
import type { PersonResult, TraitKey } from '../../../lib/results-viz/types';
import OneVariablePanels from '../one-variable-panels/one-variable-panels';
import TwoTraitScatter from '../two-trait-scatter/two-trait-scatter';
import CompassScatter from '../compass-scatter/compass-scatter';
import GroupAveragePanels from '../group-average-panels/group-average-panels';
import ParallelCoordinates from '../parallel-coordinates/parallel-coordinates';
import ResultsDataTable from '../results-data-table/results-data-table';
import './results-visualization.css';

interface ResultsVisualizationProps {
    data: PersonResult[];
}

function ResultsVisualization({ data }: ResultsVisualizationProps) {
    const [scatterX, setScatterX] = useState<TraitKey>('E');
    const [scatterY, setScatterY] = useState<TraitKey>('N');
    const [colorTrait, setColorTrait] = useState<TraitKey>('O');
    const [ringIdentity, setRingIdentity] = useState('');
    const [highlightSelector, setHighlightSelector] = useState('');
    const [tablePage, setTablePage] = useState(0);
    const [tablePageSize, setTablePageSize] = useState<25 | 50>(25);

    if (data.length === 0) {
        return (
            <div className="results-visualization empty-state">
                <p>No respondent data yet — results will appear here once submissions come in.</p>
            </div>
        );
    }

    return (
        <div className="results-visualization">
            <section className="block">
                <div className="block-head">
                    <h2>One variable at a time</h2>
                    <p className="block-desc">
                        The five Big Five traits ranked highest to lowest, plus the two compass axes as diverging bars.
                    </p>
                </div>
                <OneVariablePanels data={data} />
            </section>

            <section className="block">
                <div className="block-head">
                    <h2>Two Big Five traits at once</h2>
                    <p className="block-desc">Pick any two traits to compare.</p>
                </div>
                <TwoTraitScatter
                    data={data}
                    xTrait={scatterX}
                    yTrait={scatterY}
                    onXTraitChange={setScatterX}
                    onYTraitChange={setScatterY}
                />
            </section>

            <section className="block">
                <div className="block-head">
                    <h2>Personality × political compass</h2>
                    <p className="block-desc">
                        Economic left/right on X, Libertarian/Authoritarian on Y, colored by whichever Big Five trait you pick.
                    </p>
                </div>
                <CompassScatter
                    data={data}
                    colorTrait={colorTrait}
                    onColorTraitChange={setColorTrait}
                    ringIdentity={ringIdentity}
                    onRingIdentityChange={setRingIdentity}
                />
            </section>

            <section className="block">
                <div className="block-head">
                    <h2>Group averages by identity</h2>
                    <p className="block-desc">
                        Same seven variables, but each bar is a group average across everyone who shares that identity.
                    </p>
                </div>
                <GroupAveragePanels data={data} />
            </section>

            <section className="block">
                <div className="block-head">
                    <h2>All seven, at once</h2>
                    <p className="block-desc">
                        Parallel coordinates across the five traits plus both compass axes, each keeping its own scale.
                    </p>
                </div>
                <ParallelCoordinates data={data} highlightSelector={highlightSelector} onHighlightSelectorChange={setHighlightSelector} />
            </section>

            <ResultsDataTable
                data={data}
                page={tablePage}
                pageSize={tablePageSize}
                onPageChange={setTablePage}
                onPageSizeChange={setTablePageSize}
            />
        </div>
    );
}

export default ResultsVisualization;
