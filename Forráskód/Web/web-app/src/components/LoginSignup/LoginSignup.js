import React, {useState} from 'react'
import './LoginSignup.css'

// importing png icons
import user_icon from '../assets/user.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/padlock.png'

// LoginSignup komponens
const LoginSignup = () => {

  const [action,setAction] = useState('Sign Up') // melyik gomb az aktív - action változó

  return (
    <div className='container'>
        <div className='header'>
          <div className='text'>{action}</div>
          <div className='underline'></div>
        </div>
        <div className='inputs'>
          {action === "Log In" ? <div></div>:<div className='input'>
            <img src={user_icon} alt='user' />
            <input type='text' placeholder='Username' />
          </div>}
          <div className='input'>
            <img src={email_icon} alt='email' />
            <input type='email' placeholder='Email' />
          </div>
          <div className='input'>
            <img src={password_icon} alt='password' />
            <input type='password' placeholder='Password' />
          </div>
        </div>
        {/* ha a Sign Up action az aktív akkor nincs forgot password, ha Log In akkor van */}
        {action === "Sign Up" ? <div></div>:<div className='forgot-password'>Forgot Password? <span>Click Here</span></div>} 
        <div className='submit-container'>
          <div className={action === "Sign Up" ? "submit grey" : "submit"} onClick={() => setAction('Sign Up')}>Sign Up</div>
          <div className={action === "Log In" ? "submit grey" : "submit"} onClick={() => setAction('Log In')}>Log In</div>
        </div>
    </div>
  )
}

export default LoginSignup