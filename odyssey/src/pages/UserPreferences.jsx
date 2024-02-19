import { Button } from "react-bootstrap";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { auth } from "../config/config";

export default function UserPreferences() {
  const [authorized, setAuthorized] = useState(
    false || window.localStorage.getItem("auth") === "true"
  );

  useEffect(() => {
    auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        setAuthorized(true);
        window.localStorage.setItem("auth", "true");
        userCred.getIdToken().then((token) => {
          window.localStorage.setItem("token", token);
        });
      } else {
        setAuthorized(false);
        window.localStorage.removeItem("auth");
        window.localStorage.removeItem("token");
      }
    });
  }, []);

  const logout = async () => {
    signOut(auth).then(() => {
      setAuthorized(false);
      window.localStorage.removeItem("auth");
      window.localStorage.removeItem("token");
    });
  };

  const loginGoogle = async (e) => {
    signInWithPopup(auth, new GoogleAuthProvider()).then((userCred) => {
      if (userCred) {
        setAuthorized(true);
        window.localStorage.setItem("auth", "true");
      }
      console.log(userCred);
    });
  };

  return (
    <>
      {authorized ? (
        // IF AUTHORIZED Content ot render goes here
        <>
          <div className="d-flex h-screen flex-row">
            <div
              className="d-flex h-screen flex-column p-3 bg-light shadow"
              style={{ width: "280px" }}
            >
              <Nav className="flex-column">
                <Nav.Link
                  as={Link}
                  to={"/profile"}
                  className="m-2 bg-dark rounded text-light mb-2 active"
                >
                  <i class="fa-solid fa-user me-2"></i>
                  Profile
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={"/preferences"}
                  className="m-2 bg-dark rounded text-light mb-2"
                >
                  <i class="fa-solid fa-gear me-2"></i>
                  Preferences
                </Nav.Link>
              </Nav>

              <Button className="m-2" size="lg" variant="dark" onClick={logout}>
                Logout <i className="fa-solid fa-sign-out"></i>
              </Button>
            </div>
            <div className="container-fluid flex flex-col p-3 justify-center items-center align-self-start mt-5">
              <h3>Content Goes Here</h3>
            </div>
          </div>
        </>
      ) : (
        // NOT AUTHORIZED Content goes here
        <>
          <div className="flex flex-column" style={{ width: "280px" }}>
            <Button
              className="m-2"
              size="lg"
              variant="dark"
              onClick={loginGoogle}
            >
              Log in <i className="fa-solid fa-user"></i>
            </Button>
          </div>
        </>
      )}
    </>
  );
}
