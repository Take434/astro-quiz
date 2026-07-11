import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

const SessionContext = createContext<Socket | null>(null);
export function SocketSessionProvider({ children }: { children: ReactNode }) {
  const [activeSocket, setActiveSocket] = useState<any | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      withCredentials: true,
      autoConnect: false,
    });

    setActiveSocket(socket);

    socket.on("connect", () => {
      socket.emit("session:get");
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
    <SessionContext.Provider value={activeSocket}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SessionContext);

  if (!ctx) {
    throw new Error("useSession must be used inside SocketSessionProvider");
  }

  return ctx;
}
