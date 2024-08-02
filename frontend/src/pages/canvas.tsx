import { useRef, useState, useEffect, MouseEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@mui/material";
import { pages } from "../util/pages";
import { useNavigate } from "react-router-dom";

type Point = {
  x: number;
  y: number;
};

type Stroke = {
  type: "stroke";
  points: Point[];
};

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [actions, setActions] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (event: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);
    setRedoStack([]);
    setActions((prev) => [
      ...prev,
      { type: "stroke", points: [{ x: offsetX, y: offsetY }] },
    ]);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    setActions((prev) => {
      const lastAction = { ...prev[prev.length - 1] };
      lastAction.points = [...lastAction.points, { x: offsetX, y: offsetY }];
      return [...prev.slice(0, -1), lastAction];
    });
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.closePath();
  };

  const undo = () => {
    if (actions.length === 0) return;

    const newActions = actions.slice(0, -1);
    setRedoStack([actions[actions.length - 1], ...redoStack]);
    setActions(newActions);
    redrawCanvas(newActions);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const [restoredAction, ...rest] = redoStack;
    setActions([...actions, restoredAction]);
    setRedoStack(rest);
    redrawCanvas([...actions, restoredAction]);
  };

  const redrawCanvas = (actionsToDraw: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    actionsToDraw.forEach((action) => {
      if (action.type === "stroke") {
        ctx.beginPath();
        ctx.moveTo(action.points[0].x, action.points[0].y);
        action.points.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        ctx.closePath();
      }
    });
  };

  const logOut = (e: { preventDefault: () => void }) => {
    e.preventDefault;
    navigate({ pathname: pages.LOGIN });
  };

  return (
    <>
      <Helmet>
        <title>Canvas</title>
      </Helmet>
      <div className="relative h-full w-full">
        <div className="absolute top-0 left-0 p-4 ">
          <Button
            variant="contained"
            color="primary"
            onClick={logOut}
            style={{ color: "white" }}
          >
            Log out
          </Button>
        </div>
        <div className="absolute top-0 right-0 p-4 flex flex-col space-y-4">
          <Button
            variant="contained"
            color="primary"
            onClick={undo}
            style={{ color: "white" }}
          >
            Undo
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={redo}
            style={{ color: "white" }}
          >
            Redo
          </Button>
        </div>
        <canvas
          ref={canvasRef}
          width="800"
          height="600"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="border border-gray-300 rounded shadow-lg mx-auto my-4"
        />
      </div>
    </>
  );
};
