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
  return await prisma.booking.findMany({
    where: { roomId },
  });
}

async function updateBooking() {}

const bookingRepository = {
  getBooking,
  postBooking,
  getRoomById,
  updateBooking,
};

export default bookingRepository;
