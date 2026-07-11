import { useHostState, type HostStateValue } from "#/stores/hostState";
import { usePlayerState } from "#/stores/playerState";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

const SessionContext = createContext<SocketSessionState | null>(null);
export function SocketSessionProvider({ children }: { children: ReactNode }) {
  // const [activeSocket, setActiveSocket] = useState<any | null>(null);
  const [socketSession, setSocketSession] = useState<SocketSessionState | null>(
    null,
  );

  const updateHostState = useHostState().setHostState;
  const updatePlayerState = usePlayerState().setPlayerState;

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      withCredentials: true,
      autoConnect: false,
    });

    setSocketSession({ ...socketSession, socket: socket });

    socket.on("connect", () => {});

    socket.on("game:rejoin", (data: SocketSessionGameState) => {
      if (
        confirm(
          "Du bist bereits in einem Spiel, möchtest du beitreten? " + data.id,
        )
      ) {
        socket.emit("game:rejoin", true);
        if (data.isHost) {
          updateHostState(data.state);
        } else {
        }
        setSocketSession({ socket: socket, game: data });
      } else {
        socket.emit("game:rejoin", false);
      }
    });

    socket.on("disconnect", () => {});

    socket.on("game:host", (data: SocketSessionGameState) => {
      setSocketSession({ socket: socket, game: data });
    });

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
