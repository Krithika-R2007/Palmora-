# Palmora-
Imagine opening the website and immediately getting the feeling of a premium salon booking platform, similar to luxury beauty brands rather than a simple appointment app.

#  Paloma – Local Development Setup

## Prerequisites

Make sure you have the following installed:

```bash
node --version
# Recommended: v20 or v22+

pnpm --version
# Recommended: v9+
```

If PNPM is not installed:

```bash
npm install -g pnpm
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/paloma.git
cd paloma
```

Install dependencies:

```bash
pnpm install
```

---

## 2. Set Up the Database

Paloma requires a PostgreSQL database.

### Option A: Local PostgreSQL

Install PostgreSQL and create a database named:

```sql
paloma
```

### Option B: Cloud Database (Recommended)

Use a free PostgreSQL provider such as:

- Neon
- Supabase

Create a new PostgreSQL database and copy the connection string.

---

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/paloma
SESSION_SECRET=your-long-random-secret-key
```

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/paloma
SESSION_SECRET=my-super-secret-session-key
```

---

## 4. Push Database Schema

Create all required tables automatically:

```bash
pnpm --filter @workspace/db run push
```

---

## 5. Run the Application

Open **two separate terminals**.

### Terminal 1 – Backend API Server

```bash
pnpm --filter @workspace/api-server run dev
```

Backend runs on:

```text
http://localhost:8080
```

### Terminal 2 – Frontend

```bash
pnpm --filter @workspace/paloma run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Open the application in your browser:

```text
http://localhost:5173
```

---

## 6. Seed Sample Data (Optional)

If the application loads with empty salons, bookings, or other data, run:

```bash
pnpm --filter @workspace/api-server run seed
```

If this command is unavailable, check:

```text
api-server/package.json
```

for the correct seed script name.

---

# GitHub Setup

Initialize Git and push the project to GitHub:

```bash
cd paloma

git init

git add .

git commit -m "Initial commit: Paloma luxury salon platform"

git remote add origin https://github.com/YOUR_USERNAME/paloma.git

git push -u origin main
```

---

## Tech Stack

- React
- TypeScript
- Vite
- Node.js
- PostgreSQL
- Drizzle ORM
- Firebase (Real-Time Features)
- PNPM Workspace

---

## Project Structure

```text
paloma/
├── apps/
│   ├── paloma/              # Frontend
│   └── api-server/          # Backend
│
├── packages/
│   └── db/                  # Database schema & migrations
│
├── .env
├── pnpm-workspace.yaml
└── package.json
```

---

## Troubleshooting

### Dependencies not installing

```bash
pnpm install
```

### Database connection issues

Verify:

- PostgreSQL is running
- DATABASE_URL is correct
- Database exists

### Port already in use

Change the port in the respective configuration files or stop the conflicting process.

---

## License

This project is licensed under the MIT License.
