# GetMoving

> A web application for organizing boxes during a house move.

Instead of manually tracking what's packed where, users can take a photo of a box and let AI generate a suggested name, description, and destination room. Each box has its own page, printable label, and QR code for quick access during packing and unpacking.

---

## Features

- Create and manage boxes
- Generate box details from a photo using Google Gemini
- Assign destination rooms
- Track box status (Packing / Packed)
- Generate printable labels
- Create QR codes that link back to box details

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Next.js Route Handlers
- SQLite
- Drizzle ORM

### Forms & Validation

- React Hook Form
- Zod

### AI

- Google Gemini

---

## Running Locally

```bash
pnpm install

cp .env.example .env

pnpm db:migrate
pnpm dev
```

Create a Gemini API key at https://aistudio.google.com/app/apikey and add it to your `.env` file:

```env
GEMINI_KEY=your-google-gemini-api-key
```

Open http://localhost:3000 in your browser.
