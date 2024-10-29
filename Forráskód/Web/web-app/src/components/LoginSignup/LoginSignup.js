import React, {useState} from 'react';
import './LoginSignup.css';
import AuthService from '../../services/auth.service.js';

import user_icon from '../assets/user.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/padlock.png';

const LoginSignup = () => {
  const [action, setAction] = useState('Sign Up');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      console.log('formData elküldve: ', formData);
      if (action === 'Sign Up') {
        const response = await AuthService.register(formData.username, formData.email, formData.password);
        console.log('Sikeres regisztráció!', response);
        alert('Sikeres regisztráció!');
      } else {
        const response = await AuthService.login(formData.email, formData.password);
        console.log('Sikeres bejelentkezés!', response);
        alert('Sikeres bejelentkezés!');
      }
    } catch (error) {
      console.error('Hiba történt!', error);
      alert(error.message || 'Hiba történt!');
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
            type='password' 
            placeholder='Password'
            name='password'
            value={formData.password}
            onChange={handleChange}
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