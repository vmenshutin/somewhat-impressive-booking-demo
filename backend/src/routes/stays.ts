import { Router } from 'express';
import { stays, reviews, bookings } from '../data/mockData';
import { Review, Booking } from '../types/index';

const router = Router();

/**
 * Parse and validate ISO date string (YYYY-MM-DD)
 * @param dateString - ISO date string to validate
 * @returns Validated date string or null if invalid
 */
const parseISODate = (dateString: unknown): string | null => {
  // Ensure input is a string
  if (typeof dateString !== 'string') {
    return null;
  }

  const trimmed = dateString.trim();

  // Validate format: YYYY-MM-DD
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(trimmed)) {
    return null;
  }

  // Validate actual date (using UTC to avoid timezone issues)
  const [year, month, day] = trimmed.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  // Check if date is valid
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return trimmed;
};

/**
 * Check if stay is available for requested date range
 * All string comparisons are safe because dates are in YYYY-MM-DD format
 */
const isStayAvailable = (
  stay: any,
  checkIn: string,
  checkOut: string
): boolean => {
  return stay.availability.some(
    (avail: any) => avail.startDate <= checkIn && avail.endDate >= checkOut
  );
};

// GET all stays
router.get('/', (req, res) => {
  const { minPrice, maxPrice, minRating, location, checkIn, checkOut, sortBy } = req.query;

  // Log incoming request
  console.log('[GET /stays] Query params:', {
    minPrice,
    maxPrice,
    minRating,
    location,
    checkIn,
    checkOut,
    sortBy,
  });

  let filtered = stays;

  // Validate and apply date filtering if provided
  if (checkIn || checkOut) {
    // Both dates required
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        error: 'Both checkIn and checkOut dates are required when filtering by dates',
      });
    }

    // Parse and validate dates
    const parsedCheckIn = parseISODate(checkIn);
    const parsedCheckOut = parseISODate(checkOut);

    if (!parsedCheckIn || !parsedCheckOut) {
      return res.status(400).json({
        error: 'Dates must be valid ISO format (YYYY-MM-DD)',
      });
    }

    // Validate date logic
    if (parsedCheckIn >= parsedCheckOut) {
      return res.status(400).json({
        error: 'checkIn date must be before checkOut date',
      });
    }

    filtered = filtered.filter((s) => isStayAvailable(s, parsedCheckIn, parsedCheckOut));
  }

  // Apply price filters (safely parse numbers)
  if (minPrice) {
    const minPriceNum = parseFloat(minPrice as string);
    if (!isNaN(minPriceNum)) {
      filtered = filtered.filter((s) => s.price >= minPriceNum);
    }
  }

  if (maxPrice) {
    const maxPriceNum = parseFloat(maxPrice as string);
    if (!isNaN(maxPriceNum)) {
      filtered = filtered.filter((s) => s.price <= maxPriceNum);
    }
  }

  // Apply rating filter (safely parse number)
  if (minRating) {
    const minRatingNum = parseFloat(minRating as string);
    if (!isNaN(minRatingNum)) {
      filtered = filtered.filter((s) => s.rating >= minRatingNum);
    }
  }

  // Apply location filter (case-insensitive substring match)
  if (location && typeof location === 'string') {
    const locationLower = location.toLowerCase();
    filtered = filtered.filter((s) =>
      s.location.toLowerCase().includes(locationLower)
    );
  }

  const sortByValue = typeof sortBy === 'string' ? sortBy : 'name';
  const sorted = [...filtered];

  switch (sortByValue) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating-asc':
      sorted.sort((a, b) => a.rating - b.rating);
      break;
    case 'rating-desc':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  // Log results
  console.log(`[GET /stays] Returned ${sorted.length} stays (out of ${stays.length} total)`);

  res.json(sorted);
});

// GET stay by ID
router.get('/:id', (req, res) => {
  const stay = stays.find((s) => s.id === req.params.id);
  if (!stay) {
    return res.status(404).json({ error: 'Stay not found' });
  }
  res.json({ ...stay, image: stay.image.replace('?w=400', '?w=1200') });
});

// GET reviews for a stay
router.get('/:id/reviews', (req, res) => {
  const stayReviews = reviews.filter((r) => r.stayId === req.params.id);
  res.json(stayReviews);
});

// POST a new review for a stay
router.post('/:id/reviews', (req, res) => {
  const { author, rating, comment } = req.body;

  // Validate required fields
  if (!author || rating === undefined || !comment) {
    return res.status(400).json({ error: 'Missing required fields: author, rating, comment' });
  }

  // Validate rating is a number between 1-5
  const ratingNum = parseFloat(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
  }

  // Generate today's date in YYYY-MM-DD format (UTC)
  const today = new Date();
  const dateString = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;

  const newReview: Review = {
    id: (Math.max(...reviews.map((r) => parseInt(r.id)), 0) + 1).toString(),
    stayId: req.params.id,
    author: String(author).trim(),
    rating: ratingNum,
    comment: String(comment).trim(),
    date: dateString,
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

export default router;
