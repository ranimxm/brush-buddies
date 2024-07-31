import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { Person } from "./person";
import { PersonData } from "../type/person";

type OnLoading = {
  onComplete: () => void;
  people: PersonData[];
};

export const Loading = ({ onComplete, people }: OnLoading) => {
  const [progress, setProgress] = useState(10);
  const [shrink, setShrink] = useState(false);
  const [showRoom, setShowRoom] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          if (prevProgress === 50) {
            setShrink(true);
            setShowRoom(true);
          }
          return prevProgress + 10;
        } else {
          clearInterval(timer);
          return 100;
        }
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`relative h-[100vh] w-full flex ${shrink ? "justify-start" : "justify-center"} transition-all duration-500 px-8 py-4 items-center`}
    >
      <CircularProgress
        variant="determinate"
        value={progress}
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
