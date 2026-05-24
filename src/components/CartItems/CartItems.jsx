import React, { useContext, useMemo, useState } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/Frontend_Assets/cart_cross_icon.png'
import { useNavigate } from 'react-router-dom';

const PROMO_CODES = {
    SAVE10: {
        label: '10% off',
        getDiscount: (subtotal) => Math.round(subtotal * 0.1),
    },
    SHOP20: {
        label: '20% off',
        getDiscount: (subtotal) => Math.round(subtotal * 0.2),
    },
    FLAT50: {
        label: '$50 off',
        getDiscount: (subtotal) => Math.min(50, subtotal),
    },
};

const CartItems = () => {
    const{getTotalCartAmount,all_product, cartItems, removeFromCart, currentUser, placeOrder, showNotification} = useContext(ShopContext);
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoMessage, setPromoMessage] = useState('');
    const navigate = useNavigate();
    const subtotal = getTotalCartAmount();
    const promoDiscount = useMemo(() => {
        if(!appliedPromo){
            return 0;
        }

        return PROMO_CODES[appliedPromo].getDiscount(subtotal);
    }, [appliedPromo, subtotal]);
    const cartTotal = Math.max(subtotal - promoDiscount, 0);

    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase();

        if(!code){
            setPromoMessage('Enter a promo code first.');
            setAppliedPromo(null);
            showNotification('Enter a promo code first.', 'error');
            return;
        }

        if(!PROMO_CODES[code]){
            setPromoMessage('Invalid promo code.');
            setAppliedPromo(null);
            showNotification('Invalid promo code.', 'error');
            return;
        }

        if(subtotal <= 0){
            setPromoMessage('Add items before applying a promo code.');
            setAppliedPromo(null);
            showNotification('Add items before applying a promo code.', 'error');
            return;
        }

        setAppliedPromo(code);
        setPromoInput(code);
        setPromoMessage(`${code} applied: ${PROMO_CODES[code].label}`);
        showNotification(`${code} promo applied`);
    }

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoInput('');
        setPromoMessage('Promo code removed.');
        showNotification('Promo code removed', 'info');
    }

    const handleCheckout = () => {
        if(subtotal <= 0){
            showNotification('Your cart is empty.', 'error');
            return;
        }

        if(!currentUser){
            showNotification('Please login before checkout.', 'error');
            navigate('/login', {state: {from: '/cart'}});
            return;
        }

        const result = placeOrder(appliedPromo ? {
            code: appliedPromo,
            discount: promoDiscount,
            total: cartTotal,
        } : null);

        if(!result.success){
            showNotification(result.message, 'error');
            return;
        }

        navigate('/orders');
    }

  return (
    <div className="cartitems">
        <div className="cartitems-format-main">
            <p>Product</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
        <hr />
         {all_product.map((e)=>{
                if(cartItems[e.id] > 0){
                    return <div key={e.id}>
                    <div className="cartitems-format cartitems-format-main">
                        <img src={e.image} alt="" className="carticon-product-icon " />
                        <p>{e.name}</p>
                        <p>${e.new_price}</p>
                        <button type="button" className='cartitems-quantity'>{cartItems[e.id]}</button>
                        <p>${(e.new_price * cartItems[e.id])}</p>
                        <img className="cartitems-remove-icon" src={remove_icon} onClick={() => removeFromCart(e.id)} alt=""/>
                </div>
                <hr />
                </div>
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Total</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className='cartitems-total-item'>
                            <p>Shipping Fee</p>
                            <p>free</p>
                        </div>
                        {appliedPromo && (
                            <>
                                <hr />
                                <div className='cartitems-total-item cartitems-discount'>
                                    <p>Promo ({appliedPromo})</p>
                                    <p>-${promoDiscount}</p>
                                </div>
                            </>
                        )}
                        <hr />
                        <div className='cartitems-total-item'>
                            <h3>Total</h3>
                            <h3>${cartTotal}</h3>
                        </div>
                    </div>
                    {!currentUser && <p className="cartitems-login-note">Login first to continue checkout.</p>}
                    <button className='cartitems-checkout' onClick={handleCheckout}>Proceed to Checkout</button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, enter it here:</p>
                    <div className="cartitems-promobox">
                        <input
                            type="text"
                            placeholder='Enter your code'
                            value={promoInput}
                            onChange={(event) => setPromoInput(event.target.value)}
                        />
                        <button type="button" onClick={handleApplyPromo}>Submit</button>
                    </div>
                    {promoMessage && <p className={appliedPromo ? 'cartitems-promo-success' : 'cartitems-promo-error'}>{promoMessage}</p>}
                    {appliedPromo && <button type="button" className="cartitems-remove-promo" onClick={handleRemovePromo}>Remove promo</button>}
                </div>
            </div>
    </div>
  )
}

export default CartItems
