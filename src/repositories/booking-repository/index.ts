import { prisma } from '../../config';

async function getBooking(userId: number) {
  return await prisma.booking.findFirst({
    select: { id: true, Room: true },
    where: { userId },
  });
}

async function postBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: { userId, roomId },
  });
}

async function getRoomById(roomId: number) {
  const room =  await prisma.booking.findMany({
    where: { roomId },
  });
  return room;
}

async function updateBooking(bookingId: number, userId: number, roomId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

const bookingRepository = {
  getBooking,
  postBooking,
  getRoomById,
  updateBooking,
};

export default bookingRepository;
