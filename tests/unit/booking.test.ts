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
    const roomId = faker.datatype.number({ min: 500, max: 999 });]

    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockResolvedValueOnce(null);

    const promise = bookingService.postBooking(userId, roomId);

    await expect(promise).rejects.toEqual(notFoundError());
  })
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
  })  
  it('Should return 403 if ticket type does not includes hotel', async () => {

  })
  it('Should return 403 if ticket type is remote', async () => {

  })
  
  it('Should return 404 if room does not exist', async () => {
    const userId = faker.datatype.number({ min: 1 });
    const roomId = faker.datatype.number({ min: 500, max: 999 });
    const fakeEnrollment = createFakeEnrollment();
    const fakeTicket: any = createFakeTicket();

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
    const fakeTicket: any = createFakeTicket();
    
    const 
  });
});

// describe('post /booking', () => {
//   it('Should return 404 if room does not exist', async () => {
//     const userId = faker.datatype.number({min: 1});
//     const roomId = faker.datatype.number({min: 500, max: 999});

//     const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
//     enrollmentMock.mockResolvedValueOnce
//     });
//   });
//   it('Should return 403 if there is no available room', async () => {
//     jest.spyOn(userRepository, 'create').mockResolvedValue(await createUser());
//     jest
//       .spyOn(enrollmentRepository, 'findWithAddressByUserId')
//       .mockResolvedValue(createEnrollmentWithAddress(await createUser()));
//     jest
//       .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
//       .mockResolvedValue(ticketWithTypeFactory(true, false, true));
//     const mock: any = {
//       id: 1,
//       userId: 555,
//       roomId: 555,
//     };

//     jest.spyOn(bookingRepository, 'postBooking').mockResolvedValue(mock);

//     // Situação de erro  ????  => checkRoom.length > room.capacity (service)
//     const booking = bookingService.postBooking(555, 111);
//     expect(booking).rejects.toEqual({
//       name: 'ForbiddenError',
//       message: 'Forbidden',
//     });
//   });
//   it('Should return 403 if ticket has not been paid', async () => {
//     jest
//       .spyOn(enrollmentRepository, 'findWithAddressByUserId')
//       .mockResolvedValue(createEnrollmentWithAddress(await createUser()));
//     jest
//       .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
//       .mockResolvedValue(ticketWithTypeFactory(false, false, true));

//     const booking = bookingRepository.postBooking(555, 111);
//     expect(booking).rejects.toEqual({
//       name: 'ForbiddenError',
//       message: 'Forbidden',
//     });
//   });

//   it('Should Return 403 if hotel is not included', async () => {
//     jest
//       .spyOn(enrollmentRepository, 'findWithAddressByUserId')
//       .mockResolvedValue(createEnrollmentWithAddress(await createUser()));
//     jest
//       .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
//       .mockResolvedValue(ticketWithTypeFactory(true, false, false));

//     const booking = bookingRepository.postBooking(555, 111);
//     expect(booking).rejects.toEqual({
//       name: 'ForbiddenError',
//       message: 'Forbidden',
//     });
//   });

//   it('Should Return 403 if ticket type is remote', async () => {
//     jest
//       .spyOn(enrollmentRepository, 'findWithAddressByUserId')
//       .mockResolvedValue(createEnrollmentWithAddress(await createUser()));
//     jest
//       .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
//       .mockResolvedValue(ticketWithTypeFactory(true, true, true));

//     const booking = bookingRepository.postBooking(555, 111);
//     expect(booking).rejects.toEqual({
//       name: 'ForbiddenError',
//       message: 'Forbidden',
//     });
//   });
// });
