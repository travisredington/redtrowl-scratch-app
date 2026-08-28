import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Header from './header';

function renderAtRoute(handle?: { title?: string }) {
    const router = createMemoryRouter(
        [
            {
                path: '/',
                element: <Header />,
                handle,
            },
        ],
        { initialEntries: ['/'] }
    );

    return render(<RouterProvider router={router} />);
}

describe('Header', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the title from the matched route\'s handle', () => {
        renderAtRoute({ title: 'Test Page' });

        expect(screen.getByRole('heading', { name: /Test Page/ })).toBeInTheDocument();
    });

    it('renders no page-title section when the route has no handle title', () => {
        renderAtRoute();

        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('always renders the nav Home link regardless of the title', () => {
        renderAtRoute();

        expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    });
});
