import React, { useContext, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/Frontend_Assets/logo.png'
import card_icon from '../Assets/Frontend_Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
const Navbar = () => {

  const [menu,setMenu]=useState("shop")
  const {getTotalCartItems, currentUser, logout} = useContext (ShopContext)
  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>SHOPPER</p>
      </div>
      <ul className='nav-menu'>
        
        <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration:'none'}} to='/mens'>Men</Link>{menu==="mens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration:'none'}} to='/womens'>Woman</Link>{menu==="womens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration:'none'}} to='/kids'>kids</Link>{menu==="kids"?<hr/>:<></>}</li>
        {currentUser && !currentUser.isAdmin && <li onClick={()=>{setMenu("orders")}}><Link style={{textDecoration:'none'}} to='/orders'>Orders</Link>{menu==="orders"?<hr/>:<></>}</li>}
        {currentUser?.isAdmin && <li onClick={()=>{setMenu("admin")}}><Link style={{textDecoration:'none'}} to='/admin'>Admin</Link>{menu==="admin"?<hr/>:<></>}</li>}
      </ul>
      <div className="nav-login-cart">
        {currentUser ? (
          <div className="nav-user">
            <span>{currentUser.username}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button><Link style={{textDecoration:'none'}} to='/login'>Login</Link></button>
        )}
        <Link style={{textDecoration:'none'}} to='/cart'><img src={card_icon} alt="" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar
