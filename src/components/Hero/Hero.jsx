import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/Frontend_Assets/hand_icon.png'
import arrow_icon from '../Assets/Frontend_Assets/arrow.png'
import hero_image from '../Assets/Frontend_Assets/hero_image.png'
function Hero() {
  const scrollToCollections = () => {
    document.getElementById('new-collections')?.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <div className='hero'>
      <div className='hero-left'>
        <h2>NEW ARRIVAL ONLY</h2>

        <div>
          <div className="hand-hand-icon">
          <p>New</p>
          <img src={hand_icon} alt="" />
          </div>
          <p>collections</p>
          <p>for everyone</p>

          <button type="button" className='hero-latest-btn' onClick={scrollToCollections}>
            <span>Latest Collection</span>
            <img src={arrow_icon} alt="" />
          </button>
        </div>
      </div>

      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  )
}

export default Hero
