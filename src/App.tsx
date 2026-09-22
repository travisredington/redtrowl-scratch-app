import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/Root';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import ComponentsPage from './pages/Components';
import Big3Page from './pages/Big3';

function App() {

   const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage />, handle: { title: 'Welcome' } },
        { path: '/components', element: <ComponentsPage />, handle: { title: 'Components' } },
        { path: '/big3', element: <Big3Page />, handle: { title: 'The Big 3' } }
      ]
    }
  ]);

  return (
    <RouterProvider router={router}/>
  )
}

export default App
