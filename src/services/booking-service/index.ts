import { forbiddenError, notFoundError } from '../../errors';
import bookingRepository from '../../repositories/booking-repository';
import enrollmentRepository from '../../repositories/enrollment-repository/index';
import roomRepository from '../../repositories/room-repository';
import ticketsRepository from '../../repositories/tickets-repository';

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const ticketType = await ticketsRepository.findTickeWithTypeById(ticket.ticketTypeId);

  if(ticketType?.TicketType.isRemote === true || ticketType.TicketType.isRemote === null || ticketType.TicketType.isRemote === undefined) throw forbiddenError();
  if(ticketType?.TicketType.includesHotel === false || ticketType.TicketType.isRemote === null || ticketType.TicketType.isRemote === undefined) throw forbiddenError();
  if(ticketType.status ===  'RESERVED' || ticketType.status === null || ticketType.status === undefined) throw forbiddenError();
 
  const room = await roomRepository.getRoom(roomId);
  if (!room) throw notFoundError();

  const checkRoom = await bookingRepository.getRoomById(roomId);
  if (checkRoom.length >= room.capacity) throw forbiddenError();
  console.log('check room check')
  const newBooking = await bookingRepository.postBooking(userId, roomId);
  console.log('newBooking check')
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
