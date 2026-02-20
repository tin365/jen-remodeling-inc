# Email notifications when users contact or change the site

You can get an email when:
- Someone submits the **contact form**
- A **new review** is added
- (Optional) **Projects** or **project images** are changed in admin

This uses **Supabase Database Webhooks** and an **Edge Function** that sends email via **Resend**. Your site stays static (GitHub Pages); no Next.js server is required.

---

## No domain? No problem

**You don’t need a custom domain.** Resend’s free tier lets you send from `onboarding@resend.dev` to any email (e.g. your Gmail). Notifications will come from that address. When you have a domain later, you can add it in Resend and switch the “from” address in the Edge Function.

---

## 1. Resend (email sending)

1. Sign up at [resend.com](https://resend.com).
2. Create an **API key**: [resend.com/api-keys](https://resend.com/api-keys) → Create API Key. Copy the key (starts with `re_`).
3. **From address**: The function already uses `onboarding@resend.dev`, so nothing else is needed. No domain verification required. (Later, you can add your own domain at [resend.com/domains](https://resend.com/domains) and update the function’s `from` field.)

---

## 2. Supabase Edge Function

### Deploy the function

From your project root (where `supabase/` lives), with [Supabase CLI](https://supabase.com/docs/guides/cli) installed:

```bash
# Login if needed
supabase login

# Link this project. Use only the project ID (e.g. eqvkvorzzyqtfvsnigru from .../project/eqvkvorzzyqtfvsnigru)
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets (your Resend API key and the email that receives notifications)
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
supabase secrets set NOTIFICATION_EMAIL=your-email@example.com

# Deploy the function
supabase functions deploy send-notification
```

After deploy, Supabase shows the function URL, e.g.:

`https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-notification`

You will use this URL when creating Database Webhooks (and you may need to pass the anon key in the header if you enable JWT verification; for webhooks from Supabase DB, you can use the service role or disable JWT for this function and rely on webhook secret).

### Optional: allow webhooks without JWT

Database Webhooks from Supabase call your function with a secret you set. To avoid JWT issues, deploy with:

```bash
supabase functions deploy send-notification --no-verify-jwt
```

Then in the webhook configuration (below), you can send an optional secret header and check it in the function if you want.

---

## 3. Database Webhooks (trigger on insert/update)

1. In **Supabase Dashboard** go to **Database** → **Webhooks** (or **Project Settings** → **Database** → **Webhooks** depending on UI).
2. Click **Create a new webhook**.
3. Configure:

**Webhook 1 – New contact**

- **Name**: `notify-on-contact`
- **Table**: `contact_submissions`
- **Events**: check **Insert** (and **Update** if you want to know when a submission is updated).
- **Type**: HTTP Request.
- **URL**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-notification`
- **HTTP method**: POST.
- **HTTP headers** (optional):  
  `Content-Type: application/json`  
  If your function uses `--no-verify-jwt`, no Authorization header is needed for webhook calls from Supabase.

**Webhook 2 – New review**

- **Name**: `notify-on-review`
- **Table**: `reviews`
- **Events**: **Insert** (and **Update** if desired).
- **URL**: same as above.
- **Method**: POST.

**Optional – Projects / project_images**

- Add webhooks for tables `projects` and `project_images`, events **Insert**, **Update**, **Delete**, same URL. The function will send a short summary email for those changes.

4. Save. Supabase will send a POST body like:

```json
{
  "type": "INSERT",
  "table": "contact_submissions",
  "record": { "name": "...", "email": "...", ... }
}
```

The Edge Function reads this and sends one email per event to `NOTIFICATION_EMAIL`.

---

## 4. Verify

- Submit the **contact form** on your site → you should get an email with the contact details.
- Add a **review** (if you have the review form) → you should get an email for the new review.
- Check **Supabase** → **Edge Functions** → **send-notification** → Logs for errors (e.g. wrong API key or missing `NOTIFICATION_EMAIL`).

---

## 5. Troubleshooting

| Issue | What to check |
|-------|----------------|
| No email | Resend dashboard for delivery/errors; Edge Function logs in Supabase. |
| 500 from function | Supabase secrets: `RESEND_API_KEY` and `NOTIFICATION_EMAIL` set. |
| Webhook not firing | Webhook enabled for the right table and events; URL is the full `send-notification` URL. |
| Resend “from” error | Use `onboarding@resend.dev` until your domain is verified in Resend. |

---

## Summary

- **Resend**: API key + notification email.
- **Supabase**: Deploy `send-notification` Edge Function, set secrets, create Database Webhooks for `contact_submissions` and `reviews` (and optionally `projects` / `project_images`).
- You receive an email to `NOTIFICATION_EMAIL` whenever someone adds a contact or a review, and optionally when project data changes.
