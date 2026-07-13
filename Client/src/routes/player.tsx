import { rootRoute } from "#/app";
import { PlayerAwardCeremony } from "#/components/player/award-ceremony";
import { PlayerJoinGame } from "#/components/player/join-game";
import { PlayerQuestion } from "#/components/player/question";
import { PlayerWait } from "#/components/player/wait";
import { PlayerStateValue, usePlayerState } from "#/stores/playerState";
import { createRoute, useParams } from "@tanstack/react-router";

export const playerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/play",
  component: RouteComponent,
});

export const playerGameRoute = createRoute({
  getParentRoute: () => playerRoute,
  path: "/$gameId",
  component: RouteComponent,
});

function RouteComponent() {
  const { gameId } = useParams({ from: playerGameRoute.id });
  const playerState = usePlayerState().playerState;

  return (
    <>
      {playerState === PlayerStateValue.JoinGame && (
        <PlayerJoinGame gameId={gameId} />
      )}
      {playerState === PlayerStateValue.Question && <PlayerQuestion />}
      {playerState === PlayerStateValue.Wait && <PlayerWait />}
      {playerState === PlayerStateValue.AwardCeremony && (
        <PlayerAwardCeremony />
      )}
    </>
  );
}
