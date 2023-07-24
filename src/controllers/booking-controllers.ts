import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares';
import bookingService from '../services/booking-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const booking = await bookingService.getBooking(userId);
  res.status(200).send(booking);
}
