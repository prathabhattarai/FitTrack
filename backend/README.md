# Gym FitTrack Backend

This is the Node.js + Express backend for the Gym Management System. It uses Sequelize ORM with MySQL to handle associations like members, plans, trainers, attendances, and payments.

## Prerequisites
- Node.js (v18+)
- MySQL (Running on local or remote)
- Configure `DB_USER` and `DB_PASSWORD` in `.env`

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up the `.env` file (see `.env.example`).
   - Include standard DB configuration.
   - Set `EMAIL_USER` and `EMAIL_PASS` for Nodemailer OTP.
   - Set `JWT_SECRET`.

3. Initialize the database and run migrations:
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

4. Run seeders (Creates default Admin and Membership plans):
   ```bash
   npx sequelize-cli db:seed:all
   ```

5. Start the server:
   ```bash
   npm run dev    # For development mode
   npm start      # For production mode
   ```

## Example Endpoints
**1. Login / Send OTP**
- `POST /api/auth/login`
- Body: `{ "email": "admin@fittrack.com", "password": "admin" }`
- Response: `OTP sent to your email`

**2. Verify OTP (Finalize Login)**
- `POST /api/auth/verify-otp`
- Body: `{ "email": "admin@fittrack.com", "otp": "xxxxxx" }`
- Response: Returns JWT `token` and user object.

**3. Admin Dashboard (Protected - Admin only)**
- `GET /api/admin/dashboard`
- Header: `Authorization: Bearer <TOKEN>`
- Response: `{ "totalMembers": 0, "totalTrainers": 0 ... }`

**4. Check In (Protected - Member / Admin)**
- `POST /api/attendance/check-in`
- Header: `Authorization: Bearer <TOKEN>`
- Body: `{}`

## Folder Structure
- `src/config/`: DB/Env bindings (`database.js`, `env.js`)
- `src/controllers/`: Business logic per feature module
- `src/middlewares/`: Authentication, Roles, Validations, Error Handling
- `src/models/`: Sequelize Entity models and relations
- `src/routes/`: Express routers endpoints
- `src/db/migrations/`: Schema scripts
- `src/db/seeders/`: Demo data initialization
- `src/utils/`: Helper scripts (e.g. Mailer for OTP)
