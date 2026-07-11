import { rootRoute } from "#/app";
import { createRoute } from "@tanstack/react-router";
import { useState } from "react";

export const clientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client",
  component: RouteComponent,
});

function RouteComponent() {
  const [test, useTest] = useState("test");
  return <div>Hello "/client"! {test}</div>;
}
