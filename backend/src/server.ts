import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints:`);
  console.log(`  GET  /api/stays`);
  console.log(`  GET  /api/stays/:id`);
  console.log(`  GET  /api/stays/:id/reviews`);
  console.log(`  POST /api/stays/:id/reviews`);
  console.log(`  POST /api/bookings`);
});
