const RECIPIENT = 'info@johnnyutahband.com'
const DEFAULT_FROM = 'Johnny Utah Website <website@johnnyutahband.com>'
const ALLOWED_TOPICS = new Set([
  'Booking inquiry',
  'Festival',
  'Private event',
  'Press',
  'Something else',
])

const clean = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const cleanSingleLine = (value, maxLength) =>
  clean(value, maxLength).replace(/[\r\n]+/g, ' ')

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  let body = request.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return response.status(400).json({ error: 'Invalid request.' })
    }
  }

  const name = cleanSingleLine(body?.name, 100)
  const email = clean(body?.email, 254).toLowerCase()
  const requestedTopic = clean(body?.topic, 50)
  const topic = ALLOWED_TOPICS.has(requestedTopic) ? requestedTopic : 'Something else'
  const message = clean(body?.message, 5000)
  const website = clean(body?.website, 200)

  // Silently accept bot submissions so the honeypot cannot be easily detected.
  if (website) return response.status(200).json({ ok: true })

  if (!name || !isEmail(email) || message.length < 5) {
    return response.status(400).json({ error: 'Please provide your name, a valid email, and a message.' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured')
    return response.status(503).json({ error: 'Email delivery is not configured yet. Please try again later.' })
  }

  let resendResponse
  try {
    resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [RECIPIENT],
        reply_to: email,
        subject: `[Johnny Utah website] ${topic} from ${name}`,
        text: [
          `New ${topic.toLowerCase()} from johnnyutahband.com`,
          '',
          `Name: ${name}`,
          `Email: ${email}`,
          `Topic: ${topic}`,
          '',
          'Message:',
          message,
        ].join('\n'),
      }),
    })
  } catch (error) {
    console.error('Could not reach Resend:', error)
    return response.status(502).json({ error: 'We could not send your inquiry. Please try again.' })
  }

  if (!resendResponse.ok) {
    const details = await resendResponse.text()
    console.error(`Resend rejected contact email (${resendResponse.status}): ${details}`)
    return response.status(502).json({ error: 'We could not send your inquiry. Please try again.' })
  }

  return response.status(200).json({ ok: true })
}
