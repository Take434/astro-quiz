import { rootRoute } from "#/App";
import { createRoute } from "@tanstack/react-router";

export const hostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/host",
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/host"!</div>;
}
