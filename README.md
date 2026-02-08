# Ask-out-your-Valentine

Personalized Valentine page with:
- playful Yes/No interaction
- personalized photos on Yes
- invitation email send on "Get my invitation" (via Netlify Function)

## How Email Sending Works

After `Yes` is clicked, the "Get my invitation" button calls:

`/.netlify/functions/send-invitation`

That Netlify Function:
1. Reads your invitation text from `email-content.md`
2. Sends an email using the EmailJS API
3. Delivers to `mohamedamr303@gmail.com` (or `INVITATION_TO_EMAIL` if set)

## Files Added for Netlify

- `netlify/functions/send-invitation.js` - serverless email sender
- `netlify.toml` - Netlify build/functions config
- `.env.example` - required environment variables
- `email-content.md` - invitation body text

## Netlify + EmailJS Setup (Free Plan Path)

1. Create a free EmailJS account.
2. Add an Email Service in EmailJS (Gmail/Outlook/etc.) and copy `Service ID`.
3. Create an Email Template and copy `Template ID`.
4. In that template, use at least these variables:
   - `{{to_email}}`
   - `{{subject}}`
   - `{{message}}` (or `{{invitation_text}}`)
5. Copy your EmailJS `Public Key` from Account settings.
6. Optional but recommended: create an EmailJS `Private Key` and use it as `EMAILJS_PRIVATE_KEY`.
7. In Netlify dashboard for this site, set environment variables:
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`
   - `EMAILJS_PRIVATE_KEY` (optional)
   - `INVITATION_TO_EMAIL` (optional, defaults to `mohamedamr303@gmail.com`)
   - `INVITATION_SUBJECT` (optional)
8. Commit and push this repo to Netlify.
9. Deploy.

## What You Edit Later

- Put your final invitation message in `email-content.md`.

No other code changes are needed unless you want HTML email formatting.
