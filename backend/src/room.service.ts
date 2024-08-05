import { Injectable } from "@nestjs/common";

@Injectable()
export class RoomService {
  private rooms: Map<string, Set<string>> = new Map();
  private userRooms: Map<string, string> = new Map();

  assignRoom(userId: string): string {
    let assignedRoom: string | null = null;
    for (const [room, users] of this.rooms.entries()) {
      if (users.size < 4) {
        users.add(userId);
        assignedRoom = room;
        break;
      }
    }

    if (!assignedRoom) {
      assignedRoom = `room-${this.rooms.size + 1}`;
      this.rooms.set(assignedRoom, new Set([userId]));
    }

    this.userRooms.set(userId, assignedRoom);
    return assignedRoom;
  }

  leaveRoom(userId: string) {
    const room = this.userRooms.get(userId);
    if (room) {
      const users = this.rooms.get(room);
      if (users) {
        users.delete(userId);
        if (users.size === 0) {
          this.rooms.delete(room);
        }
      }
      this.userRooms.delete(userId);
    }
  }
}
