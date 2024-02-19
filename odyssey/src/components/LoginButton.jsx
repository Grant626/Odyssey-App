import { Button } from "react-bootstrap";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/config";

export default function LoginButton() {
  const loginGoogle = async (e) => {
    signInWithPopup(auth, new GoogleAuthProvider()).then((userCred) => {
      if (userCred) {
        window.localStorage.setItem("auth", "true");
      }
      console.log(userCred);
    });
  };

  return (
    <Button className="m-2" size="lg" variant="dark" onClick={loginGoogle}>
      Log in <i className="fa-solid fa-user"></i>
    </Button>
  );
}
