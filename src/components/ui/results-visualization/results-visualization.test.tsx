import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { PersonResult } from '../../../lib/results-viz/types';
import { BAR_MODE_MAX_N } from '../one-variable-panels/one-variable-panels';
import ResultsVisualization from './results-visualization';

function makePeople(count: number): PersonResult[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `person-${i}`,
        name: `Person ${i}`,
        O: (i * 7) % 101,
        C: (i * 11) % 101,
        E: (i * 13) % 101,
        A: (i * 17) % 101,
        N: (i * 19) % 101,
        econ: ((i * 3) % 21) - 10,
        soc: ((i * 5) % 21) - 10,
        identity: i % 2 === 0 ? 'Group A' : 'Group B',
    }));
}

describe('ResultsVisualization', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders an empty state with no respondents', () => {
        render(<ResultsVisualization data={[]} />);

        expect(screen.getByText(/No respondent data yet/)).toBeInTheDocument();
        expect(screen.queryByText('One variable at a time')).not.toBeInTheDocument();
    });

    it('renders every view for a single respondent', () => {
        render(<ResultsVisualization data={makePeople(1)} />);

        expect(screen.getByText('One variable at a time')).toBeInTheDocument();
        expect(screen.getByText('Two Big Five traits at once')).toBeInTheDocument();
        expect(screen.getByText('Personality × political compass')).toBeInTheDocument();
        expect(screen.getByText('Group averages by identity')).toBeInTheDocument();
        expect(screen.getByText('All seven, at once')).toBeInTheDocument();
        expect(screen.getByText('Show the underlying data as a table')).toBeInTheDocument();
    });

    it('switches the one-variable panels to beeswarm mode past BAR_MODE_MAX_N', () => {
        render(<ResultsVisualization data={makePeople(BAR_MODE_MAX_N + 1)} />);

        expect(screen.getByRole('img', { name: /Openness scores, \d+ respondents/ })).toBeInTheDocument();
    });

    it('does not pre-select a parallel-coordinates highlight on load', () => {
        render(<ResultsVisualization data={makePeople(3)} />);

        expect(screen.getByRole('combobox', { name: 'Highlight' })).toHaveValue('');
    });
});
