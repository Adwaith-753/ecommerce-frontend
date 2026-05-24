import React, { useContext } from 'react'
import './CSS/Orders.css'
import { Link } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'

const ORDER_STATUSES = [
  'Order Placed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const AdminOrders = () => {
  const {currentUser, orders, updateOrderStatus} = useContext(ShopContext);

  if(!currentUser?.isAdmin){
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <h1>Admin login required</h1>
          <p>Use useradmin with password admin123.</p>
          <Link to="/login">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Admin Orders</h1>
        <p>Check customer orders and update tracking status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No customer orders yet</h2>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-top">
                <div>
                  <h2>{order.id}</h2>
                  <p>{order.username} | {order.userEmail}</p>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <select
                  className="order-status-select"
                  value={order.status}
                  onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
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

export default AdminOrders
