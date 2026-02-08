const fs = require('fs/promises');
const path = require('path');

const EMAILJS_SERVICE_ID = 'service_dt5ncfj';
const EMAILJS_TEMPLATE_ID = 'template_jk2yewf';
const EMAILJS_PUBLIC_KEY = 'Wz9j7wVxvvg37DtB8';
const EMAILJS_PRIVATE_KEY = '';

const DEFAULT_TO = 'mohamedamr303@gmail.com';
const DEFAULT_SUBJECT = 'Invitation';

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

  const serviceId = EMAILJS_SERVICE_ID;
  const templateId = EMAILJS_TEMPLATE_ID;
  const publicKey = EMAILJS_PUBLIC_KEY;
  const privateKey = EMAILJS_PRIVATE_KEY;
  const to = DEFAULT_TO;
  const subject = DEFAULT_SUBJECT;

  try {
    const emailBody = await getInvitationBody();

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email: to,
        subject,
        message: emailBody,
        invitation_text: emailBody,
      },
    };

    if (privateKey) {
      payload.accessToken = privateKey;
    }

    const emailJsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!emailJsResponse.ok) {
      const emailJsError = await emailJsResponse.text();
      return {
        statusCode: 502,
        body: JSON.stringify({ ok: false, error: `EmailJS error: ${emailJsError}` }),
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
