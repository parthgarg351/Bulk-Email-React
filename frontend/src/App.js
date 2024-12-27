import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login';
import Body from './components/Body';

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element : <Login/>
    },
    {
      path: "/body",
      element : <Body/>
    }
  ])

  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  )
}
export default App;