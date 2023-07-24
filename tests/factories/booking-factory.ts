import faker from "@faker-js/faker";
import { prisma } from "../config";

export async function newBookingFactory(userId: number, roomId: number){
    return prisma.booking.create({
        data: {
            userId,
            roomId,
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent()
        }
    })
}