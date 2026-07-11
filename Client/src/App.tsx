import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { clientRoute } from "./routes/client";
import { Home } from "./home";
import { hostRoute } from "./routes/host";

export const rootRoute = createRootRoute({
  component: () => (
    <div className="h-full">
      <Outlet></Outlet>
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const routeTree = rootRoute.addChildren([homeRoute, clientRoute, hostRoute]);

export const router = createRouter({
  routeTree,
});

function InnerApp() {
  return <RouterProvider router={router} />;
}

export function App() {
  return <InnerApp></InnerApp>;
}
