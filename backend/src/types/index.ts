export interface Availability {
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
}

export interface Stay {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
  latitude: number;
  longitude: number;
  availability: Availability[];
}

export interface Review {
  id: string;
  stayId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  confirmationId?: string;
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'completed' | 'pending' | 'cancelled';
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
  country?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}
