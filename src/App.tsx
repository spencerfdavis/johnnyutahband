import './App.css'

import bgVideo from './assets/jubackground.mov'

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
