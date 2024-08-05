import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect, useRef } from "react";
import { Person } from "./person";
import { PersonData } from "../type/person";
import io, { Socket } from "socket.io-client";

type OnLoading = {
  onComplete: () => void;
  people: PersonData[];
};

export const Loading = ({ onComplete, people }: OnLoading) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      setIsConnecting(false);
      setIsConnected(true);
    });

    newSocket.on("roomJoined", (roomId: string) => {
      console.log(`Joined room: ${roomId}`);
      setIsRoomJoined(true);
      setShrink(true);
      setShowRoom(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isRoomJoined && socketRef.current) {
      socketRef.current.emit("joinRoom");
      setTimeout(onComplete, 1000);
    }
  }, [isRoomJoined, onComplete]);

  return (
    <div
      className={`relative h-[100vh] w-full flex ${shrink ? "justify-start" : "justify-center"} transition-all duration-500 px-8 py-4 items-center`}
    >
      <CircularProgress
        variant="determinate"
        value={isConnecting ? 10 : isConnected ? 70 : isRoomJoined ? 100 : 0}
        style={{
          position: "absolute",
          top: shrink ? "auto" : "40%",
          bottom: shrink ? "1rem" : "auto",
          left: shrink ? "48.6%" : "45%",
          width: shrink ? "3em" : "10em",
          height: shrink ? "3em" : "10em",
          transition: "all 0.5s ease",
        }}
      />
      {showRoom && (
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {people.map((person) => (
              <Person key={person.id} person={person} />
            ))}
          </div>
          <h2 className="mt-4 text-lg">Room available!</h2>
        </div>
      )}
    </div>
  );
};
