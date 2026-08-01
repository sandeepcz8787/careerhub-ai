import { RouterProvider } from 'react-router-dom';
import { Providers } from './Providers';
import { router } from './router';

/**
 * Root application component.
 * Keeps concerns separated: Providers handles state, RouterProvider handles routing.
 */
export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
