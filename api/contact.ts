const RECIPIENT = 'info@johnnyutahband.com'
const DEFAULT_FROM = 'Johnny Utah Website <website@johnnyutahband.com>'
const ALLOWED_TOPICS = new Set([
  'Booking inquiry',
  'Festival',
  'Private event',
  'Press',
  'Something else',
])

type ContactBody = {
  name?: unknown
  email?: unknown
  topic?: unknown
  message?: unknown
  website?: unknown
}

const clean = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const cleanSingleLine = (value: unknown, maxLength: number) =>
  clean(value, maxLength).replace(/[\r\n]+/g, ' ')

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const json = (body: object, init?: ResponseInit) => Response.json(body, init)

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return json(
        { error: 'Method not allowed.' },
        { status: 405, headers: { Allow: 'POST' } },
      )
    }

    let body: ContactBody
    try {
      const parsed: unknown = await request.json()
      body = parsed && typeof parsed === 'object' ? (parsed as ContactBody) : {}
    } catch {
      return json({ error: 'Invalid request.' }, { status: 400 })
    }

    const name = cleanSingleLine(body.name, 100)
    const email = clean(body.email, 254).toLowerCase()
    const requestedTopic = clean(body.topic, 50)
    const topic = ALLOWED_TOPICS.has(requestedTopic) ? requestedTopic : 'Something else'
    const message = clean(body.message, 5000)
    const website = clean(body.website, 200)

    // Silently accept bot submissions so the honeypot cannot be easily detected.
    if (website) return json({ ok: true })

    if (!name || !isEmail(email) || message.length < 5) {
      return json(
        { error: 'Please provide your name, a valid email, and a message.' },
        { status: 400 },
      )
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return json(
        { error: 'Email delivery is not configured yet. Please try again later.' },
        { status: 503 },
      )
    }

    let resendResponse: Response
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
      return json(
        { error: 'We could not send your inquiry. Please try again.' },
        { status: 502 },
      )
    }

    if (!resendResponse.ok) {
      const details = await resendResponse.text()
      console.error(`Resend rejected contact email (${resendResponse.status}): ${details}`)
      return json(
        { error: 'We could not send your inquiry. Please try again.' },
        { status: 502 },
      )
    }

    return json({ ok: true })
  },
}
