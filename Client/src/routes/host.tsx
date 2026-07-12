import { rootRoute } from "#/app";
import { HostCreateGame } from "#/components/host/create-game";
import { HostJoinGame } from "#/components/host/join-game";
import { HostQuestion } from "#/components/host/question";
import { HostStateValue, useHostState } from "#/stores/hostState";
import { createRoute } from "@tanstack/react-router";

export const hostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/host",
  component: RouteComponent,
});

function RouteComponent() {
  const hostState = useHostState().hostState;

  return (
    <>
      {hostState === HostStateValue.CreateGame && <HostCreateGame />}
      {hostState === HostStateValue.JoinGame && <HostJoinGame />}
      {hostState === HostStateValue.Question && <HostQuestion />}
      {hostState === HostStateValue.QuestionReveal && "QuestionReveal..."}
      {hostState === HostStateValue.Leaderboard && "Leaderboard..."}
      {hostState === HostStateValue.AwardCeremony && "AwardCeremony..."}
    </>
  );
}
