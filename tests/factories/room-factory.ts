import faker from "@faker-js/faker";
import { Room } from "@prisma/client";

export function createFakeRoom (roomId: number, capacity: number){
    const fakeRoom: Room = {
        id: roomId,
        name: faker.datatype.number().toString(),
        capacity,
        hotelId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return fakeRoom;
}