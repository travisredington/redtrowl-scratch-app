import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Big3Visualizations from './big3-visualizations';

describe('Big3Visualizations', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the results visualization with sample data', () => {
        render(<Big3Visualizations />);

        expect(screen.getByText('One variable at a time')).toBeInTheDocument();
        expect(screen.getByText('Show the underlying data as a table')).toBeInTheDocument();
    });
});
