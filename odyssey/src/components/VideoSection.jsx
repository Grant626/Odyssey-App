import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import "./VideoSection.css";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../config/config";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Login from "./Login";

const VideoSection = () => {
  const [authorized, setAuthorized] = useState(
    false || window.localStorage.getItem("auth") === "true"
  );
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        setUser(userCred.uid); //
        console.log(userCred.uid);
        setAuthorized(true);
        window.localStorage.setItem("auth", "true");
        window.localStorage.setItem("user", userCred.uid);

        axios
          .post(`/user/${userCred.uid}`)
          .then((res) => {
            if (res.data.message === "user already exists") {
              console.log("User profile already exists");
            } else if (
              res.data.message === "user profile created successfully"
            ) {
              console.log("User profile created successfully");
            }
          })
          .catch((err) => {
            console.log("Error creating user profile:", err);
          });

        userCred.getIdToken().then((token) => {
          setToken(token);
          window.localStorage.setItem("token", token);
          // window.localStorage.setItem("user", user);
        });
      } else {
        setAuthorized(false);
        setToken("");
        window.localStorage.removeItem("auth");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
      }
    });
  }, []);
  const handleSignUp = async () => {
    const email = prompt("Please enter your email:");
    const password = prompt("Please enter your password:");

    if (email && password) {
      try {
        const token = await signUp(email, password);
        console.log("Sign-up token:", token);
      } catch (error) {
        console.error("Sign-up error:", error.message);
      }
    } else {
      alert("Email and password cannot be empty.");
    }
  };

  const loginGoogle = async (e) => {
    signInWithPopup(auth, new GoogleAuthProvider()).then((userCred) => {
      if (userCred) {
        setAuthorized(true);
        window.localStorage.setItem("auth", "true");
      }
    });
  };

  const logout = async () => {
    signOut(auth).then(() => {
      setAuthorized(false);
      setToken("");
      window.localStorage.removeItem("auth");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    });
  };

  async function signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Sign-up successful:", user.uid);
      return user.getIdToken();
    } catch (error) {
      console.error("Sign-up error:", error);
      throw error;
    }
  }

  async function signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Sign-in successful:", user.uid);
      return user.getIdToken();
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  }
  return (
    <div className="video-container">
      <video src="/videos/video3.mp4" autoPlay loop muted />
      <h1>Odyssey</h1>
      <p>Get ready to embark on an epic odyssey</p>
      <p>with our trip planner</p>
      <div className="hero-btns">
        {authorized ? (
          <>
            <Button
              className="btns"
              buttonStyle="btn--outline"
              buttonSize="btn--large"
            >
              <Link
                to="/explore"
                state={{ authToken: token }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Explore <i className="fa-solid fa-globe"></i>
              </Link>
            </Button>
            <Button
              className="btns"
              buttonStyle="btn--outline"
              buttonSize="btn--large"
              onClick={logout}
            >
              Logout <i className="fa-solid fa-sign-out"></i>
            </Button>
          </>
        ) : (
          <>
            <div class="container">
              <Button
                className="btns"
                buttonStyle="btn--outline"
                buttonSize="btn--large"
                onClick={loginGoogle}
              >
                Get Started With Google <i className="fa-solid fa-user"></i>
              </Button>
            </div>
            <Login></Login>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoSection;
