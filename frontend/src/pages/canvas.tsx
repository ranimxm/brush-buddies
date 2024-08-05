import { useRef, useState, useEffect, MouseEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@mui/material";
import { pages } from "../util/pages";
import { useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";

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
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("draw", (data: Stroke[]) => {
      redrawCanvas(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const parentWidth = parent.clientWidth;
      const aspectRatio = 4 / 3;

      canvas.width = parentWidth;
      canvas.height = parentWidth / aspectRatio;

      redrawCanvas(actions);
    };

    setCanvasSize();

    window.addEventListener("resize", setCanvasSize);
    return () => window.removeEventListener("resize", setCanvasSize);
  }, [actions]);

  const startDrawing = (
    e: MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    const { offsetX, offsetY } = getEventPosition(e);
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

  const draw = (
    e: MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    if (!isDrawing) return;

    const { offsetX, offsetY } = getEventPosition(e);
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

    if (!socket) return null;
    socket.emit("draw", actions);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.closePath();
  };

  const getEventPosition = (
    e: MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    if (e.type.startsWith("touch")) {
      const touch = (e as React.TouchEvent<HTMLCanvasElement>).touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { offsetX: 0, offsetY: 0 };
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      };
    } else {
      return {
        offsetX: (e as MouseEvent<HTMLCanvasElement>).nativeEvent.offsetX,
        offsetY: (e as MouseEvent<HTMLCanvasElement>).nativeEvent.offsetY,
      };
    }
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
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          style={{ touchAction: "pinch-zoom" }}
          className="w-full border border-gray-300 rounded shadow-lg mx-auto my-4"
        />
      </div>
    </>
  );
};
