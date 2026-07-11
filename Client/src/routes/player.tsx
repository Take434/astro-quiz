import { rootRoute } from "#/app";
import { PlayerDebug } from "#/components/player/debug";
import { PlayerJoinGame } from "#/components/player/join-game";
import { PlayerStateValue, usePlayerState } from "#/stores/playerState";
import { createRoute } from "@tanstack/react-router";

export const playerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/play",
  component: RouteComponent,
});

function RouteComponent() {
  const playerState = usePlayerState().playerState;

  return (
    <>
      {playerState === PlayerStateValue.JoinGame && <PlayerJoinGame />}
      {playerState === PlayerStateValue.Debug && <PlayerDebug />}
    </>
  );
}
