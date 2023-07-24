import { Router } from 'express';
import { authenticateToken } from '../middlewares';
import { getBookings } from '../controllers/booking-controllers';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getBookings);
bookingRouter.post('/', authenticateToken);
bookingRouter.put('/:bookingId', authenticateToken);

export { bookingRouter };
