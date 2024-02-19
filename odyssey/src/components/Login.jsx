import React from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./Login.css";

class Login extends React.Component {
  state = {
    errorMessage: "",
  };

  login = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User is signed in, you can navigate to the desired page or handle the user object
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  signUp = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const auth = getAuth();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // User is signed up, you can navigate to the desired page or handle the user object
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.code === "auth/email-already-in-use") {
        this.setState({ errorMessage: "Email is already in use." });
      }
    }
  };

  render() {
    const { errorMessage } = this.state;

    return (
      <div className="login-container1">
        <div className="login-box1">
          <h2 className="login-title1">Login / Sign Up</h2>
          <div>
            <div className="login-text1">Email</div>
            <input
              id="email"
              className="login-input1"
              placeholder="Enter Email.."
              type="text"
            />
          </div>
          <div>
            <div className="login-text1">Password</div>
            <input
              id="password"
              className="login-input1"
              placeholder="Enter Password.."
              type="password"
            />
          </div>
          <button className="login-button1" onClick={this.login}>
            Login
          </button>
          <button className="login-button1" onClick={this.signUp}>
            Sign Up
          </button>
          {errorMessage && <div className="error-message1">{errorMessage}</div>}
        </div>
      </div>
    );
  }
}

export default Login;
