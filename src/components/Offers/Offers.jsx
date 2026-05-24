import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/Frontend_Assets/exclusive_image.png'
import { useNavigate } from 'react-router-dom'
const Offers = () => {
  const navigate = useNavigate();

  return (
  <div className='offers'>
    <div className="offers-left">
      <h1>Exclusive</h1>
      <h1>OFFER FOR YOU</h1>
      <p>ONLY ON BEST SELLERS PRODUCTS</p>
      <button type="button" onClick={() => navigate('/mens')}>Check Now</button>
    </div>
    <div className="offers_right">
      <img src={exclusive_image} alt="" />  
    </div>
    
  </div>

  )
}

export default Offers
