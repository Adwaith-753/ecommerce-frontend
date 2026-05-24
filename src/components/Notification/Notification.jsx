import React, { useContext, useEffect } from 'react'
import './Notification.css'
import { ShopContext } from '../../Context/ShopContext'

const Notification = () => {
  const {notification, hideNotification} = useContext(ShopContext);

  useEffect(() => {
    if(!notification){
      return;
    }

    const timer = setTimeout(() => {
      hideNotification();
    }, 2500);

    return () => clearTimeout(timer);
  }, [notification, hideNotification]);

  if(!notification){
    return null;
  }

  return (
    <div className={`notification notification-${notification.type}`}>
      <p>{notification.message}</p>
      <button type="button" onClick={hideNotification}>x</button>
    </div>
  )
}

export default Notification
