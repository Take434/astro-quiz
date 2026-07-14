import { HostStateValue, useHostState } from "#/stores/hostState";
import { PlayerStateValue, usePlayerState } from "#/stores/playerState";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useQuestionState } from "#/stores/questionState";
import { registerPlayerStateChange } from "./registerPlayerHandler";
import {
  registerHostStateChange,
  registerPlayers,
} from "./registerHostHandler";
import { toast } from "react-toastify";

const SessionContext = createContext<SocketSessionState | null>(null);
export function SocketSessionProvider({ children }: { children: ReactNode }) {
  const [socketSession, setSocketSession] = useState<SocketSessionState | null>(
    null,
  );

  const {
    setHostState: updateHostState,
    setPlayers: updatePlayers,
    setTimer: updateTimer,
  } = useHostState();
  const playerState = usePlayerState();
  const updateQuestionState = useQuestionState().setQuestionState;

  useEffect(() => {
    const socket = io("/", {
      path: "/api/socket.io",
      withCredentials: true,
      autoConnect: false,
    });

    setSocketSession({ ...socketSession, socket: socket });

    socket.on("connect", () => {});

    socket.on("error", (message: string) => {
      toast.warn(message);
    });

    socket.on("player:rejoin", (data: SocketSessionGameState) => {
      const url = data.isHost ? "host:rejoin" : "player:rejoin";
      if (
        confirm(
          "Du bist bereits in einem Spiel, möchtest du beitreten? " + data.id,
        )
      ) {
        socket.emit(url, true);
      } else {
        socket.emit(url, false);
      }
    });

    socket.on("disconnect", () => {});

    socket.on("game:host", (data: SocketSessionGameState) => {
      setSocketSession({ socket: socket, game: data });
    });

    socket.on("game:ended", () => {
      updateHostState(HostStateValue.CreateGame);
      playerState.setPlayerState(PlayerStateValue.JoinGame);
      updatePlayers([]);
    });

    registerPlayerStateChange(
      socket,
      updateQuestionState,
      playerState.setPlayerState,
      playerState.setPlayerAwardState,
    );
    registerHostStateChange(
      socket,
      updateQuestionState,
      updateHostState,
      updatePlayers,
      updateTimer,
    );
    registerPlayers(socket, updatePlayers);

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SessionContext.Provider value={socketSession}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSocketSession() {
  const ctx = useContext(SessionContext);

  if (!ctx) {
    throw new Error("useSession must be used inside SocketSessionProvider");
  }

  return ctx;
}

type SocketSessionState = {
  socket: Socket;
  game?: SocketSessionGameState;
};

type SocketSessionGameState = {
  id: number;
  isHost: boolean;
  state: HostStateValue;
};
