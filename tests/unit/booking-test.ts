import { createEnrollmentWithAddress } from '../factories';
import { newBookingFactory } from '../factories/booking-factory';
import enrollmentRepository from '../repositories/enrollment-repository';
import ticketsRepository from '../repositories/tickets-repository';
import bookingService from '../services/booking-service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it("Should return 404 if enrollment doesn't exists", async () => {
    const userId = 999;
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(null);
    const testBooking = bookingService.getBooking(userId);

    expect(testBooking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
  it('Should return 404 if user does not have a ticket', async () => {
    const userId = 999;
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(null);

    const testBooking = bookingService.getBooking(userId);
    expect(testBooking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
  it('should return 404 if there is not a booked room for this user'. async () => {
    
  })
});

describe('post /booking', () => {});
