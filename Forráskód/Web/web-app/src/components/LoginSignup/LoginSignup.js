import React, {useState} from 'react';
import './LoginSignup.css';
import AuthService from '../../services/auth.service.js';
import { useNavigate } from 'react-router-dom';

// ikonok a login formhoz
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
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });


/*
A ...formData spread operátor lemásolja az összes meglévő mezőt és értéket
Az [e.target.name] egy dinamikus kulcs, ami az input mező name attribútumának értékét használja
Az e.target.value az új érték, amit a felhasználó beírt
*/
  const handleChange = (e) => { // Ez a függvény kezeli az input mezk változásait
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // e.target.name = "email", e.target.value = "test@example.com"
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      password: ''
    };

    // Email validáció
    try {
      AuthService.validateEmail(formData.email);
    } catch (error) {
      newErrors.email = error.message;
      isValid = false;
    }

    // Jelszó validáció
    try {
      AuthService.validatePassword(formData.password);
    } catch (error) {
      newErrors.password = error.message;
      isValid = false;
    }

    // Username validáció (csak regisztrációnál)
    if (action === 'Sign Up') {
      try {
        AuthService.validateUsername(formData.username);
      } catch (error) {
        newErrors.username = error.message;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (action === 'Sign Up') {
        const response = await AuthService.register(
          formData.username,
          formData.email,
          formData.password
        );
        console.log('Sikeres regisztráció!', response);
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
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes('email')) {
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.includes('jelszó')) {
        setErrors(prev => ({ ...prev, password: errorMessage }));
      } else if (errorMessage.includes('felhasználónév')) {
        setErrors(prev => ({ ...prev, username: errorMessage }));
      }
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
          <div class="input-container">
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
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
        }
        <div class="input-container">
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
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div class="input-container">
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