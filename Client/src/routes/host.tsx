import { rootRoute } from "#/app";
import { HostAwardCeremony } from "#/components/host/award-ceremony";
import { HostCreateGame } from "#/components/host/create-game";
import { HostJoinGame } from "#/components/host/join-game";
import { HostLeaderBoard } from "#/components/host/leaderboard";
import { HostQuestion } from "#/components/host/question";
import { HostQuestionReveal } from "#/components/host/question-reveal";
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
      {hostState === HostStateValue.QuestionReveal && <HostQuestionReveal />}
      {hostState === HostStateValue.Leaderboard && <HostLeaderBoard />}
      {hostState === HostStateValue.AwardCeremony && <HostAwardCeremony />}
    </>
  );
}
