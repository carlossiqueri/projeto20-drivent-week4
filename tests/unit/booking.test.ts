import httpStatus from 'http-status';
import {
  createEnrollmentWithAddress,
  createFakeEnrollment,
  createFakeTicket,
  createUser,
  ticketWithTypeFactory,
} from '../factories';
import bookingRepository from '../../src/repositories/booking-repository/index';
import enrollmentRepository from '../../src/repositories/enrollment-repository/index';
import ticketsRepository from '../../src/repositories/tickets-repository/index';
import bookingService from '../../src/repositories/booking-repository/index';
import roomRepository from '../../src/repositories/room-repository/index';
import userRepository from '../../src/repositories/user-repository/index';
import faker from '@faker-js/faker';
import { notFoundError } from '../../src/errors/not-found-error';
import { forbiddenError } from '../../src/errors/forbidden-error';

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

describe('POST /booking', () => {
  it('Should return 404 if user does not have an enrollment', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });

    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(null);

    const promise = bookingService.postBooking(userId, roomId);

    await expect(promise).rejects.toEqual(notFoundError());
  });
  it('Should return 404 if user does not have a ticket', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });
    const fakeEnrollment = createFakeEnrollment();

    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(fakeEnrollment);

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(null);

    const promise = bookingService.postBooking(userId, roomId);

    await expect(promise).rejects.toEqual(notFoundError());
  });
  it('Should return 403 if ticket type does not includes hotel', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });
    const fakeEnrollment = createFakeEnrollment();
    const ticketStatus = 'PAID';
    const ticketIsRemote = false;
    const ticketIncludesHotel = false;
    const fakeTicket: any = createFakeTicket(ticketStatus, ticketIsRemote, ticketIncludesHotel);

    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(fakeEnrollment);

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(fakeTicket);

    const ticketTypeMock = jest.spyOn(ticketsRepository, 'findTickeWithTypeById');
    ticketTypeMock.mockResolvedValueOnce(fakeTicket);

    const promise = bookingService.postBooking(userId, roomId);
    expect(promise).rejects.toEqual(forbiddenError());
  });
  it('Should return 403 if ticket type is remote', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });
    const fakeEnrollment = createFakeEnrollment();
    const ticketStatus = 'PAID';
    const ticketIsRemote = true;
    const ticketIncludesHotel = true;
    const fakeTicket: any = createFakeTicket(ticketStatus, ticketIsRemote, ticketIncludesHotel);

    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(fakeEnrollment);

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(fakeTicket);

    const ticketTypeMock = jest.spyOn(ticketsRepository, 'findTickeWithTypeById');
    ticketTypeMock.mockResolvedValueOnce(fakeTicket);

    const promise = bookingService.postBooking(userId, roomId);
    expect(promise).rejects.toEqual(forbiddenError());
  });
  it('Should return 403 if ticket has not been paid', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });
    const fakeEnrollment = createFakeEnrollment();
    const ticketStatus = 'RESERVED';
    const ticketIsRemote = true;
    const ticketIncludesHotel = true;
    const fakeTicket: any = createFakeTicket(ticketStatus, ticketIsRemote, ticketIncludesHotel);

    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(fakeEnrollment);

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(fakeTicket);

    const ticketTypeMock = jest.spyOn(ticketsRepository, 'findTickeWithTypeById');
    ticketTypeMock.mockResolvedValueOnce(fakeTicket);

    const promise = bookingService.postBooking(userId, roomId);
    expect(promise).rejects.toEqual(forbiddenError());
  });
  it('Should return 404 if room does not exist', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });
    const fakeEnrollment = createFakeEnrollment();
    const ticketStatus = 'PAID';
    const ticketIsRemote = false;
    const ticketIncludesHotel = true;
    const fakeTicket: any = createFakeTicket(ticketStatus, ticketIsRemote, ticketIncludesHotel);

    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(fakeEnrollment);
    console.log(fakeEnrollment);

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(fakeTicket);
    console.log(fakeTicket);

    const ticketTypeMock = jest.spyOn(ticketsRepository, 'findTickeWithTypeById');
    ticketTypeMock.mockResolvedValueOnce(fakeTicket);

    const roomMock = jest.spyOn(roomRepository, 'getRoom');
    roomMock.mockResolvedValueOnce(null);

    const promise = bookingService.postBooking(userId, roomId);

    await expect(promise).rejects.toEqual(notFoundError());
  });

  it('Should return 403 if there is no available room', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });
    const fakeEnrollment = createFakeEnrollment();
    const ticketStatus = 'PAID';
    const ticketIsRemote = false;
    const ticketIncludesHotel = true;
    const fakeTicket: any = createFakeTicket(ticketStatus, ticketIsRemote, ticketIncludesHotel);
  });
});
