import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import StreamingText from './streaming-text';

describe('StreamingText', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        cleanup();
    });

    it('renders no streamed text before starting', () => {
        render(<StreamingText textBlock="Hi" />);

        expect(screen.getByRole('button', { name: 'Start Stream' })).toBeInTheDocument();
        expect(screen.queryByText('Hi')).not.toBeInTheDocument();
    });

    it('reveals the text one character at a time and shows a cursor while streaming', () => {
        render(<StreamingText textBlock="Hi" />);

        act(() => {
            screen.getByRole('button', { name: 'Start Stream' }).click();
        });

        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(screen.getByText('H', { exact: false })).toBeInTheDocument();
        expect(document.querySelector('.cursor')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(screen.getByText('Hi', { exact: false })).toBeInTheDocument();
    });

    it('stops and hides the cursor once the full text has streamed', () => {
        render(<StreamingText textBlock="Hi" />);

        act(() => {
            screen.getByRole('button', { name: 'Start Stream' }).click();
        });

        act(() => {
            // "Hi" takes 2 ticks to render, plus 1 more tick for the
            // component to detect completion and clear the interval.
            vi.advanceTimersByTime(300);
        });
        expect(screen.getByText('Hi', { exact: false })).toBeInTheDocument();
        expect(document.querySelector('.cursor')).not.toBeInTheDocument();

        const textNodeCountBefore = screen.getByText('Hi', { exact: false }).textContent;

        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(screen.getByText('Hi', { exact: false }).textContent).toBe(textNodeCountBefore);
    });

    it('ignores a second click while a stream is already in progress', () => {
        render(<StreamingText textBlock="Hello" />);
        const button = screen.getByRole('button', { name: 'Start Stream' });

        act(() => {
            button.click();
        });
        act(() => {
            vi.advanceTimersByTime(100);
        });
        act(() => {
            button.click();
        });
        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(screen.getByText('He', { exact: false })).toBeInTheDocument();
    });

    it('disables the button while streaming and re-enables it once complete', () => {
        render(<StreamingText textBlock="Hi" />);
        const button = screen.getByRole('button', { name: 'Start Stream' });

        expect(button).not.toBeDisabled();

        act(() => {
            button.click();
        });
        expect(button).toBeDisabled();

        act(() => {
            vi.advanceTimersByTime(300);
        });
        expect(button).not.toBeDisabled();
    });

    it('restarts from scratch when clicked again after completion', () => {
        render(<StreamingText textBlock="Hi" />);
        const button = screen.getByRole('button', { name: 'Start Stream' });

        act(() => {
            button.click();
        });
        act(() => {
            vi.advanceTimersByTime(300);
        });
        expect(screen.getByText('Hi', { exact: false })).toBeInTheDocument();

        act(() => {
            button.click();
        });
        expect(screen.queryByText('Hi')).not.toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(screen.getByText('H', { exact: false })).toBeInTheDocument();
    });
});
