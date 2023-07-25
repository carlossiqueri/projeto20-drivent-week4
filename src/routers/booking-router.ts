import { Router } from 'express';
import { authenticateToken } from '../middlewares';
import { getBookings, postBookings } from '../controllers/booking-controllers';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getBookings);
bookingRouter.post('/', authenticateToken, postBookings);
bookingRouter.put('/:bookingId', authenticateToken);

export { bookingRouter };
