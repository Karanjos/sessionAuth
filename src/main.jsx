import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import Users from "./pages/Users.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "./components/Loader.jsx";
import PageNotFound from "./components/PageNotFound.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      <Route path="" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<PrivateRoute />}>
        <Route path="/users" element={<Users />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <PersistGate loading={<Loader />} persistor={persistor}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </PersistGate>
);
