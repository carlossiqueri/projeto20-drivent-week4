import enrollmentRepository from '../../src/repositories/enrollment-repository/index';
import ticketsRepository from '../../src/repositories/tickets-repository/index';
import bookingService from '../../src/services/booking-service/index';
import bookingRepository from '../../src/repositories/booking-repository/index';
import roomRepository from '../../src/repositories/room-repository/index';
import faker, { Faker } from '@faker-js/faker';
import { forbiddenError, notFoundError } from '@/errors';
import { createFakeEnrollment, createFakeTicket } from '../factories';
import { createFakeBooking } from '../factories/booking-factory';
import { createFakeRoom } from '../factories/room-factory';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it("Should return 404 if enrollment doesn't exists", async () => {
    const userId = faker.datatype.number({ min: 1 });
    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(null);

    await expect(bookingService.getBooking(userId)).rejects.toEqual(notFoundError());
  });
  it('Should return 404 if user does not have a ticket', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const fakeEnrollment = createFakeEnrollment();

    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(fakeEnrollment);

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(null);

    await expect(bookingService.getBooking(userId)).rejects.toEqual(notFoundError());
  });
  it('should return 404 if there is not a booked room for this user', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const fakeEnrollment = createFakeEnrollment();
    const ticketStatus = 'PAID';
    const ticketIsRemote = false;
    const ticketIncludesHotel = true;
    const fakeTicket: any = createFakeTicket(ticketStatus, ticketIsRemote, ticketIncludesHotel);

    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(fakeEnrollment);

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(fakeTicket);

    const bookingMock = jest.spyOn(bookingRepository, 'getBooking');
    bookingMock.mockResolvedValueOnce(null);

    await expect(bookingService.getBooking(userId)).rejects.toEqual(notFoundError());
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

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(fakeTicket);

    const ticketTypeMock = jest.spyOn(ticketsRepository, 'findTickeWithTypeById');
    ticketTypeMock.mockResolvedValueOnce(fakeTicket);

    const roomMock = jest.spyOn(roomRepository, 'getRoom');
    roomMock.mockResolvedValueOnce(null);

    const promise = bookingService.postBooking(userId, roomId);

    await expect(promise).rejects.toEqual(notFoundError());
  });

  it('Should return 403 if the room capacity is exceeded', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });
    const bookingId = faker.datatype.number({ min: 1 });
    const roomCapacity = 0;
    const fakeEnrollment = createFakeEnrollment();
    const ticketStatus = 'PAID';
    const ticketIsRemote = false;
    const ticketIncludesHotel = true;
    const fakeTicket: any = createFakeTicket(ticketStatus, ticketIsRemote, ticketIncludesHotel);
    const fakeBooking = createFakeBooking(userId, roomId, bookingId);
    const fakeRoom = createFakeRoom(roomId, roomCapacity)
   
    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(fakeEnrollment);

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(fakeTicket);

    const ticketTypeMock = jest.spyOn(ticketsRepository, 'findTickeWithTypeById');
    ticketTypeMock.mockResolvedValueOnce(fakeTicket);

    const roomMock = jest.spyOn(roomRepository, 'getRoom');
    roomMock.mockResolvedValueOnce(fakeRoom);

    const bookingMock = jest.spyOn(bookingRepository, 'getRoomById');
    bookingMock.mockResolvedValueOnce(fakeBooking)

    const promise = bookingService.postBooking(userId, roomId);

    expect(promise).rejects.toEqual(forbiddenError());
  });
});

describe('PUT /booking/:bookingId', () => {
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

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(fakeTicket);

    const ticketTypeMock = jest.spyOn(ticketsRepository, 'findTickeWithTypeById');
    ticketTypeMock.mockResolvedValueOnce(fakeTicket);

    const roomMock = jest.spyOn(roomRepository, 'getRoom');
    roomMock.mockResolvedValueOnce(null);

    const promise = bookingService.postBooking(userId, roomId);

    await expect(promise).rejects.toEqual(notFoundError());
  });

  it('Should return 403 if the room capacity is exceeded', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });
    const bookingId = faker.datatype.number({ min: 1 });
    const roomCapacity = 0;
    const fakeEnrollment = createFakeEnrollment();
    const ticketStatus = 'PAID';
    const ticketIsRemote = false;
    const ticketIncludesHotel = true;
    const fakeTicket: any = createFakeTicket(ticketStatus, ticketIsRemote, ticketIncludesHotel);
    const fakeBooking = createFakeBooking(userId, roomId, bookingId);
    const fakeRoom = createFakeRoom(roomId, roomCapacity)
   
    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(fakeEnrollment);

    const ticketMock = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticketMock.mockResolvedValueOnce(fakeTicket);

    const ticketTypeMock = jest.spyOn(ticketsRepository, 'findTickeWithTypeById');
    ticketTypeMock.mockResolvedValueOnce(fakeTicket);

    const roomMock = jest.spyOn(roomRepository, 'getRoom');
    roomMock.mockResolvedValueOnce(fakeRoom);

    const bookingMock = jest.spyOn(bookingRepository, 'getRoomById');
    bookingMock.mockResolvedValueOnce(fakeBooking)

    const promise = bookingService.postBooking(userId, roomId);

    expect(promise).rejects.toEqual(forbiddenError());
  });
})