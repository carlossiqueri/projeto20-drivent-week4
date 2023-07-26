import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares';
import bookingService from '../services/booking-service';
import httpStatus from 'http-status';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const booking = await bookingService.getBooking(userId);
  res.status(httpStatus.OK).send(booking);
}

export async function postBookings(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const roomId = req.body.roomId;

  const newBooking = await bookingService.postBooking(userId, roomId);

  res.status(httpStatus.OK).send(newBooking);
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const roomId = req.body.roomId;
  const bookingId = Number(req.params.bookingId);

  const updatedBooking = await bookingService.updateBooking(bookingId, userId, roomId);
  res.status(httpStatus.OK).send(updatedBooking);
}
