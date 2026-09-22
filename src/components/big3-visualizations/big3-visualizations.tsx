import ResultsVisualization from '../ui/results-visualization/results-visualization';
import type { PersonResult } from '../../lib/results-viz/types';

// Invented sample data, independent of one another (no correlation intended) — swap for real results.
const sampleData: PersonResult[] = [
    { id: 'p1', name: 'Person 1', O: 72, C: 55, E: 40, A: 61, N: 35, econ: -4, soc: 5, identity: 'Heterosexual' },
    { id: 'p2', name: 'Person 2', O: 48, C: 80, E: 30, A: 70, N: 25, econ: 5, soc: 6, identity: 'Gay' },
    { id: 'p3', name: 'Person 3', O: 85, C: 45, E: 75, A: 50, N: 60, econ: -7, soc: -6, identity: 'Bisexual' },
    { id: 'p4', name: 'Person 4', O: 33, C: 65, E: 55, A: 40, N: 70, econ: 6, soc: 4, identity: 'Heterosexual' },
    { id: 'p5', name: 'Person 5', O: 60, C: 70, E: 65, A: 80, N: 20, econ: 3, soc: -4, identity: 'Lesbian' },
    { id: 'p6', name: 'Person 6', O: 55, C: 50, E: 20, A: 45, N: 85, econ: -2, soc: 5, identity: 'Heterosexual' },
    { id: 'p7', name: 'Person 7', O: 78, C: 60, E: 85, A: 65, N: 30, econ: -6, soc: -7, identity: 'Bisexual' },
    { id: 'p8', name: 'Person 8', O: 40, C: 35, E: 45, A: 55, N: 50, econ: 1, soc: -1, identity: 'Asexual' },
    { id: 'p9', name: 'Person 9', O: 90, C: 75, E: 50, A: 30, N: 40, econ: -8, soc: -8, identity: 'Gay' },
    { id: 'p10', name: 'Person 10', O: 25, C: 85, E: 60, A: 75, N: 15, econ: 7, soc: 2, identity: 'Heterosexual' },
];

function Big3Visualizations() {
    return <ResultsVisualization data={sampleData} />;
}

export default Big3Visualizations;
