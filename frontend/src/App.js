import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login';
import Home from './components/Home';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import Unauthorized from './components/Unauthorized';

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element : <Login/>
    },
    {
      path: "/home",
      element:<Home/>
    },
    {
      path: "/terms",
      element:<Terms/>
    },
    {
      path: "/privacy",
      element:<Privacy/>
    },
    {
      path: "/unauthorized",
      element:<Unauthorized/>
    }
  ])

  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  )
}
export default App; 