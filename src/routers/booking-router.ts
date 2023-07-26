import { Router } from 'express';
import { authenticateToken } from '../middlewares';
import { getBookings, postBookings, updateBooking } from '../controllers/booking-controllers';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getBookings);
bookingRouter.post('/', authenticateToken, postBookings);
bookingRouter.put('/:bookingId', authenticateToken, updateBooking);

export { bookingRouter };
