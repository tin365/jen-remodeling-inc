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

# Optional but recommended: shared secret so only Supabase webhooks can call the function
supabase secrets set WEBHOOK_SECRET=your-long-random-string

# Optional: restrict CORS to your site (e.g. GitHub Pages); if unset, allows *
supabase secrets set ALLOWED_ORIGIN=https://tin365.github.io

# Deploy the function (use --no-verify-jwt when using WEBHOOK_SECRET for webhook auth)
supabase functions deploy send-notification --no-verify-jwt
```

After deploy, Supabase shows the function URL, e.g.:

`https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-notification`

You will use this URL when creating Database Webhooks.

### Webhook authentication (recommended)

If you deploy with `--no-verify-jwt`, the function URL is otherwise unauthenticated. **Set `WEBHOOK_SECRET`** (above) and add the same value as the **x-webhook-secret** header in each webhook (see step 3). The function will reject requests that don’t include the correct header, so only your Supabase webhooks can trigger emails.

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
- **HTTP headers**:  
  - `Content-Type: application/json`  
  - If you set `WEBHOOK_SECRET`: `x-webhook-secret: your-long-random-string` (same value as in Supabase secrets).

**Webhook 2 – New review**

- **Name**: `notify-on-review`
- **Table**: `reviews`
- **Events**: **Insert** (and **Update** if desired).
- **URL**: same as above.
- **Method**: POST.
- **HTTP headers**: same as above (include `x-webhook-secret` if you use `WEBHOOK_SECRET`).

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

## 5. Resend email not working? (no domain)

If you have the Resend API key, webhook, and link set up but still get no email:

1. **Check Supabase Edge Function logs**  
   Supabase Dashboard → **Edge Functions** → **send-notification** → **Logs**.  
   Look for the last run when you submitted the form. You’ll see either:
   - **500** → usually missing secrets (see step 2).
   - **401** → webhook secret mismatch (see step 3).
   - **502** → Resend API error (e.g. invalid API key or "from" address); check the log message.

2. **Set both secrets in Supabase (not only in Resend)**  
   The function needs **RESEND_API_KEY** and **NOTIFICATION_EMAIL** in **Supabase** (where the function runs):
   - Dashboard: **Project Settings** → **Edge Functions** → **Secrets**, or  
   - CLI: `supabase secrets set RESEND_API_KEY=re_xxxx` and `supabase secrets set NOTIFICATION_EMAIL=your@email.com`  
   Then **redeploy**: `supabase functions deploy send-notification --no-verify-jwt`

3. **If you set WEBHOOK_SECRET**  
   The webhook must send the same value in the **x-webhook-secret** header.  
   In Database → Webhooks → your webhook → **HTTP Headers**, add:  
   `x-webhook-secret` = the exact value you used in `supabase secrets set WEBHOOK_SECRET=...`  
   If you prefer not to use a secret, remove `WEBHOOK_SECRET` from Supabase secrets and redeploy.

4. **No domain needed**  
   The function sends from `onboarding@resend.dev`. You do **not** need to add or verify a domain in Resend for notifications to work.

5. **Resend dashboard**  
   At [resend.com/emails](https://resend.com/emails) check if the email was sent or bounced. If it never appears, the webhook or function is not reaching Resend (use step 1 logs).

---

## 6. Troubleshooting

| Issue | What to check |
|-------|----------------|
| No email | Resend dashboard for delivery/errors; Edge Function logs in Supabase. |
| 500 from function | Supabase secrets: `RESEND_API_KEY` and `NOTIFICATION_EMAIL` set. |
| Webhook not firing | Webhook enabled for the right table and events; URL is the full `send-notification` URL. |
| Resend “from” error | Use `onboarding@resend.dev` until your domain is verified in Resend. |
| 401 Unauthorized | You set `WEBHOOK_SECRET` but the webhook request does not send the `x-webhook-secret` header, or the value does not match. |

---

## Summary

- **Resend**: API key + notification email.
- **Supabase**: Deploy `send-notification` Edge Function, set `RESEND_API_KEY` and `NOTIFICATION_EMAIL`; optionally `WEBHOOK_SECRET` (and add `x-webhook-secret` header in each webhook) and `ALLOWED_ORIGIN` for CORS.
- Create Database Webhooks for `contact_submissions` and `reviews` (and optionally `projects` / `project_images`).
- You receive an email to `NOTIFICATION_EMAIL` whenever someone adds a contact or a review, and optionally when project data changes. Subject lines are sanitized to prevent email header injection.
