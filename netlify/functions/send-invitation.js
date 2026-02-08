const fs = require('fs/promises');
const path = require('path');

const DEFAULT_TO = 'mohamedamr303@gmail.com';

async function getInvitationBody() {
  const contentPath = path.join(process.cwd(), 'email-content.md');
  return fs.readFile(contentPath, 'utf8');
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INVITATION_FROM_EMAIL;
  const to = process.env.INVITATION_TO_EMAIL || DEFAULT_TO;
  const subject = process.env.INVITATION_SUBJECT || 'Invitation';

  if (!apiKey || !from) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: 'Missing RESEND_API_KEY or INVITATION_FROM_EMAIL environment variable',
      }),
    };
  }

  try {
    const emailBody = await getInvitationBody();

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: emailBody,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      return {
        statusCode: 502,
        body: JSON.stringify({ ok: false, error: `Resend error: ${resendError}` }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message }),
    };
  }
};
