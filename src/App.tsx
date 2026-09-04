import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/Root';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import ComponentsPage from './pages/Components';

function App() {

   const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage />, handle: { title: 'Welcome' } },
        { path: '/components', element: <ComponentsPage />, handle: { title: 'Components' } }
      ]
    }
  ]);

  return (
    <RouterProvider router={router}/>
  )
}

export default App
