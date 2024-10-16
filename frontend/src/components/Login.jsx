import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";


function Login() {
  const navigate = useNavigate();
  const captchaRef = useRef();
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState('');
  const [passwordValidation, setPasswordValidation] = useState('');
  const [captchaValidation, setCaptchaValidation] = useState('');
  const isFormValid = usernameValidation === 'is-valid' && passwordValidation === 'is-valid' && captchaValidation === 'is-valid';
  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const captchaValue = Array.from({ length: 6 }, () =>
      characters[Math.floor(Math.random() * characters.length)]
    ).join("");

    const randomBackgroundColor = getRandomColor();
    const textColor = getContrastColor(randomBackgroundColor);

    captchaRef.current.style.backgroundColor = randomBackgroundColor;
    captchaRef.current.style.color = textColor;

    setCaptcha(captchaValue);
    setIsCaptchaVerified(false);
    setCaptchaValidation('');
  };
  const validateInput = () => {
    console.log('Validating input...', { username, password, captcha, userCaptcha });
    // Validate username
    setUsernameValidation(username.length > 0 ? 'is-valid' : 'is-invalid');
  
    // Validate password
    setPasswordValidation(password.length > 0 ? 'is-valid' : 'is-invalid');
  
    // Validate captcha
    setCaptchaValidation(userCaptcha.toLowerCase() === captcha.toLowerCase() ? 'is-valid' : 'is-invalid');
    console.log('Validation results:', { usernameValidation, passwordValidation, captchaValidation });
  };
  
  
  useEffect(() => {
    console.log('useEffect triggered:', { username, password, captcha, userCaptcha });
    validateInput();
  }, [username, password, captcha, userCaptcha]);

  const verifyCaptcha = () => {
    validateInput();

    if (captcha === userCaptcha) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(false);
      alert("Incorrect captcha. Please try again.");
    }
  };

const handleApi = () => {
    validateInput();
  
    if (usernameValidation === 'is-valid' && passwordValidation === 'is-valid' && captchaValidation === 'is-valid') {
      const url = "http://localhost:4000/login";
      const data = { username, password, captcha, userCaptcha };
  
      axios.post(url, data)
        .then((res) => {
          if (res.data.message) {
            alert(res.data.message);
            if (res.data.token) {
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('userId', res.data.userId);
              localStorage.setItem('username',username);
              navigate('/');
            }
          }
        })
        .catch((err) => {
          console.log(err); // Log the error to the console
          alert('Failed to log in. Please try again.'); // Show a user-friendly error message
        });
    } else {
      alert('Please fill out all required fields correctly.');
    }
  };
  

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getContrastColor = (hexColor) => {
    const threshold = 130;
    const [r, g, b] = hexColor.match(/\w\w/g).map(x => parseInt(x, 16));
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > threshold ? "#000000" : "#FFFFFF";
  };

  return (
    <div>
    <div className="login-container">
     <Header />
      <div className="login-form">
        <div className={`mb-3 ${usernameValidation}`}>
  <label>USERNAME</label>
  <input
    type="text"
    className={`fr1 form-control ${usernameValidation}`} // Add Bootstrap form-control class
    value={username}
    onChange={(e) => setusername(e.target.value)}
    onFocus={validateInput}
  />
  {usernameValidation === 'is-invalid' && <div className="invalid-feedback">Please enter a username.</div>}
</div>

<div className={`mb-3 ${passwordValidation}`}>
  <label>PASSWORD</label>
  <input
    type="password"
    className={`fr1 form-control ${passwordValidation}`} // Add Bootstrap form-control class
    value={password}
    onChange={(e) => setpassword(e.target.value)}
    onFocus={validateInput}
  />
  {passwordValidation === 'is-invalid' && <div className="invalid-feedback">Please enter a password.</div>}
</div>

<div className={`un mb-3 ${captchaValidation}`}>
  <label>Captcha:  <span ref={captchaRef} id="captcha">{captcha}</span></label>
  <input
    type="text"
    className={`fr1 form-control ${captchaValidation}`} // Add Bootstrap form-control class
    value={userCaptcha}
    onChange={(e) => setUserCaptcha(e.target.value)}
    onFocus={validateInput}
  />
  {captchaValidation === 'is-invalid' && <div className="invalid-feedback">Please enter the correct captcha.</div>}
  <button onClick={verifyCaptcha}>Verify Captcha</button>
  <button onClick={generateCaptcha}>Generate New Captcha</button>
</div>
        <button 
        // id="unique" 
        class="button-64" role="button"
        onClick={handleApi} disabled={!isCaptchaVerified}>
          <button onClick={handleApi} disabled={!isFormValid || !isCaptchaVerified}>
  LOGIN
</button>
        </button>
        <Link className="s" to="/register"><span className="button-59" role="button">REGISTER</span></Link>
      </div>
    </div>
    </div>
  );
}

export default Login;
