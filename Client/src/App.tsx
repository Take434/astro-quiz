import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { clientRoute } from "./routes/client";
import { Home } from "./Home";
import { hostRoute } from "./routes/host";

export const rootRoute = createRootRoute({
  component: () => (
    <div className="h-full">
      <Outlet></Outlet>
    </div>
  ),
});

// routes for individual pages should be declared within their respective directory
// this is placeholder and will be deleted later
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const routeTree = rootRoute.addChildren([homeRoute, clientRoute, hostRoute]);

export const router = createRouter({
  routeTree,
  context: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!,
  },
});

function InnerApp() {
  // const auth = useAuth();
  return <RouterProvider router={router} />;
}

export function App() {
  return <InnerApp></InnerApp>;
}
