import { Router } from 'express';
import { bookings } from '../data/mockData';
import { Booking } from '../types/index';

const router = Router();

// POST a new booking
router.post('/', (req, res) => {
  const {
    stayId,
    checkIn,
    checkOut,
    guests,
    firstName,
    lastName,
    email,
    city,
    country,
    cardNumber,
    expiry,
    cvv,
  } = req.body;

  if (
    !stayId ||
    !checkIn ||
    !checkOut ||
    !guests ||
    !firstName ||
    !lastName ||
    !email ||
    !city ||
    !country ||
    !cardNumber ||
    !expiry ||
    !cvv
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Mock price calculation: $100 per night per guest
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    return res.status(400).json({ error: 'Check-out date must be after check-in date' });
  }

  const totalPrice = nights * guests * 100;

  const newBooking: Booking = {
    id: (Math.max(...bookings.map((b) => parseInt(b.id)), 0) + 1).toString(),
    confirmationId: `CNF-${Date.now()}`,
    stayId,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    status: 'completed',
    firstName,
    lastName,
    email,
    city,
    country,
    cardNumber,
    expiry,
    cvv,
  };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

export default router;
