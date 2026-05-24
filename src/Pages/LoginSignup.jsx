import React, { useContext, useState } from 'react'
import './CSS/LoginSignup.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'

const LoginSignup = () => {
  const [mode, setMode] = useState('signup');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState('');
  const {signup, login, showNotification} = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prev) => ({...prev, [name]: value}));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');

    if(mode === 'signup' && !agreed){
      setMessage('Please agree to the terms before continuing.');
      showNotification('Please agree to the terms before continuing.', 'error');
      return;
    }

    const result = mode === 'signup' ? signup(formData) : login(formData);

    if(!result.success){
      setMessage(result.message);
      showNotification(result.message, 'error');
      return;
    }

    navigate(result.user?.isAdmin ? '/admin' : redirectTo);
  }

  return (
    <div className='loginsignup'>
      <form className="loginsignup-container" onSubmit={handleSubmit}>
        <h1>{mode === 'signup' ? 'Signup' : 'Login'}</h1>
        <div className="loginsignup-fields">
          {mode === 'signup' && (
            <input
              type="text"
              name="username"
              placeholder='Username'
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type={mode === 'signup' ? 'email' : 'text'}
            name="email"
            placeholder={mode === 'signup' ? 'Email Address' : 'Username or Email'}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
            minLength="4"
          />
        </div>
        {message && <p className="loginsignup-message">{message}</p>}
        <button type="submit">Continue</button>
        {mode === 'signup' ? (
          <p className="loginsignup-login">Already have an account? <span onClick={() => setMode('login')}>Login</span></p>
        ) : (
          <p className="loginsignup-login">New to Shopper? <span onClick={() => setMode('signup')}>Create account</span></p>
        )}
        {mode === 'signup' && (
          <div className="loginsignup-agree">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
            <p>By continuing, i agree to the terms of use & privacy policy.</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default LoginSignup
