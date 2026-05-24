import React, { useContext } from 'react'
import './CSS/Orders.css'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'

const Orders = () => {
  const {currentUser, getCurrentUserOrders} = useContext(ShopContext);
  const navigate = useNavigate();

  if(!currentUser){
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <h1>Login to track orders</h1>
          <button onClick={() => navigate('/login', {state: {from: '/orders'}})}>Login</button>
        </div>
      </div>
    )
  }

  const userOrders = getCurrentUserOrders();

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track your placed items and delivery status.</p>
      </div>

      {userOrders.length === 0 ? (
        <div className="orders-empty">
          <h2>No orders yet</h2>
          <Link to="/">Continue Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {userOrders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-top">
                <div>
                  <h2>{order.id}</h2>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className="order-status">{order.status}</span>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <strong>${item.total}</strong>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div>
                  {order.promoCode && <p>Promo {order.promoCode}: -${order.discount}</p>}
                  <span>Total</span>
                </div>
                <strong>${order.amount}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
