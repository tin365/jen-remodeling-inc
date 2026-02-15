# Supabase Backend Setup

## 1. Install dependencies

```bash
npm install
```

## 2. Environment variables

`.env.local` is already configured with your Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Copy `.env.example` to `.env.local` if you need to set up on another machine.

## 3. Create database tables

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Go to **SQL Editor**
3. Run `supabase/schema.sql` to create tables and RLS policies

## 4. Seed initial reviews (optional)

1. In Supabase SQL Editor, run `supabase/seed.sql` to add sample reviews

## Tables

- **contact_submissions** — Stores contact form submissions (name, email, phone, service, message, etc.)
- **reviews** — Stores customer reviews (name, service, rating, text, helpful count)

## Features

- **Contact form** — Submissions are saved to `contact_submissions`
- **Reviews** — Loaded from Supabase on page load; new reviews can be submitted via "Write a Review"
