import { notFoundError } from '../../errors';
import bookingRepository from '../../repositories/booking-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
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
}

async function postBooking() {}

async function updateBooking() {}

const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};

export default bookingService;
