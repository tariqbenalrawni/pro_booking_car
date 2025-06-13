# Car Rental Application

Modern and professional car rental web application built with Next.js.

## Features

- Modern and responsive UI with Tailwind CSS
- Clean Architecture implementation
- MongoDB integration
- Multi-language support (Arabic & English)
- Booking system
- User account management
- Car search and filtering
- Real-time car availability
- Booking history and management
- Responsive navigation bar with booking button
- Direct booking from home page
- Modern car cards with booking options

## Tech Stack

- Next.js 15.3.3
- TypeScript
- MongoDB
- Tailwind CSS
- Docker (optional)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/car-rental
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

1. Build and run containers:
   ```bash
   docker-compose build
   docker-compose up
   ```

2. Access the application at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── components/     # Reusable UI components
│   │   └── Navbar.tsx # Main navigation component
│   ├── models/        # TypeScript interfaces
│   │   └── car.ts     # Car model interface
│   ├── pages/         # Next.js pages
│   │   ├── booking/   # Booking page
│   │   └── page.tsx   # Home page
│   └── layout.tsx     # Main layout
└── public/           # Static assets
```

## Testing

Run tests:
```bash
npm run test
```

## Optimization

- Code splitting with dynamic imports
- Image optimization
- Performance monitoring
- SEO optimization
- PWA support

## Security

- Input validation
- XSS protection
- CSRF protection
- Secure headers
- Rate limiting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
