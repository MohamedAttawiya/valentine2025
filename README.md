# Ask-out-your-Valentine

Personalized Valentine page with:
- playful Yes/No interaction
- personalized photos on Yes
- automatic invitation email send on Yes (via Netlify Function)

## How Email Sending Works

When `Yes` is clicked, the frontend calls:

`/.netlify/functions/send-invitation`

That Netlify Function:
1. Reads your invitation text from `email-content.md`
2. Sends an email using the Resend API
3. Delivers to `mohamedamr303@gmail.com` (or `INVITATION_TO_EMAIL` if set)

## Files Added for Netlify

- `netlify/functions/send-invitation.js` - serverless email sender
- `netlify.toml` - Netlify build/functions config
- `.env.example` - required environment variables
- `email-content.md` - invitation body text

## Netlify Setup (Zero-Cost Path)

1. Create a free Resend account.
2. Create an API key in Resend.
3. Verify a sender:
   - Fast test: use `onboarding@resend.dev` as sender
   - Production: verify your own domain and sender email
4. In Netlify dashboard for this site, set environment variables:
   - `RESEND_API_KEY`
   - `INVITATION_FROM_EMAIL`
   - `INVITATION_TO_EMAIL` (optional, defaults to `mohamedamr303@gmail.com`)
   - `INVITATION_SUBJECT` (optional)
5. Commit and push this repo to Netlify.
6. Deploy.

## What You Edit Later

- Put your final invitation message in `email-content.md`.

No other code changes are needed unless you want HTML email formatting.
