import './App.css'

import bgVideo from './assets/jubackground.mov'

import Icon from './components/Icon'
import FacebookIcon from './assets/facebook.svg?react'
import InstagramIcon from './assets/instagram.svg?react'
import SpotifyIcon from './assets/spotify.svg?react'
import YouTubeIcon from './assets/youtube.svg?react'

const socialLinks = [
  {
    href: 'https://www.facebook.com/johnnyutahband',
    icon: FacebookIcon,
    label: 'Facebook',
  },
  {
    href: 'https://www.instagram.com/johnnyutahband',
    icon: InstagramIcon,
    label: 'Instagram',
  },
  {
    href: 'https://open.spotify.com/artist/3UMwzIY5BTbaL0x2RZ5Ukh',
    icon: SpotifyIcon,
    label: 'Spotify',
  },
  {
    href: 'https://www.youtube.com/@johnnyutah8544',
    icon: YouTubeIcon,
    label: 'YouTube',
  },
];

function App() {
  return (
    <>
      <section id="home" className="hero">
        <video autoPlay muted loop playsInline className="bg-video">
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="content">
          <h1 className="title">Johnny Utah</h1>
          <nav className="main-nav">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#music">Music</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#videos">Videos</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
          <ul className="social-links" role="list">
            {socialLinks.map(({ href, icon, label }) => (
              <li key={label}>
                <a
                  aria-label={`Visit us on ${label}`}
                  className="social-link"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon icon={icon} />
                </a>
              </li>
            ))}
          </ul>
          <p>New album out now!</p>
        </div>
      </section>
      <section id="about"> ... </section>
      <section id="music"> ... </section>
      <section id="events"> ... </section>
      <section id="videos"> ... </section>
      <section id="contact"> ... </section>

      <section className="more-content">
        <p>Here's the rest of the site...</p>
      </section>
    </>
  )
}

export default App
