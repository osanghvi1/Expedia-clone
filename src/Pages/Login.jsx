import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import firebase_app from "../01_firebase/config_firebase";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, login_user } from "../Redux/Authantication/auth.action";

const auth = getAuth(firebase_app);
const state = {
  number: "",
  email: "",
  password: "",
  otp: "",
  authType: "email", // 'email' or 'phone'
  verify: false,
};

export const Login = () => {
  const [check, setCheck] = useState(state);
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, activeUser, user } = useSelector((store) => {
    return {
      isAuth: store.LoginReducer.isAuth,
      activeUser: store.LoginReducer.activeUser,
      user: store.LoginReducer.user,
    };
  });

  const { number, email, password, otp, verify, authType } = check;

  let exist = false;
  let data = {};

  for (let i = 0; i <= user.length - 1; i++) {
    if ((authType === 'phone' && user[i].number == number) ||
        (authType === 'email' && user[i].email === email)) {
      exist = true;
      data = user[i];
      break;
    }
  }

  // Handle email login
  const handleEmailLogin = () => {
    console.log("Starting email login process...");
    if (email && password) {
      console.log("Attempting Firebase login with email:", email);
      document.querySelector("#loginMesageSuccess").innerHTML = "Signing in...";
      document.querySelector("#loginMesageError").innerHTML = "";

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Login successful
          console.log("Firebase login successful:", userCredential.user);

          // Find user data from JSON server
          const userData = user.find(u => u.email === email);
          if (userData) {
            console.log("Found user data:", userData);
            dispatch(login_user(userData));
            document.querySelector("#loginMesageSuccess").innerHTML = "Login successful! Redirecting...";
            document.querySelector("#loginMesageError").innerHTML = "";
            setTimeout(() => {
              window.location.href = "/";
            }, 1500);
          } else {
            // User exists in Firebase but not in our local system
            // Create a basic user profile for them
            console.log("User exists in Firebase but not in local system, creating profile...");
            const basicUserData = {
              email: email,
              user_name: userCredential.user.displayName || email.split('@')[0],
              number: "",
              password: "", // Don't store password
              dob: "",
              gender: "",
              marital_status: null,
            };

            dispatch(login_user(basicUserData));
            document.querySelector("#loginMesageSuccess").innerHTML = "Login successful! Please complete your profile.";
            document.querySelector("#loginMesageError").innerHTML = "";
            setTimeout(() => {
              window.location.href = "/";
            }, 1500);
          }
        })
        .catch((error) => {
          console.error("Firebase login error:", error);
          document.querySelector("#loginMesageSuccess").innerHTML = "";

          let errorMessage = "";
          if (error.code === 'auth/user-not-found') {
            errorMessage = "No account found with this email. Please sign up first.";
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = "Incorrect password. Please try again.";
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Please enter a valid email address.";
          } else if (error.code === 'auth/user-disabled') {
            errorMessage = "This account has been disabled. Please contact support.";
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = "Too many failed attempts. Please try again later.";
          } else {
            errorMessage = `Login Error: ${error.message}`;
          }

          document.querySelector("#loginMesageError").innerHTML = errorMessage;
        });
    } else {
      document.querySelector("#loginMesageSuccess").innerHTML = "";
      document.querySelector("#loginMesageError").innerHTML = "Please enter email and password";
    }
  };

  // Handle auth type change
  const handleAuthTypeChange = (type) => {
    setCheck({ ...state, authType: type });
    document.querySelector("#loginMesageError").innerHTML = "";
    document.querySelector("#loginMesageSuccess").innerHTML = "";
  };
  // console.log(user)
  //

  function onCapture() {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          handleVerifyNumber();
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
      },
      auth
    );
  }

  function handleVerifyNumber() {
    console.log("Starting phone login verification for number:", number);
    document.querySelector("#nextText").innerText = "Please wait...";
    onCapture();
    const phoneNumber = `+91${number}`;
    const appVerifier = window.recaptchaVerifier;
    if (number.length === 10) {
      if (exist) {
        console.log("Sending OTP to:", phoneNumber);
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            setCheck({ ...check, verify: true });
            document.querySelector(
              "#loginMesageSuccess"
            ).innerHTML = `Otp Send To ${number} !`;
            document.querySelector("#loginMesageError").innerHTML = "";
            document.querySelector("#nextText").style.display = "none";
            // ...
          })
          .catch((error) => {
            // Error; SMS not sent
            // document.querySelector("#nextText").innerText = "Server Error"
            // ...
          });
      } else {
        document.querySelector("#loginMesageSuccess").innerHTML = ``;
        document.querySelector("#loginMesageError").innerHTML =
          "User does not exist Please Create Your Account !";
          setTimeout(() => {
            window.location="/register"
          }, 2000);
      }
      //
    } else {
      document.querySelector("#loginMesageSuccess").innerHTML = ``;
      document.querySelector("#loginMesageError").innerHTML =
        "Mobile Number is Invalid !";
    }
  }

  //
  function verifyCode() {
    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;

        document.querySelector(
          "#loginMesageSuccess"
        ).innerHTML = `Verifyed Successful`;
        document.querySelector("#loginMesageError").innerHTML = "";

        dispatch(login_user(data));
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        document.querySelector("#loginMesageSuccess").innerHTML = ``;
        document.querySelector("#loginMesageError").innerHTML = "Invalid OTP";
        // ...
      });
  }

  //
  const handleChangeMobile = (e) => {
    let val = e.target.value;
    setCheck({ ...check, [e.target.name]: val });
  };
  // console.log(isAuth)

  useEffect(() => {
    dispatch(fetch_users);
    if (isAuth) {
      window.location = "/";
    }
  }, [isAuth, dispatch]);

  return (
    <>
      <div className="mainLogin">
        <div id="recaptcha-container"></div>
        <div className="loginBx">
        <div className="logoImgdiv"><img className="imglogo" src="https://i.postimg.cc/QxksRNkQ/expedio-Logo.jpg':'https://i.postimg.cc/fRx4D7QH/logo3.png" alt="" /></div>
           
          <div className="loginHead">
          <hr /><hr /><hr />
            <h1>SignIn</h1>
          </div>

          {/* Auth type selection */}
          <div className="loginInputB">
            <label>Choose login method:</label>
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

          {/* Email login form */}
          {authType === 'email' && (
            <>
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
                <button onClick={handleEmailLogin}>Login with Email</button>
              </div>
            </>
          )}

          {/* Phone login form */}
          {authType === 'phone' && (
            <>
              <div className="loginInputB">
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
                    id="nextText"
                  >
                    SignIn
                  </button>
                </span>
              </div>
              {verify && (
                <div className="loginInputB">
                  <label htmlFor="">Enter Your OTP</label>
                  <span>
                    <input
                      type="number"
                      name="otp"
                      value={otp}
                      onChange={(e) => handleChangeMobile(e)}
                    />
                    <button onClick={verifyCode}>Continue</button>
                  </span>
                </div>
              )}
            </>
          )}

          <div className="loginTerms">
            {/* <h2>Or USE ARE BUSSINESS ACCOUNT WITH</h2>
                    <p>By proceeding, you agree to MakeMyTrip'sT&Csand Privacy</p> */}
            <Link to="/register">Don't have an Account</Link>
            <Link to="/admin">Admin Login</Link>
            <div className="inpChecbx"><input className="inp" type="checkbox" /> <h2>Keep me signed in</h2></div>
            <p>Selecting this checkbox will keep you signed into your account on this device until you sign out. Do not select this on shared devices.</p>
            <h6>By signing in, I agree to the Expedia <span> Terms and Conditions</span>, <span>Privacy Statement</span> and <span>Expedia Rewards Terms and Conditions</span>.</h6>
          </div>
          <div id="loginMesageError"></div>
          <div id="loginMesageSuccess"></div>
        </div>
      </div>
    </>
  );
};
