const fs = require('fs/promises');
const path = require('path');

const EMAILJS_SERVICE_ID = 'service_dt5ncfj';
const EMAILJS_TEMPLATE_ID = 'template_jk2yewf';
const EMAILJS_PUBLIC_KEY = 'Wz9j7wVxvvg37DtB8';
const EMAILJS_PRIVATE_KEY = '';

const DEFAULT_TO = 'mohamedattawiya@gmail.com';
const DEFAULT_SUBJECT = 'Invitation';

async function getInvitationBody() {
  const contentPath = path.join(process.cwd(), 'email-content.md');
  return fs.readFile(contentPath, 'utf8');
}

function mask(value) {
  if (!value) return '(empty)';
  if (value.length <= 6) return '***';
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

exports.handler = async function handler(event) {
  const traceId = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  console.log(`[${traceId}] send-invitation invoked`, {
    method: event.httpMethod,
    path: event.path,
  });

  if (event.httpMethod !== 'POST') {
    console.warn(`[${traceId}] rejected non-POST request`);
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method not allowed', traceId }),
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
    console.log(`[${traceId}] config snapshot`, {
      serviceId,
      templateId,
      publicKey: mask(publicKey),
      hasPrivateKey: Boolean(privateKey),
      to,
      subject,
      bodyLength: emailBody.length,
    });

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

    console.log(`[${traceId}] calling EmailJS API`);
    const emailJsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!emailJsResponse.ok) {
      const emailJsError = await emailJsResponse.text();
      console.error(`[${traceId}] EmailJS returned error`, {
        status: emailJsResponse.status,
        statusText: emailJsResponse.statusText,
        responseBody: emailJsError,
      });
      return {
        statusCode: 502,
        body: JSON.stringify({ ok: false, error: `EmailJS error: ${emailJsError}`, traceId }),
      };
    }

    console.log(`[${traceId}] EmailJS send success`, { status: emailJsResponse.status });
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, traceId }),
    };
  } catch (error) {
    console.error(`[${traceId}] unexpected failure`, {
      message: error.message,
      stack: error.stack,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message, traceId }),
    };
  }
};
