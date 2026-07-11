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

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      withCredentials: true,
      autoConnect: false,
    });

    setSocketSession({ ...socketSession, socket: socket });

    socket.on("connect", () => {});

    socket.on("game:rejoin", (data: any) => {
      if (
        confirm(
          "Du bist bereits in einem Spiel, möchtest du beitreten? " +
            data.gameId,
        )
      ) {
        socket.emit("game:rejoin", true);
        setSocketSession({ ...socketSession!, gameId: data.gameId });
      } else {
        socket.emit("game:rejoin", false);
      }
    });

    socket.on("disconnect", () => {});

    socket.on("player:joined", (data: any) => {
      console.log(data);
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
  gameId?: number;
};
