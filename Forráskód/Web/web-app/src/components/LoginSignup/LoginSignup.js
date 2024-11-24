import React, {useState} from 'react';
import './LoginSignup.css';
import AuthService from '../../services/auth.service.js';
import { useNavigate } from 'react-router-dom';

import user_icon from '../assets/user.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/padlock.png';

import showPwd from '../assets/showPwd.png';
import hidePwd from '../assets/hidePwd.png';


const LoginSignup = () => { 
  const navigate = useNavigate();
  const [action, setAction] = useState('Sign Up');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });


/*
A ...formData spread operátor lemásolja az összes meglévő mezőt és értéket
Az [e.target.name] egy dinamikus kulcs, ami az input mező name attribútumának értékét használja
Az e.target.value az új érték, amit a felhasználó beírt
*/
  const handleChange = (e) => { // Ez a függvény kezeli az input mezők változásait
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // e.target.name = "email" e.target.value = "test@example.com"
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.email || !formData.password) {
        alert('Kérlek töltsd ki az összes mezőt!');
        return;
      }
      
      if (action === 'Sign Up' && !formData.username) {
        alert('Kérlek add meg a felhasználóneved!');
        return;
      }
      
      console.log('formData elküldve: ', formData);
      
      if (action === 'Sign Up') {
        const response = await AuthService.register(
          formData.username,
          formData.email, 
          formData.password
        );
        console.log('Sikeres regisztráció!', response);
        alert('Sikeres regisztráció!');
        navigate('/login');
      } else {
        const response = await AuthService.login(
          formData.email,
          formData.password
        );
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          console.log('Sikeres bejelentkezés!', response);
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Hiba történt!', error);
      const errorMessage = error.response?.data?.message || error.message || 'Hiba történt!';
      alert(errorMessage);
    }
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        {action === "Log In" ? <div></div> : 
          <div className='input'>
            <img src={user_icon} alt='user' />
            <input 
              type='text' 
              placeholder='Username'
              name='username'
              value={formData.username}
              onChange={handleChange}
            />
          </div>
        }
        <div className='input'>
          <img src={email_icon} alt='email' />
          <input 
            type='email' 
            placeholder='Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className='input'>
          <img src={password_icon} alt='password' />
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder='Password'
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
          <img 
            src={showPassword ? showPwd : hidePwd} 
            alt={showPassword ? 'hide password' : 'show password'} 
            className='show-pwd' 
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>
      {action === "Sign Up" ? <div></div> : 
        <div className='forgot-password'>Forgot Password? <span>Click Here</span></div>
      }
      <div className='submit-container'>
        <div 
          className={action === "Sign Up" ? "submit grey" : "submit"} 
          onClick={() => {
            if (action !== "Sign Up") {
              setAction("Sign Up");
            } else {
              handleSubmit();
            }
          }}
        >
          Sign Up
        </div>
        <div 
          className={action === "Log In" ? "submit grey" : "submit"} 
          onClick={() => {
            if (action !== "Log In") {
              setAction("Log In");
            } else {
              handleSubmit();
            }
          }}
        >
          Log In
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;