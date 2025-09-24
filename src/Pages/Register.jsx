import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import firebase_app from "../01_firebase/config_firebase";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, userRigister } from "../Redux/Authantication/auth.action";
import Navbar from "../Components/Navbar";

const auth = getAuth(firebase_app);
const state = {
  number: "",
  email: "",
  otp: "",
  user_name: "",
  password: "",
  authType: "email", // 'email' or 'phone'
  verify: false,
  otpVerify: false,
};

export const Register = () => {
  const [check, setCheck] = useState(state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let exist = false;
  const { number, email, otp, verify, otpVerify, user_name, password, authType } = check;

  // store value and getting user to check if the number is exist or not
  const { user, isLoading } = useSelector((store) => {
    return {
      user: store.LoginReducer.user,
      isLoading: store.LoginReducer.isLoading,
    };
  });

  // Note: We only check Firebase for user existence, not local JSON server
  // The exist variable is now only used for phone verification logic

  //  capture
  const handleRegisterUser = () => {
    console.log("Saving user data to JSON server...");
    let newObj = {
      number: authType === 'phone' ? number : "",
      email: authType === 'email' ? email : "",
      user_name,
      password,
      dob: "",
      gender: "",
      marital_status: null,
    };

    console.log("User data to save:", newObj);

    dispatch(userRigister(newObj))
      .then(() => {
        console.log("User saved to JSON server successfully");
        document.querySelector("#loginMesageSuccess").innerHTML = "Registration completed!";
        setCheck(state);
        setTimeout(() => {
          window.location = "/login";
        }, 1500);
      })
      .catch((error) => {
        console.error("Error saving user to JSON server:", error);
        document.querySelector("#loginMesageError").innerHTML = "Error saving user data. Please try again.";
      });
  };

  // Handle email registration - Only checks Firebase, not local JSON server
  const handleEmailRegister = () => {
    console.log("Starting email registration process...");
    if (email && password && user_name) {
      console.log("Attempting to create Firebase user...");
      document.querySelector("#loginMesageSuccess").innerHTML = "Creating account...";
      document.querySelector("#loginMesageError").innerHTML = "";

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Registration successful with Firebase
          console.log("Firebase user created:", userCredential.user);
          setCheck({ ...check, verify: true, otpVerify: true });
          document.querySelector("#loginMesageSuccess").innerHTML = "Account created! Saving user data...";
          document.querySelector("#loginMesageError").innerHTML = "";

          // Now save to our JSON server
          handleRegisterUser();
        })
        .catch((error) => {
          console.error("Firebase registration error:", error);
          document.querySelector("#loginMesageSuccess").innerHTML = ``;

          let errorMessage = "";
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email is already registered. Please try logging in instead or use a different email.";
            // Optionally redirect to login after a delay
            setTimeout(() => {
              window.location = "/login";
            }, 3000);
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Please enter a valid email address.";
          } else if (error.code === 'auth/weak-password') {
            errorMessage = "Password is too weak. Please use a stronger password.";
          } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = "Email/password accounts are not enabled. Please contact support.";
          } else {
            errorMessage = `Registration Error: ${error.message}`;
          }

          document.querySelector("#loginMesageError").innerHTML = errorMessage;
        });
    } else {
      document.querySelector("#loginMesageSuccess").innerHTML = ``;
      document.querySelector("#loginMesageError").innerHTML = "Please fill all fields";
    }
  };

  // Handle auth type change
  const handleAuthTypeChange = (type) => {
    setCheck({ ...state, authType: type });
    document.querySelector("#loginMesageError").innerHTML = "";
    document.querySelector("#loginMesageSuccess").innerHTML = "";
  };

  // Initialize reCAPTCHA
  function initializeRecaptcha() {
    console.log("Initializing reCAPTCHA...");

    // Clear any existing reCAPTCHA
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
          document.querySelector("#loginMesageError").innerHTML = "reCAPTCHA expired. Please try again.";
        }
      },
      auth
    );
  }

  //   Verify button for phone registration
  function handleVerifyNumber() {
    console.log("Starting phone verification for number:", number);
    document.querySelector("#nextButton").innerText = "Please wait...";
    document.querySelector("#loginMesageError").innerHTML = "";
    document.querySelector("#loginMesageSuccess").innerHTML = "";

    const phoneNumber = `+91${number}`;

    if (number.length !== 10) {
      document.querySelector("#loginMesageSuccess").innerHTML = ``;
      document.querySelector("#loginMesageError").innerHTML = "Please enter a valid 10-digit mobile number";
      document.querySelector("#nextButton").innerText = "Next";
      return;
    }

    // Initialize reCAPTCHA
    initializeRecaptcha();

    console.log("Sending OTP to:", phoneNumber);
    document.querySelector("#loginMesageSuccess").innerHTML = "Sending OTP...";

    signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
      .then((confirmationResult) => {
        console.log("SMS sent successfully:", confirmationResult);
        window.confirmationResult = confirmationResult;
        setCheck({ ...check, verify: true });
        document.querySelector("#loginMesageSuccess").innerHTML = `OTP sent to ${number}!`;
        document.querySelector("#loginMesageError").innerHTML = "";
        document.querySelector("#nextButton").style.display = "none";
      })
      .catch((error) => {
        console.error("SMS sending error:", error);
        document.querySelector("#loginMesageSuccess").innerHTML = "";

        let errorMessage = "Failed to send OTP. ";
        if (error.code === 'auth/invalid-phone-number') {
          errorMessage += "Invalid phone number format.";
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage += "Too many requests. Please try again later.";
        } else if (error.code === 'auth/captcha-check-failed') {
          errorMessage += "reCAPTCHA verification failed.";
        } else {
          errorMessage += error.message;
        }

        document.querySelector("#loginMesageError").innerHTML = errorMessage;
        document.querySelector("#nextButton").innerText = "Next";

        // Clear reCAPTCHA on error
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }
      });
  }

  // Verify OTP code
  function verifyCode() {
    if (!otp || otp.length !== 6) {
      document.querySelector("#loginMesageSuccess").innerHTML = "";
      document.querySelector("#loginMesageError").innerHTML = "Please enter a valid 6-digit OTP";
      return;
    }

    console.log("Verifying OTP:", otp);
    document.querySelector("#loginMesageSuccess").innerHTML = "Verifying OTP...";
    document.querySelector("#loginMesageError").innerHTML = "";

    if (!window.confirmationResult) {
      document.querySelector("#loginMesageSuccess").innerHTML = "";
      document.querySelector("#loginMesageError").innerHTML = "OTP session expired. Please request a new OTP.";
      return;
    }

    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        // User signed in successfully with Firebase
        console.log("OTP verified successfully:", result.user);
        setCheck({ ...check, otpVerify: true });
        document.querySelector("#loginMesageSuccess").innerHTML = "OTP verified successfully!";
        document.querySelector("#loginMesageError").innerHTML = "";
        document.querySelector("#loginNumber").style.display = "none";
        document.querySelector("#loginOtp").style.display = "none";
      })
      .catch((error) => {
        console.error("OTP verification error:", error);
        document.querySelector("#loginMesageSuccess").innerHTML = "";

        let errorMessage = "OTP verification failed. ";
        if (error.code === 'auth/invalid-verification-code') {
          errorMessage += "Invalid OTP. Please check the code and try again.";
        } else if (error.code === 'auth/code-expired') {
          errorMessage += "OTP has expired. Please request a new one.";
        } else {
          errorMessage += error.message;
        }

        document.querySelector("#loginMesageError").innerHTML = errorMessage;
      });
  }

  // setting the typed value to the input state
  const handleChangeMobile = (e) => {
    let val = e.target.value;
    setCheck({ ...check, [e.target.name]: val });
  };

  useEffect(() => {
    dispatch(fetch_users);
  }, [dispatch]);

  return (
    <>
      <div className="mainLogin">
        <div id="recaptcha-container"></div>
        <div className="loginBx">
        <div className="logoImgdivReg"><img className="imglogoReg" src="https://i.postimg.cc/QxksRNkQ/expedio-Logo.jpg':'https://i.postimg.cc/fRx4D7QH/logo3.png" alt="" /></div>

          <div className="loginHead">
          <hr /><hr /><hr />

            <h1>Register</h1>
          </div>

          {/* Auth type selection */}
          <div className="loginInputB">
            <label>Choose registration method:</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => handleAuthTypeChange('email')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: authType === 'email' ? '#0066cc' : '#ccc',
                  color: authType === 'email' ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => handleAuthTypeChange('phone')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: authType === 'phone' ? '#0066cc' : '#ccc',
                  color: authType === 'phone' ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Phone Number
              </button>
            </div>
          </div>

          {/* Email registration form */}
          {authType === 'email' && (
            <>
              <div className="loginInputB">
                <label htmlFor="">Enter Your Full Name</label>
                <span>
                  <input
                    type="text"
                    name="user_name"
                    value={user_name}
                    onChange={(e) => handleChangeMobile(e)}
                    placeholder="Full Name"
                  />
                </span>
              </div>
              <div className="loginInputB">
                <label htmlFor="">Enter Your Email</label>
                <span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => handleChangeMobile(e)}
                    placeholder="Email"
                  />
                </span>
              </div>
              <div className="loginInputB">
                <label htmlFor="">Enter Your Password</label>
                <span>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => handleChangeMobile(e)}
                    placeholder="Password"
                  />
                </span>
              </div>
              <div className="loginInputB">
                <button onClick={handleEmailRegister}>Register with Email</button>
              </div>
            </>
          )}

          {/* Phone registration form */}
          {authType === 'phone' && (
            <>
              <div className="loginInputB" id="loginNumber">
                <label htmlFor="">Enter Your Number</label>
                <span>
                  <input
                    type="number"
                    readOnly={verify}
                    name="number"
                    value={number}
                    onChange={(e) => handleChangeMobile(e)}
                    placeholder="Number"
                  />
                  <button
                    disabled={verify}
                    onClick={handleVerifyNumber}
                    id="nextButton"
                  >
                    Next
                  </button>
                </span>
              </div>
              {verify && (
                <div className="loginInputB" id="loginOtp">
                  <label htmlFor="">Enter OTP</label>
                  <span>
                    <input
                      type="number"
                      name="otp"
                      value={otp}
                      onChange={(e) => handleChangeMobile(e)}
                    />
                    <button onClick={verifyCode}>Verify OTP</button>
                  </span>
                </div>
              )}

              {otpVerify && (
                <>
                  <div className="loginInputB">
                    <label htmlFor="">Enter Your Full name</label>
                    <span>
                      <input
                        type="text"
                        name="user_name"
                        value={user_name}
                        onChange={(e) => handleChangeMobile(e)}
                      />
                    </span>
                  </div>
                  <div className="loginInputB">
                    <label htmlFor="">Your Password</label>
                    <span>
                      <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => handleChangeMobile(e)}
                      />
                    </span>
                  </div>
                  <div className="loginInputB">
                    <button onClick={handleRegisterUser}>Complete Registration</button>
                  </div>
                </>
              )}
            </>
          )}

          {isLoading ? <h1>Please wait...</h1> : ""}

          <div className="loginTerms">
          <div className="inpChecbx"><input className="inp" type="checkbox" /> <h2>Keep me signed in</h2></div>
            <p>Selecting this checkbox will keep you signed into your account on this device until you sign out. Do not select this on shared devices.</p>
            <h6>By signing in, I agree to the Expedia <span> Terms and Conditions</span>, <span>Privacy Statement</span> and <span>Expedia Rewards Terms and Conditions</span>.</h6>
          </div>
          <br />
          <div id="loginMesageError"></div>
          <div id="loginMesageSuccess"></div>
        </div>
      </div>
    </>
  );
};
