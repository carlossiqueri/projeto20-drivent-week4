import { newBookingFactory } from '../factories/booking-factory';
import enrollmentRepository from '../repositories/enrollment-repository';
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
});
