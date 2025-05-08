import { RouterProvider } from 'react-router-dom'
import './App.css'
import { UserProvider } from './conponent/context/UserContext'
import { router } from './conponent/Router'

function App() {

  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  )
}
export default App
