import { forbiddenError, notFoundError } from '../../errors';
import bookingRepository from '../../repositories/booking-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import roomRepository from '../../repositories/room-repository';
import ticketsRepository from '../../repositories/tickets-repository';

async function getBooking(userId: number) {
  // se o usuário:
  // Não existe (inscrição, ticket ou reserva): 404 (not found)
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const booking = bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const ticketType = await ticketsRepository.findTickeWithTypeById(ticket.ticketTypeId);
  if (
    ticketType?.TicketType.isRemote === true ||
    ticketType?.TicketType.includesHotel === false ||
    ticketType?.status === 'RESERVED'
  )
    throw forbiddenError();

  const room = await roomRepository.getRoom(roomId);
  if (!room) throw notFoundError();

  const checkRoom = await bookingRepository.getRoomById(roomId);
  if (checkRoom.length >= room.capacity) throw forbiddenError();

  const newBooking = await bookingRepository.postBooking(userId, roomId);

  return {
    bookingId: newBooking.id,
  };
}

async function updateBooking(bookingId: number, userId: number, roomId: number) {

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const room = await roomRepository.getRoom(roomId);
  if (!room) throw notFoundError();

  const checkRoom = await bookingRepository.getRoomById(roomId);
  if (checkRoom.length >= room.capacity) throw forbiddenError();

  const updatedBooking = await bookingRepository.updateBooking(bookingId, userId, roomId);

  return updatedBooking;
}

const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};

export default bookingService;
