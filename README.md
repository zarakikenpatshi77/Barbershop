# Luxe Barber - Premium Barbershop Booking Platform

A modern, luxurious barbershop booking website built with React, Tailwind CSS, and Supabase. This platform provides a seamless experience for both customers and staff to manage appointments and services.

## Features

- 🎨 Modern, minimalist design with luxury aesthetics
- 📱 Fully responsive layout for all devices
- 🔒 Secure authentication and user profiles
- 📅 Real-time appointment booking system
- 💳 Integrated payment processing with Stripe
- 📸 Dynamic gallery and service showcase
- 📊 Comprehensive admin dashboard
- 💌 Automated email/SMS notifications
- ⭐ Customer reviews and ratings
- 🎁 Loyalty program integration

## Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Supabase (Database, Authentication, Storage)
- **Payment:** Stripe
- **Notifications:** Supabase Edge Functions

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API and service integrations
├── utils/         # Helper functions
├── hooks/         # Custom React hooks
├── assets/        # Static assets
└── styles/        # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
