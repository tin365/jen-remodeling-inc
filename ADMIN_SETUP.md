# Admin Role – Setup & Security

## Fix: "Email rate limit exceeded"

If you see **"email rate limit exceeded"** or **"Failed to send confirmation email"** when creating an account:

1. Open **Supabase Dashboard** → **Authentication** → **Providers**.
2. Click **Email**.
3. Turn **OFF** the option **"Confirm email"** (so signup does not send an email).
4. Save.

Then create your account again at `/admin`. No confirmation email is sent, so the rate limit is not used.

**Alternative (no signup email at all):** Create the user in the Dashboard instead of in the app: **Authentication** → **Users** → **Add user** → enter email and password → Create. Copy the user’s **UUID**, then run `INSERT INTO admin_users (user_id) VALUES ('that-uuid');` in SQL Editor. Sign in at `/admin` with that email and password.

---

## Overview

- **URL:** `/admin` (or `/{basePath}/admin` in production)
- **Auth:** Supabase Auth (email + password). Only users listed in `admin_users` can sign in as admin.
- **Data:** Row Level Security (RLS) ensures only admins can read contact submissions and delete contacts or reviews. Admins are not exposed in the public UI.

## 1. Run admin schema in Supabase

In **Supabase Dashboard → SQL Editor**, run the contents of:

**`supabase/admin_schema.sql`**

This creates:

- `admin_users` table (who is allowed to sign in as admin)
- RLS so only those users can read/delete contact submissions and delete reviews

## 2. Create the first admin user

### Step A: Create account at /admin

1. In your app, go to **`/admin`**.
2. Click **“Need an account? Create one”**.
3. Enter email and password (min 6 characters), then **Create account**.
4. You’ll see a green message and an **SQL snippet** containing your **User ID**.

### Step B: Add yourself as admin (SQL)

1. Open **Supabase Dashboard → SQL Editor**.
2. Run the `INSERT` statement shown on the screen (it will look like):
   ```sql
   INSERT INTO admin_users (user_id) VALUES ('your-uuid-here');
   ```

### Step C: Sign in

Click **“Back to sign in”** and sign in with the same email and password. You should see the admin dashboard.

## 3. Add more admins

For each new admin:

1. They sign up once at `/admin` (or you create the user under **Authentication → Users**).
2. Copy their user UUID from **Authentication → Users**.
3. Run: `INSERT INTO admin_users (user_id) VALUES ('their-uuid');`

Only the **service role** (Dashboard / backend) can insert into `admin_users`; the app never can. That’s how the “highest security” is enforced.

## Security summary

| Layer | Protection |
|-------|------------|
| **Who is admin** | Decided only in Supabase (SQL or Dashboard). Not editable from the app. |
| **Login** | Supabase Auth. After login, app checks `admin_users`; if not listed, session is cleared and “Access denied” is shown. |
| **Data** | RLS: only rows in `admin_users` can SELECT/DELETE on contact_submissions and DELETE on reviews. Anon can only INSERT contacts and SELECT/INSERT reviews. |
| **Admin URL** | Not linked from the public site. Only people who know `/admin` can try to sign in. |
| **SEO** | Admin layout sets `robots: { index: false, follow: false }` so crawlers don’t index the admin page. |

## Recommendations

- Use a **strong, unique password** for admin (or a password manager).
- In **Supabase Dashboard → Authentication → Settings**, consider shortening **JWT expiry** for admin sessions if you want.
- Remove admins by deleting their row: `DELETE FROM admin_users WHERE user_id = 'uuid';`
- Do **not** put the admin URL in the public header or footer.
