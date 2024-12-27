import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login';
import Body from './components/Body';
import Home from './components/Home';
import Terms from './components/Terms';
import Privacy from './components/Privacy';

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element : <Login/>
    },
    // {
    //   path: "/body",
    //   element : <Body/>
    // },
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
    }
  ])

  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  )
}
export default App; 