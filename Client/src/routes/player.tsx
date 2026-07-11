import { rootRoute } from "#/app";
import { createRoute } from "@tanstack/react-router";
import { useState } from "react";

export const playerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client",
  component: RouteComponent,
});

function RouteComponent() {
  const [test, useTest] = useState("test");
  return <div>Hello "/player"! {test}</div>;
}
