import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "./room.service";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
})
export class DrawingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private roomService: RoomService) {}

  async handleConnection(client: Socket) {
    console.log("Client connected:", client.id);
    const room = this.roomService.assignRoom(client.id);
    client.join(room);
    client.emit("roomJoined", room);
  }

  async handleDisconnect(client: Socket) {
    this.roomService.leaveRoom(client.id);
    console.log("Client disconnected:", client.id);
  }

  @SubscribeMessage("draw")
  handleDraw(
    @MessageBody() data: { room: string; drawingData: any },
    // @ConnectedSocket() client: Socket,
  ) {
    this.server.to(data.room).emit("draw", data.drawingData);
  }

  @SubscribeMessage("leaveRoom")
  handleLeaveRoom(@ConnectedSocket() client: Socket) {
    this.roomService.leaveRoom(client.id);
    client.disconnect();
  }
}
