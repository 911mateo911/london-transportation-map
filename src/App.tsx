import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import { MapPage } from "./pages/MapPage";

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
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </>
  )
}

export default App;
