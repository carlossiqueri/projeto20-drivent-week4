import { prisma } from '../../config';

async function getRoom(id: number) {
  return await prisma.room.findFirst({
    where: { id },
  });
}

const roomRepository = {
  getRoom,
};

export default roomRepository;
