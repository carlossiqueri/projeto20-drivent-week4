import supertest from 'supertest';
import app, { init } from '../app';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import {
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import { TicketStatus } from '@prisma/client';
import { newBookingFactory } from '../factories/booking-factory';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('get /booking', () => {
  describe('When token given is not a valid one', () => {
    it('Should return 401 if no token is given', async () => {
      const result = await server.get('/booking');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should return status 401 if invalid token is given', async () => {
      const testToken = faker.lorem.sentence(10);

      const result = await server.get('/bookings').set('Authorization', `Bearer ${testToken}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('When the given token is a valid one', () => {
    it('Should return 200 and with the booking info if user has a booking', async () => {
      const testUser = await createUser();
      const testToken = await generateValidToken(testUser);
      const testEnrollment = await createEnrollmentWithAddress();
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
        room: {
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
    
})