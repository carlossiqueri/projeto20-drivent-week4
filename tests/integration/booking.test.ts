import supertest from 'supertest';
import app, { init } from '../../src/app';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import {
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import { TicketStatus } from '@prisma/client';
import { newBookingFactory } from '../factories/booking-factory';

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('get /booking', () => {
  describe('When token given is not a valid one', () => {
    it('Should return 401 if no token is given', async () => {
      const result = await server.get('/booking');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should return status 401 if invalid token is given', async () => {
      const testToken = faker.lorem.sentence(10);

      const result = await server.get('/booking').set('Authorization', `Bearer ${testToken}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('When the given token is a valid one', () => {
    it('Should return 200 and with the booking info if user has a booking', async () => {
      const testUser = await createUser();
      const testToken = await generateValidToken(testUser);
      const testEnrollment = await createEnrollmentWithAddress(testUser);
      const testTicketType = await createTicketTypeWithHotel();
      const testTicket = await createTicket(testEnrollment.id, testTicketType.id, TicketStatus.PAID);
      const testHotel = await createHotel();
      const testRoom = await createRoomWithHotelId(testHotel.id);

      // Create booking for test => do a factory

      const booking = await newBookingFactory(testUser.id, testRoom.id);

      const testBooking = await server.get('/booking').set('Authorization', `Bearer ${testToken}`);

      expect(testBooking.status).toBe(httpStatus.OK);

      expect(testBooking.body).toEqual({
        id: booking.id,
        Room: {
          id: testRoom.id,
          name: testRoom.name,
          capacity: testRoom.capacity,
          hotelId: testRoom.hotelId,
          createdAt: testRoom.createdAt.toISOString(),
          updatedAt: testRoom.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('post /booking', () => {
  describe('When token given is not a valid one', () => {
    it('Should return 401 if no token is given', async () => {
      const result = await server.post('/booking');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should return status 401 if invalid token is given', async () => {
      const testToken = faker.lorem.sentence(10);

      const result = await server.post('/booking').set('Authorization', `Bearer ${testToken}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
  describe('When the given token is a valid one', () => {
    it('Should return 200 and with the booking info if user has a booking', async () => {
      const testUser = await createUser();
      const testToken = await generateValidToken(testUser);
      const testEnrollment = await createEnrollmentWithAddress(testUser);
      const testTicketType = await createTicketTypeWithHotel();
      const testTicket = await createTicket(testEnrollment.id, testTicketType.id, TicketStatus.PAID);
      const testPayment = await createPayment(testTicket.id, testTicketType.price);
      const testHotel = await createHotel();
      const testRoom = await createRoomWithHotelId(testHotel.id);

      // Create booking for test => do a factory

      // const booking = await newBookingFactory(testUser.id, testRoom.id);

      const testBooking = await server
        .post('/booking')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ roomId: testRoom.id });

        console.log(testBooking.body)

      expect(testBooking.status).toBe(httpStatus.OK);

      expect(testBooking.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});
