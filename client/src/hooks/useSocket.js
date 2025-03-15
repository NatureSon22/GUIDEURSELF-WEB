import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL;

const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket:", newSocket.id);
      newSocket.emit("join", userId);
    });

    setSocket(newSocket); // Moved inside useEffect

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return socket;
};

export default useSocket;
