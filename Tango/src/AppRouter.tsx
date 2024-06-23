import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { App } from "./App";
import { Home } from "./components/Home";
//import { Api } from "./components/Api";
import { Result } from "./components/Result";
import { LookingBack } from "./components/LookingBack";
import { LookingBackResult } from "./components/LookingBackResult";
import { Tests } from "./components/Tests";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/Home" element={<Home />} />
      <Route path="/LookingBack" element={<LookingBack />} />
      <Route path="/Result" element={<Result />} />
      <Route path="/LookingBackResult" element={<LookingBackResult />} />
      <Route path="/Tests" element={<Tests />} />
    </Route>
  )
);

export const AppRouter = () => <RouterProvider router={router} />;
