import { rootRoute } from "#/App.tsx";
import { PlayerAwardCeremony } from "#/components/player/award-ceremony";
import { PlayerJoinGame } from "#/components/player/join-game";
import { PlayerQuestion } from "#/components/player/question";
import { PlayerWait } from "#/components/player/wait";
import { PlayerStateValue, usePlayerState } from "#/stores/playerState";
import { createRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

export const playerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/play",
  validateSearch: (search: Record<string, unknown>) => {
    return {
      gameId: search.gameId ? search.gameId : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { gameId } = useSearch({ from: playerRoute.id });
  const navigate = useNavigate();
  const playerState = usePlayerState().playerState;

  useEffect(() => {
    if (gameId) {
      navigate({ to: "/play", search: {} });
    }
  }, [gameId, navigate]);

  return (
    <>
      {playerState === PlayerStateValue.JoinGame && (
        <PlayerJoinGame gameId={gameId ?? ""} />
      )}
      {playerState === PlayerStateValue.Question && <PlayerQuestion />}
      {playerState === PlayerStateValue.Wait && <PlayerWait />}
      {playerState === PlayerStateValue.AwardCeremony && (
        <PlayerAwardCeremony />
      )}
    </>
  );
}
