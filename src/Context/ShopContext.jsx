import React, { createContext, useEffect, useState } from 'react'
import all_product from '../components/Assets/Frontend_Assets/all_product'

export const ShopContext = createContext(null);

const USERS_STORAGE_KEY = 'shopper_users';
const CURRENT_USER_STORAGE_KEY = 'shopper_current_user';
const GUEST_CART_STORAGE_KEY = 'shopper_guest_cart';
const ORDERS_STORAGE_KEY = 'shopper_orders';
const ADMIN_USER = {
  username: 'useradmin',
  email: 'useradmin',
  password: 'admin123',
  isAdmin: true,
};

const getUserCartStorageKey = (email) => `shopper_cart_${email}`;

const getDefaultCart = () => {
    let cart = {};
    for(let index=1; index<=all_product.length; index++){
      cart[index] = 0;
    }
    return cart;
}

const getStoredJson = (key, fallback) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (error) {
    return fallback;
  }
}

const getSavedCart = (user) => {
  const key = user ? getUserCartStorageKey(user.email) : GUEST_CART_STORAGE_KEY;
  return {...getDefaultCart(), ...getStoredJson(key, {})};
}

const ShopContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(() => getStoredJson(CURRENT_USER_STORAGE_KEY, null));
  const [cartItems, setCartItems] = useState(() => getSavedCart(getStoredJson(CURRENT_USER_STORAGE_KEY, null)));
  const [orders, setOrders] = useState(() => getStoredJson(ORDERS_STORAGE_KEY, []));
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const key = currentUser ? getUserCartStorageKey(currentUser.email) : GUEST_CART_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, currentUser]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const showNotification = (message, type = 'success') => {
    setNotification({message, type, id: Date.now()});
  }

  const hideNotification = () => {
    setNotification(null);
  }

  const addToCart = (itemId) => {
    const product = all_product.find((item) => item.id === itemId);
    setCartItems((prev) => ({...prev, [itemId]: (prev[itemId] || 0) + 1}));
    showNotification(`${product?.name || 'Item'} added to cart`);
  }

  const removeFromCart = (itemId) => {
    const product = all_product.find((item) => item.id === itemId);
    setCartItems((prev) => ({...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0)}));
    showNotification(`${product?.name || 'Item'} removed from cart`, 'info');
  }

  const getTotalCartAmount = () => {
      let totalAmount = 0;
      for(const item in cartItems){
        if(cartItems[item] > 0){
          let itemInfo = all_product.find((product) => product.id === Number(item));
          if(itemInfo){
            totalAmount += cartItems[item] * itemInfo.new_price;
          }
        }
      }
      return totalAmount;
  }

  const getTotalCartItems = () => {
    let totalItems = 0;
    for(const item in cartItems){
      if(cartItems[item] > 0){
        totalItems += cartItems[item];
      }
    }
    return totalItems;
  }

  const signup = ({username, email, password}) => {
    const users = getStoredJson(USERS_STORAGE_KEY, []);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    if(normalizedUsername === ADMIN_USER.username || normalizedEmail === ADMIN_USER.email){
      return {success: false, message: 'This account name is reserved.'};
    }

    if(users.some((user) => user.email === normalizedEmail || user.username.toLowerCase() === normalizedUsername)){
      return {success: false, message: 'An account with this email already exists.'};
    }

    const newUser = {
      username: username.trim(),
      email: normalizedEmail,
      password,
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
    localStorage.setItem(getUserCartStorageKey(normalizedEmail), JSON.stringify(getDefaultCart()));
    setCurrentUser(newUser);
    setCartItems(getDefaultCart());
    showNotification(`Welcome, ${newUser.username}`);

    return {success: true, user: newUser};
  }

  const login = ({email, password}) => {
    const users = getStoredJson(USERS_STORAGE_KEY, []);
    const loginId = email.trim().toLowerCase();
    const availableUsers = [ADMIN_USER, ...users];
    const matchedUser = availableUsers.find((user) => {
      const username = user.username.toLowerCase();
      const userEmail = user.email.toLowerCase();
      return (username === loginId || userEmail === loginId) && user.password === password;
    });

    if(!matchedUser){
      return {success: false, message: 'Invalid email or password.'};
    }

    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(matchedUser));
    setCurrentUser(matchedUser);
    setCartItems(getSavedCart(matchedUser));
    showNotification(`Logged in as ${matchedUser.username}`);

    return {success: true, user: matchedUser};
  }

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setCurrentUser(null);
    setCartItems(getSavedCart(null));
    showNotification('Logged out successfully', 'info');
  }

  const getCartProducts = () => {
    return all_product
      .filter((product) => cartItems[product.id] > 0)
      .map((product) => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.new_price,
        quantity: cartItems[product.id],
        total: product.new_price * cartItems[product.id],
      }));
  }

  const placeOrder = (promo = null) => {
    if(!currentUser){
      return {success: false, message: 'Please login before checkout.'};
    }

    const items = getCartProducts();

    if(items.length === 0){
      return {success: false, message: 'Your cart is empty.'};
    }

    const order = {
      id: `ORD-${Date.now()}`,
      userEmail: currentUser.email,
      username: currentUser.username,
      items,
      subtotal: getTotalCartAmount(),
      discount: promo?.discount || 0,
      promoCode: promo?.code || '',
      amount: promo?.total || getTotalCartAmount(),
      status: 'Order Placed',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [order, ...prev]);
    setCartItems(getDefaultCart());
    showNotification('Order placed successfully');

    return {success: true, order};
  }

  const updateOrderStatus = (orderId, status) => {
    if(!currentUser?.isAdmin){
      return;
    }

    setOrders((prev) => prev.map((order) => (
      order.id === orderId ? {...order, status} : order
    )));
    showNotification(`Order status updated to ${status}`);
  }

  const getCurrentUserOrders = () => {
    if(!currentUser){
      return [];
    }

    return orders.filter((order) => order.userEmail === currentUser.email);
  }

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    currentUser,
    signup,
    login,
    logout,
    orders,
    placeOrder,
    updateOrderStatus,
    getCurrentUserOrders,
    notification,
    showNotification,
    hideNotification,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider;
