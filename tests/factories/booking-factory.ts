import faker from '@faker-js/faker';
import { prisma } from '../../src/config';
import { Booking } from '@prisma/client';

export async function newBookingFactory(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}

export function createFakeBooking(bookingId: number, userId: number, roomId: number){
  const fakeBooking: Booking[] = [
    {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return fakeBooking;
}