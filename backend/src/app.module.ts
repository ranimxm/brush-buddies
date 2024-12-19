import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { DrawingGateway } from "./drawing.gateway";

@Module({
  providers: [DrawingGateway, RoomService],
})
export class AppModule {}
