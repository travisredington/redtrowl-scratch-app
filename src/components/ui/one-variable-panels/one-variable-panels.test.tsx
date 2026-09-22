import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { PersonResult } from '../../../lib/results-viz/types';
import OneVariablePanels, { BAR_MODE_MAX_N } from './one-variable-panels';

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
    }));
}

describe('OneVariablePanels', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders a panel per axis with no respondents', () => {
        render(<OneVariablePanels data={[]} />);

        expect(screen.getByText('Openness')).toBeInTheDocument();
        expect(screen.getByText('Economic (Left–Right)')).toBeInTheDocument();
    });

    it('renders bar mode for a single respondent', () => {
        render(<OneVariablePanels data={makePeople(1)} />);

        expect(screen.getByRole('img', { name: /Openness scores by person/ })).toBeInTheDocument();
    });

    it('switches to beeswarm mode once respondents exceed BAR_MODE_MAX_N', () => {
        render(<OneVariablePanels data={makePeople(BAR_MODE_MAX_N + 1)} />);

        expect(screen.getByRole('img', { name: /Openness scores, \d+ respondents/ })).toBeInTheDocument();
    });

    it('stays in bar mode at exactly BAR_MODE_MAX_N respondents', () => {
        render(<OneVariablePanels data={makePeople(BAR_MODE_MAX_N)} />);

        expect(screen.getByRole('img', { name: /Openness scores by person/ })).toBeInTheDocument();
    });
});
