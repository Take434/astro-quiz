import { useHostState } from "#/stores/hostState";
import { usePlayerState } from "#/stores/playerState";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useQuestionState } from "#/stores/questionState";
import { registerDefaultHandler } from "./registerDefaultHandler";

const SessionContext = createContext<SocketSessionState | null>(null);
export function SocketSessionProvider({ children }: { children: ReactNode }) {
  const [socketSession, setSocketSession] = useState<SocketSessionState | null>(
    null,
  );

  const hostState = useHostState();
  const playerState = usePlayerState();
  const questionState = useQuestionState();

  useEffect(() => {
    const socket = io("/", {
      path: "/api/socket.io",
      withCredentials: true,
      autoConnect: false,
    });
    setSocketSession({ socket });
    registerDefaultHandler(socket, questionState, hostState, playerState);
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
};
