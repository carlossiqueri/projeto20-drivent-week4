import { prisma } from '../../config';

async function getRoom(id: number) {
  console.log('Fetching room with id:', id);
  const room = await prisma.room.findFirst({
    where: { id },
  });
  console.log('Fetched room:', room);
  return room;
}
const roomRepository = {
  getRoom,
};

export default roomRepository;
