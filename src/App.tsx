import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/Root';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';

function App() {

   const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        // { path: '/streaming', element: <StreamingPage /> }
      ]
    }
  ]);

  return (
    <RouterProvider router={router}/>
  )
}

export default App
