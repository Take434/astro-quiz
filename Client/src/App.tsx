import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { playerGameRoute, playerRoute } from "./routes/player";
import { hostRoute } from "./routes/host";
import { SocketSessionProvider } from "./socket/SocketSessionProvider";
import { Home } from "./home";

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

const routeTree = rootRoute.addChildren([
  homeRoute,
  playerRoute,
  hostRoute,
  playerGameRoute,
]);

export const router = createRouter({
  routeTree,
});

function InnerApp() {
  return (
    <SocketSessionProvider>
      <RouterProvider router={router} />
    </SocketSessionProvider>
  );
}

export function App() {
  return <InnerApp></InnerApp>;
}
