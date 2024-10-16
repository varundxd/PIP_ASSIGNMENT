import { Link, useNavigate} from "react-router-dom";
import Header from "./Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../constants";



function Register() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [mobile, setmobile] = useState("");
  const [usernameValidation, setUsernameValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [mobileValidation, setMobileValidation] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    validateInput();
  }, [username, password,  email, mobile]);
  


  const validateInput = () => {
    // Validate username
    setUsernameValidation(
      username.length > 0 ? "is-valid" : "is-invalid"
    );

    // Validate password
    setPasswordValidation(
      password.length > 0 ? "is-valid" : "is-invalid"
    );

    // Validate email
    setEmailValidation(validateEmail(email) ? "is-valid" : "is-invalid");

    // Validate mobile
    setMobileValidation(
      validateMobile(mobile) ? "is-valid" : "is-invalid"
    );
  };
  const validatePassword = (password) => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  };
  
  useEffect(() => {
    setPasswordValidation(validatePassword(password) ? "is-valid" : "is-invalid");
  }, [password]);
  
  const validateEmail = (email) => {
    return email.includes("@");
  };

  const validateMobile = (mobile) => {
    return /^\+?\d+$/.test(mobile);
  };

  const handleApi = () => {
    validateInput();

    if (
      usernameValidation === "is-valid" &&
      passwordValidation === "is-valid" &&
      emailValidation === "is-valid" &&
      mobileValidation === "is-valid"
    ) {
      console.log({ username, password});
      const url = API_URL + "/register";
      const data = { username, password, mobile, email};
      axios
        .post(url, data)
        .then((res) => {
          if (res.data.message) {
            alert(res.data.message);
            navigate("/login");
          }
        })
        .catch((err) => {
          alert("SERVER ERR");
        });
    } else {
      alert("Please fill out all required fields correctly.");
    }
  };
  const handleSendOtp = () => {
    axios.post(API_URL + "/sendotp", { mobile })
      .then(response => {
        setOtpSent(true);
      })
      .catch(error => {
        console.error("Error sending OTP:", error);
        setError("Error sending OTP. Please try again later.");
      });
  };
  const handleVerifyOtp = () => {
    axios.post(API_URL + "/verifyotp", { mobile, otp: enteredOtp })
      .then(response => {
        console.log("OTP verification response:", response.data);
        // Assuming response.data.status contains the verification status
        if (response.data.status === "approved") {
          console.log("OTP verified!");
          // Proceed with signup
        } else {
          setError("Invalid OTP. Please try again.");
        }
      })
      .catch(error => {
        console.error("Error verifying OTP:", error);
        setError("Error verifying OTP. Please try again later.");
      });
  };
  
  return (
    <div className="signup-container">
      <Header />
      <div className="singup-form p-3 m-3">
        <h3> Welcome to Register Page </h3>
        USERNAME
        <input
          className={`fr form-control ${usernameValidation}`}
          type="text"
          value={username}
          onChange={(e) => {
            setusername(e.target.value);
          }}
        />
        {usernameValidation === "is-invalid" && (
          <div className="in invalid-feedback">Username is required.</div>
        )}
        <br></br>
        MOBILE
        <input
          className={`fr form-control ${mobileValidation}`}
          type="text"
          value={mobile}
          onChange={(e) => {
            setmobile(e.target.value);
          }}
        />
        {mobileValidation === "is-invalid" && (
          <div className="in invalid-feedback">Mobile is required.</div>
        )}
        <br></br>
        <div>
        <button onClick={handleSendOtp} className="button-79">Send OTP</button>
        {otpSent &&
          <>
            <input
            className='fr form-control'
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp} className="button-79">Verify OTP</button>
          </>
        }
        </div>
        <br></br>
        EMAIL
        <input
          className={`fr form-control ${emailValidation}`}
          type="text"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
        />
        {emailValidation === "is-invalid" && (
          <div className="in invalid-feedback">Valid email is required.</div>
        )}
        <br></br>
        PASSWORD
        <input
          className={`fr form-control ${passwordValidation}`}
          type="password"
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
          }}
        />
        {passwordValidation === "is-invalid" && (
          <div className="in invalid-feedback">Password is required.</div>
        )}
  
        <button onClick={handleApi} className="button-79">
          REGISTER
        </button>
  <span>
        <Link className="lof" to="/login">
          {" "}
          LOGIN{" "}
        </Link>
</span>
      </div>
    </div>
  );
}

export default Register;
