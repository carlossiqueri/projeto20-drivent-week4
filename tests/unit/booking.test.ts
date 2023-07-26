import httpStatus from 'http-status';
import { createEnrollmentWithAddress, createUser, ticketWithTypeFactory } from '../factories';
import bookingRepository from '../../src/repositories/booking-repository/index';
import enrollmentRepository from '../../src/repositories/enrollment-repository/index';
import ticketsRepository from '../../src/repositories/tickets-repository/index';
import bookingService from '../../src/repositories/booking-repository/index';
import roomRepository from '../../src/repositories/room-repository/index';
import userRepository from '../../src/repositories/user-repository/index';
import { newBookingFactory } from '../factories/booking-factory';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it("Should return 404 if enrollment doesn't exists", async () => {
    const userId = 99999;
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(null);
    const testBooking = bookingService.getBooking(userId);

    expect(testBooking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
  it('Should return 404 if user does not have a ticket', async () => {
    const userId = 1;

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(null);

    const testBooking = bookingService.getBooking(userId);
    expect(testBooking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
  it('should return 404 if there is not a booked room for this user', async () => {
    const userId = 1;
    jest.spyOn(bookingRepository, 'getBooking').mockResolvedValueOnce(null);

    const booking = bookingService.getBooking(userId);
    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('post /booking', () => {
  //Error:
  // => roomId não existente: Deve retornar status code 404.
  // => roomId sem vaga: Deve retornar status code 403.
  // => Fora da regra de negócio: Deve retornar status code 403.
  it('Should return 404 if room does not exist', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockResolvedValue(createEnrollmentWithAddress(await createUser()));
    jest.spyOn(roomRepository, 'getRoom').mockResolvedValueOnce(null);

    const booking = bookingService.postBooking(1, 1);
    await expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'Room not found',
    });
  });
  it('Should return 403 if there is no available room', async () => {
    jest.spyOn(userRepository, 'create').mockResolvedValue(await createUser());
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockResolvedValue(createEnrollmentWithAddress(await createUser()));
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValue(ticketWithTypeFactory(true, false, true));
    const mock: any = {
      id: 1,
      userId: 555,
      roomId: 555,
    };

    jest.spyOn(bookingRepository, 'postBooking').mockResolvedValue(mock);

    // Situação de erro  ????  => checkRoom.length > room.capacity (service)
    const booking = bookingService.postBooking(555, 111);
    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Forbidden',
    });
  });
  it('Should return 403 if ticket has not been paid', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockResolvedValue(createEnrollmentWithAddress(await createUser()));
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValue(ticketWithTypeFactory(false, false, true));

    const booking = bookingRepository.postBooking(555, 111);
    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Forbidden',
    });
  });

  it('Should Return 403 if hotel is not included', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockResolvedValue(createEnrollmentWithAddress(await createUser()));
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValue(ticketWithTypeFactory(true, false, false));

    const booking = bookingRepository.postBooking(555, 111);
    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Forbidden',
    });
  });

  it('Should Return 403 if ticket type is remote', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockResolvedValue(createEnrollmentWithAddress(await createUser()));
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValue(ticketWithTypeFactory(true, true, true));

    const booking = bookingRepository.postBooking(555, 111);
    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Forbidden',
    });
  });
});
