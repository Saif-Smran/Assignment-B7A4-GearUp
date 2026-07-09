# GearUp

GearUp is a backend API for renting sports and outdoor gear. The codebase is built with Express, TypeScript, Prisma, PostgreSQL, and Stripe.

## Project Summary

This API supports role-based rental workflows for customers, providers, and admins. Users can register, browse gear, create rental orders, pay through Stripe, manage listings, and leave reviews after a rental is completed.

## Requirement Coverage

Status is based on the current code in this repository, not on the original product brief.

| Requirement | Status | Notes |
|---|---|---|
| Customer, Provider, Admin roles | Implemented | Roles exist in Prisma and route guards are in place |
| Register and login | Implemented | Auth routes are available |
| Current user profile | Implemented | `/api/auth/me` is available |
| Browse gear and view details | Implemented | Public gear routes exist |
| Search and filter by category, price, brand, availability | Partial | Category browsing exists; the README should not claim full filter support unless it is verified in controller logic |
| Provider inventory management | Implemented | Create, update, delete gear routes exist |
| Rental order creation and tracking | Implemented | Rental order routes exist |
| Stripe payments | Implemented | Payment create and confirm routes exist |
| SSLCommerz payments | Not implemented | No SSLCommerz integration exists in the codebase |
| Payment history and status | Implemented | Payment model and customer payment routes exist |
| Reviews after return | Implemented | Review route exists |
| Admin user and rental oversight | Implemented | Admin routes exist |
| Manage categories as a standalone API | Partial | Categories are modeled as an enum and exposed through gear routes, not a separate category CRUD API |

## Roles and Permissions

| Role | Description | Key Permissions |
|---|---|---|
| Customer | Gear renter | Browse gear, place rental orders, track order and payment status, leave reviews, manage profile |
| Provider | Gear vendor or rental shop | Manage gear inventory, view incoming orders, update order status |
| Admin | Platform moderator | Manage users, review gear listings, inspect rental orders |

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Stripe

## Setup

1. Install dependencies:

   npm install

2. Create a `.env` file in the project root.

3. Generate the Prisma client if needed:

   npx prisma generate

4. Start the development server:

   npm run dev

## Environment Variables

The application reads the following variables from `.env`:

- PORT
- DATABASE_URL
- APP_URL
- BCRYPT_SALT_ROUNDS
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- JWT_ACCESS_EXPIRES_IN
- JWT_REFRESH_EXPIRES_IN
- STRIPE_SECRET_KEY
- STRIPE_PUBLIC_KEY
- STRIPE_WEBHOOK_SECRET

## Scripts

- npm run dev - start the API in watch mode with tsx
- npm run build - compile the TypeScript project
- npm run start - run the compiled server from the generated output

## API Endpoints

Base path: `/api`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user and return tokens |
| POST | `/api/auth/refresh-token` | Refresh access token |
| GET | `/api/auth/me` | Get current authenticated user |
| PUT | `/api/auth/me` | Update current user profile |

### Gear

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/gear` | Get all gear |
| GET | `/api/gear/categories` | Get gear categories |
| GET | `/api/gear/:id` | Get gear details |

### Rentals

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rentals` | Create a rental order |
| GET | `/api/rentals` | Get rental orders |
| GET | `/api/rentals/:id` | Get rental order details |

### Payments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create` | Create a payment for a rental order |
| POST | `/api/payments/confirm` | Confirm payment / webhook handling |
| GET | `/api/payments` | Get payment history |
| GET | `/api/payments/:id` | Get a payment by id |

### Provider

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/provider/gear` | Add gear to inventory |
| PUT | `/api/provider/gear/:id` | Update a gear listing |
| DELETE | `/api/provider/gear/:id` | Delete a gear listing |
| GET | `/api/provider/orders` | Get provider orders |
| PATCH | `/api/provider/orders/:id` | Update rental order status |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews` | Create a review |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user status |
| GET | `/api/admin/gear` | Get all gear listings |
| GET | `/api/admin/rentals` | Get all rental orders |

## Data Model

The Prisma schema currently defines these core entities:

- User
- GearItem
- RentalOrder
- RentalOrderItem
- Payment
- Review
- Role, UserStatus, RentalStatus, PaymentStatus, Category enums

## Notes

- The root route `/` returns a simple health message.
- Stripe confirmation uses a raw JSON body on `/api/payments/confirm`.
- Categories are implemented as a Prisma enum rather than a standalone category table.
- The codebase does not currently include SSLCommerz integration.

## Project Structure

- `src/app.ts` - Express app wiring, middleware, and route registration
- `src/server.ts` - server bootstrap and database connection
- `src/config` - environment configuration
- `src/lib` - Prisma and Stripe helpers
- `src/modules` - feature modules for auth, gear, provider, rentals, reviews, admin, and payments
- `prisma/schema` - Prisma schema files
- `generated/prisma` - generated Prisma client artifacts