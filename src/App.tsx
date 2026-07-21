import { type FormEvent, useRef, useState } from 'react'
import './App.css'

import bgVideo from './assets/jubackground.mov'
import liveStage from './assets/live-stage.jpg'
import liveWide from './assets/live-wide.jpg'
import bandWide from './assets/band-wide.jpg'
import shirtBack from './assets/shirt-back.png'
import preciousCover from './assets/release-precious.jpg'
import nadieMeLlevaCover from './assets/release-nadie-me-lleva.jpg'
import enolaGayCover from './assets/release-enola-gay.jpg'
import liveOpRockwellCover from './assets/release-live-op-rockwell.jpg'
import basementAlamoCover from './assets/release-basement-alamo.jpg'

import Icon from './components/Icon'
import FacebookIcon from './assets/facebook.svg?react'
import InstagramIcon from './assets/instagram.svg?react'
import SpotifyIcon from './assets/spotify.svg?react'
import YouTubeIcon from './assets/youtube.svg?react'

const socialLinks = [
  { href: 'https://www.instagram.com/johnnyutahband', icon: InstagramIcon, label: 'Instagram' },
  { href: 'https://www.youtube.com/@johnnyutah8544', icon: YouTubeIcon, label: 'YouTube' },
  { href: 'https://open.spotify.com/artist/3UMwzIY5BTbaL0x2RZ5Ukh', icon: SpotifyIcon, label: 'Spotify' },
  { href: 'https://www.facebook.com/johnnyutahband', icon: FacebookIcon, label: 'Facebook' },
]

const navLinks = [
  ['Shows', '#shows'],
  ['Music', '#music'],
  ['Story', '#story'],
  ['Merch', '#merch'],
] as const

const sampleShows = [
  { iso: '2026-08-16', month: 'Aug', day: '16', venue: 'The Static Room', city: 'Salt Lake City, UT' },
  { iso: '2026-09-06', month: 'Sep', day: '06', venue: 'Neon Current Hall', city: 'Provo, UT' },
  { iso: '2026-10-11', month: 'Oct', day: '11', venue: 'Wasatch Soundhouse', city: 'Ogden, UT' },
  { iso: '2026-11-01', month: 'Nov', day: '01', venue: 'Desert Wave Social', city: 'Moab, UT' },
]

const releases = [
  { title: 'Precious', year: '2021', kind: 'Single', cover: preciousCover, href: 'https://open.spotify.com/album/3OKktbCFOJPahCGVcoEI4t' },
  { title: 'Nadie Me Lleva', year: '2021', kind: 'Single', cover: nadieMeLlevaCover, href: 'https://open.spotify.com/album/0mYLyTmbCJ7SCZAnUSdIMg' },
  { title: 'Enola Gay', year: '2021', kind: 'Single', cover: enolaGayCover, href: 'https://open.spotify.com/album/6zPX5CU4yUyBiK75G1vUG5' },
  { title: 'Live at O.P. Rockwell', year: '2020', kind: 'Live album', cover: liveOpRockwellCover, href: 'https://open.spotify.com/album/6Ehcm4XKjfqH3IAplaFtPm' },
  { title: 'From the Basement of the Alamo', year: '2018', kind: 'EP', cover: basementAlamoCover, href: 'https://open.spotify.com/album/1JYyV1h8mMw0VzYFxEEuU2' },
]

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play()
      setVideoPlaying(true)
    } else {
      video.pause()
      setVideoPlaying(false)
    }
  }

  const submitBookingInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setFormStatus('submitting')
    setFormMessage('Sending your inquiry…')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          topic: formData.get('topic'),
          message: formData.get('message'),
          website: formData.get('website'),
        }),
      })
      const result = await response.json().catch(() => null) as { error?: string } | null

      if (!response.ok) {
        throw new Error(result?.error || 'We could not send your inquiry. Please try again.')
      }

      form.reset()
      setFormStatus('success')
      setFormMessage('Inquiry sent. We’ll be in touch soon.')
    } catch (error) {
      setFormStatus('error')
      setFormMessage(error instanceof Error ? error.message : 'We could not send your inquiry. Please try again.')
    }
  }

  return (
    <main>
      <section id="home" className="hero">
        <video ref={videoRef} autoPlay muted loop playsInline className="bg-video" aria-hidden="true">
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="hero-scrim" />
        <div className="grain" aria-hidden="true" />

        <header className="site-header page-shell">
          <a className="monogram" href="#home" aria-label="Johnny Utah home">JU / SLC</a>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          <nav id="main-navigation" className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
          </nav>
          <a className="header-book" href="#book">Book us</a>
        </header>

        <div className="hero-content page-shell">
          <div className="hero-kicker"><span /> Salt City Surf Rock</div>
          <h1>Johnny Utah</h1>
          <div className="hero-bottomline">
            <p>Reverb from the high desert.</p>
            <a className="featured-link" href="https://li.sten.to/lovevigilantes" target="_blank" rel="noreferrer">
              <span>Featured single</span>
              <strong>Love Vigilantes</strong>
              <em>Listen now →</em>
            </a>
          </div>
        </div>

        <button className="video-toggle" type="button" onClick={toggleVideo}>
          {videoPlaying ? 'Pause film' : 'Play film'}
        </button>
        <div className="hero-ticker" aria-hidden="true">
          <span>Instrumental surf from Salt Lake City</span><b>✦</b><span>Vintage reverb / modern current</span><b>✦</b><span>Live, loud &amp; high fidelity</span>
        </div>
      </section>

      <section id="shows" className="shows section-dark">
        <div className="page-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Live &amp; loud</p>
              <h2>Catch the next wave.</h2>
            </div>
          </div>

          <div className="shows-layout">
            <figure className="shows-visual">
              <img src={liveWide} alt="Johnny Utah performing live on stage" />
              <figcaption>
                <span>Salt Lake City, Utah</span>
                <strong>High tide. High volume.</strong>
              </figcaption>
            </figure>

            <div className="shows-board">
              <div className="shows-board-heading">
                <span>Upcoming shows</span>
                <span>2026</span>
              </div>
              <div className="shows-list" aria-label="Sample upcoming shows">
                {sampleShows.map((show) => (
                  <div className="show-row" key={`${show.month}-${show.day}-${show.venue}`}>
                    <time className="show-date" dateTime={show.iso}>
                      <span>{show.month}</span>
                      <strong>{show.day}</strong>
                    </time>
                    <div className="show-place">
                      <strong>{show.venue}</strong>
                      <span>{show.city}</span>
                    </div>
                    <button type="button" aria-label={`Details for sample show at ${show.venue}`}>Details</button>
                  </div>
                ))}
              </div>
              <div className="shows-actions">
                <a href="https://www.instagram.com/johnnyutahband" target="_blank" rel="noreferrer">
                  <span>Fans</span>
                  <strong>Get show announcements</strong>
                  <b>↗</b>
                </a>
                <a href="#book">
                  <span>Venues &amp; promoters</span>
                  <strong>Bring us to your room</strong>
                  <b>↓</b>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="music" className="music-section">
        <div className="music-feature">
          <div className="music-image" style={{ backgroundImage: `url(${liveStage})` }} aria-hidden="true">
            <span>Salt City / Studio current</span>
          </div>
          <div className="music-copy">
            <p className="eyebrow">Featured single</p>
            <h2>Love<br />Vigilantes</h2>
            <p className="music-description">A New Order classic sent through spring reverb, tremolo, and the unmistakable Johnny Utah current.</p>
            <div className="music-player">
              <span className="player-label">Play it here</span>
              <iframe
                title="Love Vigilantes by Johnny Utah on Apple Music"
                allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                loading="lazy"
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                src="https://open.spotify.com/embed/album/4DvWrpnrtWvVBrKvhpuWlv?utm_source=generator&theme=0"
              />
            </div>
          </div>
        </div>

        <div className="music-catalog">
          <div className="catalog-releases">
            <div className="catalog-heading">
              <span>More transmissions</span>
              <strong>Singles, live cuts &amp; the EP</strong>
            </div>
            <div className="release-strip">
              {releases.map((release) => (
                <a
                  href={release.href}
                  target="_blank"
                  rel="noreferrer"
                  className="release-card"
                  key={release.title}
                >
                  <span className="release-art">
                    <img src={release.cover} alt={`${release.title} cover art`} />
                    <i aria-hidden="true">Play ↗</i>
                  </span>
                  <span className="release-info">
                    <strong>{release.title}</strong>
                    <small>{release.kind} · {release.year}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="platform-links" aria-label="Listen to Johnny Utah">
            <span>All music on</span>
            <a href="https://open.spotify.com/artist/3UMwzIY5BTbaL0x2RZ5Ukh" target="_blank" rel="noreferrer">Spotify ↗</a>
            <a href="https://music.apple.com/us/artist/johnny-utah/1373011596" target="_blank" rel="noreferrer">Apple Music ↗</a>
            <a href="https://www.youtube.com/@johnnyutah8544" target="_blank" rel="noreferrer">YouTube ↗</a>
            <a href="https://li.sten.to/lovevigilantes" target="_blank" rel="noreferrer">Every service ↗</a>
          </div>
        </div>
      </section>

      <section id="story" className="story section-paper">
        <div className="page-shell story-grid">
          <div className="story-intro">
            <p className="eyebrow">The short version</p>
            <h2>No singer.<br />No problem.</h2>
          </div>
          <figure className="story-photo">
            <img src={bandWide} alt="The four members of Johnny Utah in front of the Wasatch Mountains" />
            <figcaption>Salt Lake City, Utah · Instrumental surf revivalists</figcaption>
          </figure>
          <div className="story-body">
            <p className="story-lead">Johnny Utah started in a basement, where four friends from California, Arizona, Washington, and Utah got together to play music — and realized none of them were singers.</p>
            <p>What began as an excuse to make some noise became a shared obsession with instrumental surf: vintage guitars, tremolo, and plenty of spring reverb. That basement experiment grew into original instrumentals and surf-charged versions of the ’80s alternative and new wave songs the band already loved.</p>
            <p className="story-milestone"><span>Started in 2015.</span> More than 150 Utah shows later, the reverb is still ringing.</p>
            <a className="text-link" href="https://voyageutah.com/interview/daily-inspiration-meet-johnny-utah/" target="_blank" rel="noreferrer">Read the Voyage Utah interview →</a>
          </div>
        </div>
      </section>

      <section id="merch" className="merch">
        <div className="page-shell merch-grid">
          <div className="merch-art"><img src={shirtBack} alt="Johnny Utah Salt City Surf Rock shirt artwork" /></div>
          <div className="merch-copy">
            <p className="eyebrow">From the merch table</p>
            <h2>Salt City<br />Surf Rock.</h2>
            <p>Shirts, prints, and more are next in line. For now, get a first look at the original skyline-and-surf artwork.</p>
            <span className="coming-soon">Shop opening later</span>
          </div>
        </div>
      </section>

      <section id="book" className="booking">
        <div className="page-shell booking-grid">
          <div className="booking-copy">
            <p className="eyebrow">Booking &amp; contact</p>
            <h2>Bring the<br />reverb.</h2>
            <p>Shows, festivals, private events, press, and other transmissions. Tell us about the room, date, and idea—we’ll reply to the address you provide.</p>
            <div className="booking-topics" aria-label="Booking inquiry types">
              <span>Venues</span><span>Festivals</span><span>Private events</span><span>Press</span>
            </div>
          </div>

          <form className="booking-form" onSubmit={submitBookingInquiry}>
            <div className="field-row">
              <label>Name<input name="name" autoComplete="name" required /></label>
              <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            </div>
            <label>What’s this about?
              <select name="topic" defaultValue="Booking inquiry">
                <option>Booking inquiry</option>
                <option>Festival</option>
                <option>Private event</option>
                <option>Press</option>
                <option>Something else</option>
              </select>
            </label>
            <label>Message<textarea name="message" rows={5} required /></label>
            <label className="form-honeypot" aria-hidden="true">
              Website<input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <button className="form-submit" type="submit" disabled={formStatus === 'submitting'}>
              {formStatus === 'submitting' ? 'Sending…' : 'Send booking inquiry →'}
            </button>
            <p
              className={`form-message${formStatus === 'error' ? ' is-error' : ''}`}
              role={formStatus === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {formMessage}
            </p>
          </form>
        </div>
      </section>

      <footer className="site-footer section-dark">
        <div className="page-shell footer-inner">
          <a className="footer-mark" href="#home">Johnny Utah</a>
          <ul className="social-links" aria-label="Social links">
            {socialLinks.map(({ href, icon, label }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon icon={icon} size={20} /></a>
              </li>
            ))}
          </ul>
          <p>Salt City Surf Rock</p>
        </div>
      </footer>
    </main>
  )
}

export default App
