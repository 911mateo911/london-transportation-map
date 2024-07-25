import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { MapPage } from './pages/MapPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MapPage />
    ),
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
